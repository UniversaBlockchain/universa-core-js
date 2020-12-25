import { Boss, BossSerializable, PrivateKey } from 'unicrypto';
import Contract from './contract';
import HashId from './hash_id';

type ItemRegistry = { [hashId: string]: Contract };

interface TransactionPackOptions {
  subItems?: Array<Uint8Array>,
  referencedItems?: Array<Uint8Array>,
  tags?: { [tag: string]: HashId },
  keys?: Array<Uint8Array>
}

interface TaggedItem {
  hashId: HashId,
  contract: Contract
}

const TAG_PREFIX_RESERVED = 'universa:';

export default class TransactionPack implements BossSerializable {
  contract: Contract;
  subItems: { [hashId64: string]: Contract } = {};
  referencedItems: { [hashId64: string]: Contract } = {};
  taggedItems: { [tag: string]: TaggedItem } = {};
  ready: Promise<void>;

  constructor(contractPacked: Uint8Array, options?: TransactionPackOptions) {
    const self = this;
    const opts = options || {};
    const subItemsPacked = opts.subItems || [];
    const referencedItemsPacked = opts.referencedItems || [];
    const tags: { [tag: string]: HashId } = opts.tags || {};

    this.contract = Contract.unpack(contractPacked);

    this.ready = new Promise((resolve, reject) => {
      const subLoaders = subItemsPacked.map(async (item) => {
        const contract = Contract.unpack(item);
        const hashId = await contract.hashId();

        self.subItems[hashId.base64] = contract;
      });

      const refLoaders = referencedItemsPacked.map(async (item) => {
        const contract = Contract.unpack(item);
        const hashId = await contract.hashId();

        self.referencedItems[hashId.base64] = contract;
      });

      const tagLoaders: Promise<void>[] = [];

      async function loadTag(tag: string) {
        const hashId = tags[tag];
        const hashId64 = hashId.base64;

        const contractId = await self.contract.hashId();

        if (contractId.base64 === hashId64) self.taggedItems[tag] = {
          contract: self.contract,
          hashId
        };

        const item = self.subItems[hashId64] || self.referencedItems[hashId64];
        if (item) self.taggedItems[tag] = { hashId, contract: item };
      }

      for (let tag in tags) tagLoaders.push(loadTag(tag));

      const loaders = subLoaders.concat(refLoaders).concat(tagLoaders);

      Promise.all(loaders).then(() => resolve());
    });
  }

  async getItem(hashId: HashId) {
    await this.ready;

    const hashId64 = hashId.base64;

    const contractId = await this.contract.hashId();
    if (contractId.base64 === hashId64) return this.contract;

    return this.subItems[hashId64] || this.referencedItems[hashId64];
  }

  async getTag(tag: string) {
    await this.ready;

    return this.taggedItems[tag];
  }

  async addTag(tag: string, hashId: HashId) {
    if (tag.startsWith(TAG_PREFIX_RESERVED))
      throw new Error('tag can\'t start with reserved words');

    await this.ready;

    const contract = await this.getItem(hashId);
    if (!contract) throw new Error('Can\'t add tag for non-existing item');

    this.taggedItems[tag] = {
      hashId,
      contract
    };
  }

  async addSubItem(itemPacked: Uint8Array) {
    const item = Contract.unpack(itemPacked);
    const hashId = await item.hashId();

    this.subItems[hashId.base64] = item;
  }

  async addReferencedItem(itemPacked: Uint8Array) {
    const item = Contract.unpack(itemPacked);
    const hashId = await item.hashId();

    this.referencedItems[hashId.base64] = item;
  }

  async pack() {
    await this.ready;

    return Boss.dump(this);
  }

  static unpack(packed: Uint8Array): TransactionPack {
    return Boss.load(packed) as TransactionPack;
  }

  static className = "TransactionPack";

  serializeToBOSS() {
    const subItems: Uint8Array[] = [];
    const referencedItems: Uint8Array[] = [];
    const tags: { [tag: string]: HashId } = {};

    for (let hashId64 in this.subItems) {
      subItems.push(this.subItems[hashId64].binary as Uint8Array);
    }

    for (let hashId64 in this.referencedItems) {
      referencedItems.push(this.referencedItems[hashId64].binary as Uint8Array);
    }

    for (let tag in this.taggedItems) {
      tags[tag] = this.taggedItems[tag].hashId;
    }

    return {
      contract: this.contract.binary,
      subItems,
      referencedItems,
      tags
    };
  }

  static deserializeFromBOSS(serialized: any) {
    return new TransactionPack(serialized.contract, {
      subItems: serialized.subItems || [],
      referencedItems: serialized.referencedItems || [],
      tags: serialized.tags || {}
    });
  }

  async sign(key: PrivateKey) {
    await this.contract.sign(key);
    // update binary. should update tags?
    this.contract.pack();
  }
}

Boss.register("TransactionPack", TransactionPack);
