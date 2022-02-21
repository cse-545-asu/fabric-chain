import { Object, Property } from 'fabric-contract-api';

@Object()
export class Transaction {
  @Property()
  public Type: string;

  @Property()
  public ID: string;

  @Property()
  public Method: string;

  @Property()
  public PaymentType: string;

  @Property()
  public Mode: string;

  @Property()
  public Amount: number;

  @Property()
  public Status: string;

  @Property()
  public PatientID: string;

  @Property()
  public TestID?: string;

  @Property()
  public AppointmentID?: string;

  @Property()
  public CreatedOn: Date;
}
