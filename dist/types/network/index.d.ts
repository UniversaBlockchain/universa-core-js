import Topology from './topology';
import { Cancelable } from '../utils';
import NodeConnection from './node_connection';
import TransactionPack from '../models/transaction_pack';
import Parcel from '../models/parcel';
import HashId from '../models/hash_id';
import { PrivateKey } from 'unicrypto';
interface NetworkOptions {
    topologyKey?: string;
    topology?: Topology;
    topologyFile?: string;
    directConnection?: boolean;
}
interface ContractState {
    isApproved: boolean;
    isTestnet: boolean;
    states: any;
}
export interface NetworkApproval {
    id: Uint8Array;
    meanTime: Date;
    stdevSeconds: number;
    trustLevel: number;
}
interface ParcelState {
    payment: ItemResult;
    payload: ItemResult;
}
interface ItemResult {
    createdAt: Date | null;
    extra: any;
    __type: string;
    isTestnet: boolean;
    state: string;
    haveCopy: boolean;
    lockedById: any;
    expiresAt: Date | null;
    errors: any;
}
type ConnectionDict = {
    [id: string]: NodeConnection;
};
export default class Network {
    options: NetworkOptions;
    connections: ConnectionDict;
    topologyKey: string;
    directConnection: boolean;
    ready: Promise<void>;
    authKey: PrivateKey;
    setReady: any;
    topology: Topology | undefined;
    timeOffset: number | null;
    timeUpdatedAt: number | null;
    constructor(privateKey: PrivateKey, options?: NetworkOptions);
    size(): number;
    getLastTopology(): Promise<Topology>;
    saveNewTopology(): void;
    connect(): Promise<this>;
    nodeConnection(nodeId: string): Promise<NodeConnection>;
    getRandomConnection(): Promise<NodeConnection>;
    command(name: string, options?: any, connection?: NodeConnection, requestOptions?: any): Cancelable<any>;
    getState(id: HashId | Uint8Array | string, connection?: NodeConnection, requestOptions?: any): Cancelable<any>;
    checkParcel(id: Uint8Array | string): Cancelable<any>;
    checkContract(id: HashId | Uint8Array | string, trustLevel: number): Promise<NetworkApproval | null>;
    isApprovedExtended(id: Uint8Array | string, trustLevel: number, onNodeResponse?: (response: any) => void): Promise<ContractState>;
    isApproved(id: Uint8Array | string, trustLevel: number): Promise<boolean>;
    now(): Date;
    loadNetworkTime(): Promise<void>;
    static getCost(tpack: TransactionPack): Promise<any>;
    registerParcel(parcel: Parcel): Promise<ParcelState>;
}
export {};
//# sourceMappingURL=index.d.ts.map