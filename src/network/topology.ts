import { Node, NodeInfo } from './node';

const randomIndex = (arrayLength: number) => ~~(arrayLength * Math.random());

type NodeDictionary = { [id: string]: Node };

export default class Topology {
  nodes: NodeDictionary;
  updatedAt: Date;

  constructor(nodes: NodeDictionary, updatedAt: Date) {
    this.nodes = nodes;
    this.updatedAt = updatedAt;
  }

  async update() {
    const trustLevel = 0.4;
    const self = this;
    const confirmed: { [id: string]: any } = {};
    const failed: { [id: string]: boolean } = {};

    interface NodeCount {
      count: number,
      node: Node
    };

    const stats: { [id: string]: Array<NodeCount> } = {};

    async function addStats(nodes: Array<Node>) {
      const queue = nodes.map(async (node) => {
        const nodeId = await node.getId();
        if (!nodeId) return;

        if (!stats[nodeId]) stats[nodeId] = [];

        let found = false;

        const queue = stats[nodeId].map(async (stat, i) => {
          if (await stat.node.equals(node)) {
            found = true;
            stats[nodeId][i].count++;
          }
        });

        return Promise.all(queue).then(() => {
          if (!found) stats[nodeId].push({ count: 1, node });
        });
      });

      return Promise.all(queue);
    }

    function buildFinal(trustLevel: number) {
      const nodes: { [id: string]: Node } = {};

      for (var id in stats) {
        let total = 0;
        const list = stats[id];

        list.map(stat => {
          total += stat.count;
        });

        let trusted;

        if (trustLevel !== 0)
          trusted = list.find(n => n.count/total >= trustLevel);
        else {
          const maximum = Math.max.apply(null, list.map(n => n.count));
          trusted = list.find(n => n.count === maximum);
        }

        if (trusted) nodes[id] = trusted.node;
      }

      return nodes;
    }

    function colloquium(trustLevel: number, nodesToAsk?: NodeDictionary) {
      return new Promise((resolve, reject) => {
        let Nt = Math.ceil(self.size() * trustLevel);
        if (Nt < 1) Nt = 1;
        let resultFound = false;
        const source = nodesToAsk || self.nodes;
        const ids = Object.keys(source);

        function success() {
          if (resultFound) return;

          resultFound = true;
          resolve({ failed, confirmed });
        }

        function failure(err: Error) {
          if (resultFound) return;

          resultFound = true;
          reject(err);
        }

        function processNext() {
          if (resultFound) return;

          const id = ids.pop();
          id && processNode(id);
        }

        async function processNode(id: string) {
          if (resultFound) return;

          try {
            const response = await source[id].getTopology();
            await processResponse(id, response);
          } catch(err) {
            // console.log("On topology request: ", err);
            failed[id] = true;
            if (ids.length > 0) processNext();
            else failure(new Error("confirmed responses < 40%"));
          }
        }

        async function processResponse(id: string, resp: any) {
          if (resultFound) return;

          confirmed[id] = resp;
          delete failed[id];

          const responseNodes: Array<NodeInfo> = resp.nodes;

          await addStats(responseNodes.map(info => new Node(info)));

          if (Object.keys(confirmed).length >= Nt) success();
        }

        for (var i = 0; i < Nt; i++) {
          const idToProcess = ids.pop();
          idToProcess && processNode(idToProcess);
        }
      });
    }

    try {
      await colloquium(0.4);
    } catch(err) {

      const tempResult = buildFinal(0);
      for (var id in tempResult) if (!failed[id]) delete tempResult[id];

      await colloquium(0.4, tempResult);
    }

    this.nodes = buildFinal(0.9);
    this.updatedAt = new Date();
  }

  size() { return Object.keys(this.nodes).length; }

  pack() {
    const list: Array<any> = [];
    for (var id in this.nodes) list.push(this.nodes[id].info());

    const updatedSec = (this.updatedAt.getTime()/1000).toString();

    return {
      list,
      updated: parseInt(updatedSec)
    };
  }

  getRandomNode() {
    return this.getNode(this.getRandomNodeId());
  }

  getRandomNodeId() {
    const ids = Object.keys(this.nodes);
    return ids[randomIndex(ids.length)];
  }

  getNode(id: string) {
    return this.nodes[id];
  }

  static async load(packed: any) {
    const nodes: { [id: string]: Node } = {};
    const list: Array<NodeInfo> = packed.list;

    const queue = list.map(async (info) => {
      const node = new Node(info);
      const nodeId = await node.getId();
      if (!nodeId) throw new Error("invalid node");
      nodes[nodeId] = node;
    });

    return Promise.all(queue).then(() => {
      return new Topology(
        nodes,
        new Date(packed.updated * 1000)
      );
    });
  }
}
