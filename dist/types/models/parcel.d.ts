import { BossSerializable } from 'unicrypto';
import HashId from './hash_id';
import TransactionPack from './transaction_pack';
interface PaymentOptions {
    isTestnet?: boolean;
    createdAt?: Date;
}
export default class Parcel implements BossSerializable {
    paymentBin: Uint8Array;
    payloadBin: Uint8Array;
    hashId: HashId;
    payment: TransactionPack;
    payload: TransactionPack;
    constructor(payment: Uint8Array, payload: Uint8Array, hashId: HashId);
    static className: string;
    serializeToBOSS(): {
        payment: Uint8Array;
        payload: Uint8Array;
        hashId: HashId;
    };
    static deserializeFromBOSS(serialized: any): Parcel;
    static create(payment: Uint8Array, payload: Uint8Array): Promise<Parcel>;
    static createPayment(amount: number, upack: TransactionPack, options?: PaymentOptions): Promise<TransactionPack>;
    pack(): Uint8Array;
    static unpack(bin: Uint8Array): Parcel;
}
export {};
//# sourceMappingURL=parcel.d.ts.map