import { Boss, BossSerializable, PrivateKey } from 'unicrypto';
import Contract from './contract';
import HashId from './hash_id';

type ItemRegistry = { [hashId: string]: Contract };

interface TransactionPackOptions {
  subItems?: Array<Uint8Array>,
  referencedItems?: Array<Uint8Array>
}

export default class TransactionPack implements BossSerializable {
  contract: Contract;
  subItems: Array<Contract> = [];
  referencedItems: Array<Contract> = [];
  items: ItemRegistry;
  ready: Promise<void>;

  contractPacked: Uint8Array;
  subItemsPacked: Array<Uint8Array> = [];
  referencedItemsPacked: Array<Uint8Array> = [];

  constructor(contractPacked: Uint8Array, options?: TransactionPackOptions) {
    this.contractPacked = contractPacked;

    if (options) {
      this.subItemsPacked = options.subItems || [];
      this.referencedItemsPacked = options.referencedItems || [];
    }

    this.contract = Contract.unpack(contractPacked);
    this.subItems = this.subItemsPacked.map(packed => Contract.unpack(packed));
    this.referencedItems = this.referencedItemsPacked.map(
      packed => Contract.unpack(packed)
    );

    const self = this;
    this.items = {};

    async function index(contract: Contract) {
      const hashId = await contract.hashId();

      if (hashId) self.items[hashId.base64] = contract;
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

  static className = "TransactionPack";

  serializeToBOSS() {
    return {
      contract: this.contractPacked,
      subItems: this.subItemsPacked,
      referencedItems: this.referencedItemsPacked
    };
  }

  static deserializeFromBOSS(serialized: any) {
    return new TransactionPack(serialized.contract, {
      subItems: serialized.subItems || [],
      referencedItems: serialized.referencedItems || []
    });
  }

  async sign(key: PrivateKey) {
    console.log("run sign tpack");
    await this.contract.sign(key);
    console.log("run pack tpack contract");
    this.contractPacked = this.contract.pack();
  }
}

Boss.register("TransactionPack", TransactionPack);

function loadReferences(refs: Array<Uint8Array> | null) {
  return (refs || []).map(bin => new Contract(bin));
}
