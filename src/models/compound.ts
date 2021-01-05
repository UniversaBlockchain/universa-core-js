import { PrivateKey, decode64 } from 'unicrypto';
import TransactionPack from './transaction_pack';
import HashId from './hash_id';

export default class Compound {
  tpack: TransactionPack;

  constructor(tpack: TransactionPack) {
    this.tpack = tpack;
  }

  static unpack(bin: Uint8Array): Compound {
    return new Compound(TransactionPack.unpack(bin));
  }

  pack() {
    return this.tpack.pack();
  }

  private getDefinitionContracts() {
    return this.tpack.contract.definition.data.contracts;
  }

  // create(expiresAt: Date) {
  //   const contract =
  // }

  getTags(): Array<string> {
    return Object.keys(this.getDefinitionContracts() || {});
  }

  sign(privateKey: PrivateKey) {
    return this.tpack.sign(privateKey);
  }

  async getTag(tag: string) {
    const contracts = this.getDefinitionContracts() || {};

    const contractInfo = contracts[tag];
    if (!contractInfo) return null;

    const mainId = new HashId(decode64(contractInfo.id));
    const mainContract = await this.tpack.getItem(mainId);

    const tpack = new TransactionPack(mainContract.binary as Uint8Array);

    const newItemIds = mainContract.capsule.new;
    const revokingItemIds = mainContract.capsule.revoking;
    const subItemIds = newItemIds.concat(revokingItemIds);

    for (let i = 0; i < subItemIds.length; i++) {
      let id = subItemIds[i];
      let contract = await this.tpack.getItem(id);
      await tpack.addSubItem(contract.binary as Uint8Array);
    }

    const refs: Array<string> = contractInfo.refs || [];

    for (let i = 0; i < refs.length; i++) {
      let id = new HashId(decode64(refs[i]));
      let contract = await this.tpack.getItem(id);
      await tpack.addReferencedItem(contract.binary as Uint8Array);
    }

    const tags: { [tag: string]: string } = contractInfo.tags || {};

    for (let tag in tags) {
      let id = new HashId(decode64(tags[tag]));
      await tpack.addTag(tag, id);
    }

    return tpack;
  }

  getItem(hashId: HashId) {
    return this.tpack.getItem(hashId);
  }
}
