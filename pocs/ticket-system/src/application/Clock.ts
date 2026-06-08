export interface Clock {
  now(): Date;
}

export class SystemClock implements Clock {
  now(): Date {
    return new Date();
  }
}

export class FixedClock implements Clock {
  private readonly fixedDate: Date;

  constructor(fixedDate: Date) {
    this.fixedDate = new Date(fixedDate);
  }

  now(): Date {
    return new Date(this.fixedDate);
  }
}
