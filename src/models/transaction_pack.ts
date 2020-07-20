import { Boss } from 'unicrypto';
import Contract from './contract';
import HashId from './hash_id';

type ItemRegistry = { [hashId: string]: Contract };

export default class TransactionPack {
  contract: Contract;
  subItems: Array<Contract>;
  referencedItems: Array<Contract>;
  items: ItemRegistry;
  ready: Promise<void>;

  constructor(bin: Uint8Array) {
    const self = this;
    const raw = Boss.load(bin);
    this.contract = new Contract(raw.contract);
    this.items = {};
    this.subItems = loadReferences(raw.subItems);
    this.referencedItems = loadReferences(raw.referencedItems);
    this.subItems.map(index);
    this.referencedItems.map(index);

    async function index(contract: Contract) {
      const hashId = await contract.hashId();
      self.items[hashId.base64] = contract;
    }

    this.ready = new Promise((resolve, reject) => {
      const subLoaders = self.subItems.map(index);
      const referencedLoaders = self.referencedItems.map(index);

      Promise.all(subLoaders.concat(referencedLoaders)).then(() => resolve());
    });
  }

  async getItem(hashId: HashId) {
    await this.ready;

    return this.items[hashId.base64];
  }
}

function loadReferences(refs: Array<Uint8Array> | null) {
  return (refs || []).map(bin => new Contract(bin));
}
