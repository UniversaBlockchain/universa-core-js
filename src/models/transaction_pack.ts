import { Boss } from 'unicrypto';
import { Contract } from './contract';
import HashId from './hash_id';

type ItemRegistry = { [hashId: string]: Contract }

export class TransactionPack {
  contract: Contract;
  subItems: Array<Contract>;
  referencedItems: Array<Contract>;
  items: ItemRegistry;

  constructor(bin: Uint8Array) {
    const self = this;
    const boss = new Boss();
    const raw = boss.load(bin);
    this.contract = new Contract(raw.contract);
    this.items = {};
    this.subItems = loadReferences(raw.subItems);
    this.referencedItems = loadReferences(raw.referencedItems);
    this.subItems.map(index);
    this.referencedItems.map(index);

    function index(contract: Contract) {
      self.items[contract.hashId.base64] = contract;
    }
  }

  getItem(hashId: HashId) {
    return this.items[hashId.base64];
  }
}

function loadReferences(refs: Array<Uint8Array> | null) {
  return (refs || []).map(bin => new Contract(bin));
}
