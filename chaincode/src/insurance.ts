import { Object, Property } from 'fabric-contract-api';

@Object()
export class Insurance {
  @Property()
  public Type: string;

  @Property()
  public ID: string;

  @Property()
  public PaymentID: string;

  @Property()
  public PatientID: string;

  @Property()
  public Status: string;
}
