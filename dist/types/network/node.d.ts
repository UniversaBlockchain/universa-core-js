import { PublicKey } from 'unicrypto';
export interface NodeInfo {
    name: string;
    number: number;
    domain_urls: Array<string>;
    direct_urls: Array<string>;
    key: Uint8Array;
}
export declare class Node {
    id: string | undefined;
    key: PublicKey | undefined;
    name: string;
    http: string;
    https: string;
    ready: Promise<void>;
    keyBIN: Uint8Array;
    number: number;
    domainURLs: Set<string>;
    directURLs: Set<string>;
    constructor(info: NodeInfo);
    getId(): Promise<string | undefined>;
    getPublicKey(): Promise<PublicKey | undefined>;
    equals(node: Node): Promise<boolean>;
    info(): {
        name: string;
        number: number;
        domain_urls: string[];
        direct_urls: string[];
        key: string;
    };
    getTopology(directConnection?: boolean): Promise<any>;
}
//# sourceMappingURL=node.d.ts.map