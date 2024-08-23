export enum DriverStatus {
  AVAILABLE = 'available',
  UNAVAILABLE = 'unavailable',
  IN_TRANSIT = 'in_transit',
}

export class DriverM {
  id: number;
  status: DriverStatus;
  longitude: number;
  latitude: number;
  createdDate: Date;
  updatedDate: Date;
}
