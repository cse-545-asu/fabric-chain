import { Context, Contract, Returns, Transaction } from 'fabric-contract-api';
import stringify from 'json-stringify-deterministic';
import sortKeysRecursive from 'sort-keys-recursive';
import { Diagnosis } from './diagnosis';
import { Insurance } from './insurance';
import { Transaction as T } from './transaction';

export class MainContract extends Contract {
  @Transaction()
  public async InitLedger(ctx: Context): Promise<void> {
    const assets = [];

    for (const asset of assets) {
      asset.docType = 'asset';
      // example of how to write to world state deterministically
      // use convetion of alphabetic order
      // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
      // when retrieving data, in any lang, the order of data will be the same and consequently also the corresonding hash
      await ctx.stub.putState(
        asset.ID,
        Buffer.from(stringify(sortKeysRecursive(asset)))
      );
      console.info(`Asset ${asset.ID} initialized`);
    }
  }
  @Transaction()
  public async CreateDiagnosisAsset(
    ctx: Context,
    id: string,
    type: string,
    doctorId: string,
    patientId: string,
    appointmentId: string,
    diagnosis: string,
    testRecommendations: string,
    prescription: string
  ): Promise<void> {
    let d: Diagnosis;
    d = {
      ID: id,
      Type: type,
      DoctorID: doctorId,
      PatientID: patientId,
      AppointmentID: appointmentId,
      Diagnosis: diagnosis,
      TestRecommendations: testRecommendations,
      Prescription: prescription,
    };
    const exists = await this.AssetExists(ctx, id);
    if (exists) {
      throw new Error(`The asset ${id} already exists`);
    }
    await ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(d))));
  }

  @Transaction()
  public async CreateTransactionAsset(
    ctx: Context,
    id: string,
    type: string,
    patientId: string,
    method: string,
    paymentType: string,
    mode: string,
    amount: number,
    status: string,
    createdOn: Date,
    testId?: string,
    appointmentId?: string
  ): Promise<void> {
    let t: T;
    t = {
      ID: id,
      Type: type,
      PatientID: patientId,
      AppointmentID: appointmentId && appointmentId,
      TestID: testId && testId,
      PaymentType: paymentType,
      Method: method,
      Mode: mode,
      Amount: amount,
      Status: status,
      CreatedOn: createdOn,
    };
    const exists = await this.AssetExists(ctx, id);
    if (exists) {
      throw new Error(`The asset ${id} already exists`);
    }
    await ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(t))));
  }

  @Transaction()
  public async CreateInsuranceAsset(
    ctx: Context,
    id: string,
    type: string,
    patientId: string,
    paymentId: string,
    status: string
  ): Promise<void> {
    let i: Insurance;
    i = {
      ID: id,
      Type: type,
      PatientID: patientId,
      PaymentID: paymentId,
      Status: status,
    };
    const exists = await this.AssetExists(ctx, id);
    if (exists) {
      throw new Error(`The asset ${id} already exists`);
    }
    await ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(i))));
  }

  @Transaction(false)
  public async ReadAsset(ctx: Context, id: string): Promise<string> {
    const assetJSON = await ctx.stub.getState(id);
    if (!assetJSON || assetJSON.length === 0) {
      throw new Error(`The asset ${id} does not exist`);
    }
    return assetJSON.toString();
  }

  @Transaction(false)
  @Returns('boolean')
  public async AssetExists(ctx: Context, id: string): Promise<boolean> {
    const assetJSON = await ctx.stub.getState(id);
    return assetJSON && assetJSON.length > 0;
  }

  @Transaction(false)
  @Returns('string')
  public async GetAllAssets(ctx: Context): Promise<string> {
    const allResults = [];
    const iterator = await ctx.stub.getStateByRange('', '');
    let result = await iterator.next();
    while (!result.done) {
      const strValue = Buffer.from(result.value.value.toString()).toString(
        'utf8'
      );
      let record: string;
      try {
        record = JSON.parse(strValue);
      } catch (err) {
        console.log(err);
        record = strValue;
      }
      allResults.push(record);
      result = await iterator.next();
    }
    return JSON.stringify(allResults);
  }
}
