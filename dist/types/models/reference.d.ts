import { BossSerializable } from 'unicrypto';
declare enum ReferenceType {
    TYPE_TRANSACTIONAL = 1,
    TYPE_EXISTING_DEFINITION = 2,
    TYPE_EXISTING_STATE = 3
}
export default class Reference implements BossSerializable {
    static className: string;
    static TYPE_TRANSACTIONAL: ReferenceType;
    static TYPE_EXISTING_DEFINITION: ReferenceType;
    static TYPE_EXISTING_STATE: ReferenceType;
    fields: Array<any>;
    roles: Array<any>;
    signedBy: Array<any>;
    transactionalId: any;
    required: boolean;
    name: string;
    type: ReferenceType;
    where: any;
    constructor(name: string, type: ReferenceType, where: any);
    serializeToBOSS(): {
        fields: any[];
        roles: any[];
        signed_by: any[];
        transactional_id: any;
        required: boolean;
        name: string;
        type: ReferenceType;
        where: any;
    };
    static deserializeFromBOSS(serialized: any): Reference;
}
export {};
//# sourceMappingURL=reference.d.ts.map