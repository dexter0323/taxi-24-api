export enum DriverStatus {
  AVAILABLE = 'available',
  UNAVAILABLE = 'unavailable',
  IN_TRANSIT = 'in_transit',
}

export class DriverM {
  id: number;
  status: DriverStatus;
  latitude: number;
  longitude: number;
  distance?: string;
  createdDate: Date;
  updatedDate: Date;
}
