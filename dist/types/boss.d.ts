import { BossSerializable, BossDeserializable } from 'unicrypto';
declare class BossSingleton {
    private static instance;
    private constructor();
    static getInstance(): BossSingleton;
    register<T extends BossSerializable>(alias: string, clz: BossDeserializable<T>): void;
    dump(data: any): Uint8Array;
    load(packed: Uint8Array): any;
}
export default BossSingleton;
//# sourceMappingURL=boss.d.ts.map