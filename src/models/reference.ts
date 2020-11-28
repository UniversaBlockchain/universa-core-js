import { Boss, BossSerializable } from 'unicrypto';
import HashId from './hash_id';

enum ReferenceType {
  TYPE_TRANSACTIONAL = 1,
  TYPE_EXISTING_DEFINITION = 2,
  TYPE_EXISTING_STATE = 3
}

export default class Reference implements BossSerializable {
  static className = "Reference";
  static TYPE_TRANSACTIONAL = ReferenceType.TYPE_TRANSACTIONAL;
  static TYPE_EXISTING_DEFINITION = ReferenceType.TYPE_EXISTING_DEFINITION;
  static TYPE_EXISTING_STATE = ReferenceType.TYPE_EXISTING_STATE;

  fields: Array<any> = [];
  roles: Array<any> = [];
  signedBy: Array<any> = [];
  transactionalId: any = '';
  required: boolean = true;

  name: string;
  type: ReferenceType;
  where: any;

  constructor(
    name: string,
    type: ReferenceType,
    where: any
  ) {
    this.name = name;
    this.type = type;
    this.where = where;
  }

  serializeToBOSS() {
    return {
      'fields': this.fields,
      'roles': this.roles,
      'signed_by': this.signedBy,
      'transactional_id': this.transactionalId,
      'required': this.required,
      'name': this.name,
      'type': this.type,
      'where': this.where
    };
  }

  static deserializeFromBOSS(serialized: any) {
    const ref = new Reference(
      serialized['name'],
      serialized['type'],
      serialized['where']
    );

    ref.required = serialized.required;
    ref.transactionalId = serialized['transactional_id'];

    return ref;
  }
}

Boss.register("Reference", Reference);
