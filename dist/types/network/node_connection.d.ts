import { Node } from './node';
import { PrivateKey, PublicKey } from 'unicrypto';
import { SymmetricKey } from 'unicrypto';
export default class NodeConnection {
    node: Node;
    authKey: PrivateKey;
    nodeURL: string;
    sessionId: number | undefined;
    sessionKey: SymmetricKey | undefined;
    version: number | undefined;
    nodePublicKey: PublicKey | undefined;
    constructor(node: Node, authKey: PrivateKey, directConnection?: boolean);
    connect(): Promise<this>;
    command(name: string, params?: any, requestOptions?: any): Promise<any>;
    request(path: string, params?: any, requestOptions?: any): import("../utils").Cancelable<any>;
    static request(method: string, url: string, options?: any): import("../utils").Cancelable<any>;
    static xchangeRequest(method: string, url: string, options?: any): import("../utils").Cancelable<any>;
}
//# sourceMappingURL=node_connection.d.ts.map