import { BossSerializable, PrivateKey } from 'unicrypto';
import Contract from './contract';
import HashId from './hash_id';
interface TransactionPackOptions {
    subItems?: Array<Uint8Array>;
    referencedItems?: Array<Uint8Array>;
    tags?: {
        [tag: string]: HashId;
    };
    keys?: Array<Uint8Array>;
}
interface TaggedItem {
    hashId: HashId;
    contract: Contract;
}
export default class TransactionPack implements BossSerializable {
    contract: Contract;
    subItems: {
        [hashId64: string]: Contract;
    };
    referencedItems: {
        [hashId64: string]: Contract;
    };
    taggedItems: {
        [tag: string]: TaggedItem;
    };
    ready: Promise<void>;
    constructor(contractPacked: Uint8Array, options?: TransactionPackOptions);
    getItem(hashId: HashId): Promise<Contract>;
    getTag(tag: string): Promise<TaggedItem>;
    addTag(tag: string, hashId: HashId): Promise<void>;
    addSubItem(itemPacked: Uint8Array): Promise<void>;
    addReferencedItem(itemPacked: Uint8Array): Promise<void>;
    pack(): Promise<Uint8Array>;
    static unpack(packed: Uint8Array): TransactionPack;
    static className: string;
    serializeToBOSS(): {
        contract: Uint8Array | null;
        subItems: Uint8Array[];
        referencedItems: Uint8Array[];
        tags: {
            [tag: string]: HashId;
        };
    };
    static deserializeFromBOSS(serialized: any): TransactionPack;
    sign(key: PrivateKey): Promise<void>;
}
export {};
//# sourceMappingURL=transaction_pack.d.ts.map