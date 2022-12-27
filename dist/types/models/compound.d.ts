import { PrivateKey } from 'unicrypto';
import TransactionPack from './transaction_pack';
import HashId from './hash_id';
export default class Compound {
    tpack: TransactionPack;
    constructor(tpack: TransactionPack);
    static unpack(bin: Uint8Array): Compound;
    pack(): Promise<Uint8Array>;
    private getDefinitionContracts;
    getTags(): Array<string>;
    sign(privateKey: PrivateKey): Promise<void>;
    getTag(tag: string): Promise<TransactionPack | null>;
    getItem(hashId: HashId): Promise<import("./contract").default>;
}
//# sourceMappingURL=compound.d.ts.map