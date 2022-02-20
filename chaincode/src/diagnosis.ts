import { Object, Property } from 'fabric-contract-api';

// TODO: do we need patient and doctor names here?
@Object()
export class Diagnosis {
  @Property()
  public Type: string;

  @Property()
  public ID: string;

  @Property()
  public DoctorID: string;

  @Property()
  public PatientID: string;

  @Property()
  public AppointmentID: string;

  @Property()
  public Diagnosis: string;

  // TODO: how to handle multiple strings?
  @Property()
  public TestRecommendations: string;

  @Property()
  public Prescription: string;
}
