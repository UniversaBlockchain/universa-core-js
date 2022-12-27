import { BossSerializable } from 'unicrypto';
interface HashIdSerialized {
    composite3: Uint8Array;
}
export default class HashId implements BossSerializable {
    composite3: Uint8Array;
    constructor(composite3: Uint8Array);
    static calculate(bin: Uint8Array): Promise<HashId>;
    get base64(): string;
    equals(hashId: HashId): boolean;
    static className: string;
    serializeToBOSS(): {
        composite3: Uint8Array;
    };
    static deserializeFromBOSS(serialized: HashIdSerialized): HashId;
    static unpack(bin: Uint8Array): HashId;
    pack(): Uint8Array;
}
export {};
//# sourceMappingURL=hash_id.d.ts.map