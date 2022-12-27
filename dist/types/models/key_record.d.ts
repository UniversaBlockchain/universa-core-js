import { PublicKey, BossSerializable } from 'unicrypto';
import { Dict } from '../utils';
export default class KeyRecord implements BossSerializable {
    keyPacked: Uint8Array;
    keyLoader: Promise<PublicKey>;
    key: PublicKey | null;
    extra: Dict;
    constructor(keyPacked: Uint8Array, extra?: Dict, key?: PublicKey);
    getKey(): Promise<PublicKey>;
    setExtra(extra: Dict): void;
    static create(key: PublicKey, extra?: Dict): KeyRecord;
    static className: string;
    serializeToBOSS(): {
        key: {
            __t: string;
            packed: Uint8Array;
        };
    } & Dict;
    static deserializeFromBOSS(serialized: any): KeyRecord;
    pack(): Uint8Array;
    static unpack(bin: Uint8Array): KeyRecord;
}
//# sourceMappingURL=key_record.d.ts.map