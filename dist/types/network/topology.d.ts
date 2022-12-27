import { Node } from './node';
type NodeDictionary = {
    [id: string]: Node;
};
export default class Topology {
    nodes: NodeDictionary;
    updatedAt: Date;
    constructor(nodes: NodeDictionary, updatedAt: Date);
    update(directConnection?: boolean): Promise<void>;
    size(): number;
    pack(): {
        list: any[];
        updated: number;
    };
    getRandomNode(): Node;
    getRandomNodeId(): string;
    getNode(id: string): Node;
    static load(packed: any): Promise<Topology>;
}
export {};
//# sourceMappingURL=topology.d.ts.map