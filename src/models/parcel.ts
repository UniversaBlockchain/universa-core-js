import { Boss, BossSerializable } from 'unicrypto';

import Big from 'big.js';
// import Contract from './contract';
import HashId from './hash_id';
import TransactionPack from './transaction_pack';

// type ItemRegistry = { [hashId: string]: Contract };

interface PaymentOptions {
  isTestnet?: boolean,
  createdAt?: Date
}

export default class Parcel implements BossSerializable {
  paymentBin: Uint8Array;
  payloadBin: Uint8Array;
  hashId: HashId;

  payment: TransactionPack;
  payload: TransactionPack;

  constructor(
    payment: Uint8Array,
    payload: Uint8Array,
    hashId: HashId
  ) {
    this.paymentBin = payment;
    this.payloadBin = payload;
    this.payment = Boss.load(payment);
    this.payload = Boss.load(payload);
    this.hashId = hashId;
  }

  static className = "Parcel";

  serializeToBOSS() {
    return {
      payment: this.paymentBin,
      payload: this.payloadBin,
      hashId: this.hashId
    };
  }

  static deserializeFromBOSS(serialized: any) {
    return new Parcel(serialized.payment, serialized.payload, serialized.hashId);
  }

  static async create(payment: Uint8Array, payload: Uint8Array) {
    const paymentId = (await HashId.calculate(payment)).composite3;
    const payloadId = (await HashId.calculate(payload)).composite3;
    const composite = new Uint8Array(paymentId.length + payloadId.length);
    composite.set(paymentId);
    composite.set(payloadId, paymentId.length);

    const id = await HashId.calculate(composite);

    return new Parcel(payment, payload, id);
  }

  static async createPayment(
    amount: number,
    upack: TransactionPack,
    options: PaymentOptions = {}
  ) {
    let key = 'transaction_units';
    if (options.isTestnet) key = 'test_transaction_units';

    const uOld = upack.contract;
    if (!uOld.binary)
      throw new Error('Can\'t create payment with draft u pack');

    // const balanceBig = new Big(uOld.state.data[key]);
    // const amountBig = new Big(amount);
    // if (amountBig.gt(balanceBig)) throw new Error('not enough U');
    // const balanceNewBig = balanceBig.minus(amountBig);

    const balance = uOld.state.data[key];
    if (amount > balance) throw new Error('not enough U');
    const balanceNew = balance - amount;

    const uNew = await uOld.createRevision(options.createdAt);
    // uNew.state.data[key] = balanceNewBig.toPrecision();
    uNew.state.data[key] = balanceNew;

    // FIXME: should move to other place
    uNew.capsule.contract.setCreatorTo('owner');
    uNew.packData();

    return new TransactionPack(uNew.pack(), { subItems: [uOld.binary]});
  }
}

Boss.register("Parcel", Parcel);
