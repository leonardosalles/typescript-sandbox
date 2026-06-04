export enum SeatStatus {
  Available = "available",
  Sold = "sold",
}

export enum SaleChannel {
  BoxOffice = "box-office",
  Online = "online",
  Partner = "partner",
}

export type CapacitySnapshot = {
  readonly zone: string;
  readonly capacity: number;
  readonly sold: number;
  readonly available: number;
};

export type SeatSnapshot = {
  readonly zone: string;
  readonly seatNumber: string;
  readonly label: string;
  readonly status: SeatStatus;
};
