import { PublicKey, KeyAddress } from 'unicrypto';
export type Primitive = string | number | Date | null | undefined;
export type Dict = {
    [key: string]: Primitive | Dict;
};
export interface RetryOptions {
    attempts?: number;
    interval?: number;
    exponential?: boolean;
    onError?: any;
}
export declare function retry(fn: any, options?: RetryOptions): Promise<any>;
export declare function abortable(responsePromise: Promise<any>, request: any): Cancelable<any>;
export declare class Canceled extends Error {
    constructor(reason?: string);
}
export interface Cancelable<T> extends Promise<T> {
    cancel(): Cancelable<T>;
}
export declare function readJSON(path: string): Promise<unknown>;
export declare function isSuperset(set: Set<string>, subset: Set<string>): boolean;
export declare function createAddressSet(keys?: Array<PublicKey>, addresses?: Array<KeyAddress>): Set<string>;
export declare function omitBOSS(serialized: any, fields: Array<string>): any;
//# sourceMappingURL=utils.d.ts.map