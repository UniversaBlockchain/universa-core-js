import { KeyAddress, PublicKey, PrivateKey } from 'unicrypto';
import Capsule from './capsule';
import Reference from './reference';
import { CreateCapsuleOptions } from './capsule';
import HashId from './hash_id';
import { Role } from './roles/role';
interface ContractOptions {
    type?: string;
    version?: number;
    binary?: Uint8Array;
}
interface signedByOptions {
    address?: KeyAddress;
    publicKey?: PublicKey;
}
export default class Contract {
    type: string;
    version: number;
    signatures: Array<Uint8Array>;
    data: Uint8Array;
    capsule: Capsule;
    binary: Uint8Array | null;
    constructor(data: Uint8Array, signatures?: Array<Uint8Array>, options?: ContractOptions);
    get issuer(): Role;
    get owner(): Role;
    set owner(role: Role);
    get creator(): Role;
    set creator(role: Role);
    setCreatorTo(roleName: string): void;
    get parent(): HashId | null;
    get origin(): HashId | null;
    get definition(): import("./universa_contract").Definition;
    get state(): import("./universa_contract").State;
    get transactional(): any;
    hashId(): Promise<HashId>;
    getSignatureKeys(): Promise<PublicKey[]>;
    isSignedBy(options: signedByOptions): Promise<boolean>;
    sign(privateKey: PrivateKey): Promise<void>;
    static create(issuer: Role, options: CreateCapsuleOptions): Contract;
    packData(): void;
    pack(): Uint8Array;
    createRevision(createdAt?: Date): Promise<Contract>;
    static unpack(binary: Uint8Array): Contract;
    resetTransactional(): void;
    createTransactional(id: string | null): void;
    addReference(ref: Reference): void;
}
export {};
//# sourceMappingURL=contract.d.ts.map