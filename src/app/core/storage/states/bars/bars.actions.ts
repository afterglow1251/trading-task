import { TimeUnit } from '../../../../shared/types/bars.types';

export class LoadBarsCountBack {
  static readonly type = '[Bars] Load Bars Count Back';
  constructor(
    public payload: {
      instrumentId: string;
      provider: string;
      interval: number;
      periodicity: TimeUnit;
      barsCount: number;
    },
  ) {}
}

export class LoadBarsByDateRange {
  static readonly type = '[Bars] Load Bars By Date Range';
  constructor(
    public payload: {
      instrumentId: string;
      provider: string;
      interval: number;
      periodicity: TimeUnit;
      startDate: string;
      endDate?: string;
    },
  ) {}
}

export class LoadBarsTimeBack {
  static readonly type = '[Bars] Load Bars Time Back';
  constructor(
    public payload: {
      instrumentId: string;
      provider: string;
      interval: number;
      periodicity: TimeUnit;
      timeBack: string;
    },
  ) {}
}

export class ClearBars {
  static readonly type = '[Bars] Clear Bars';
}
