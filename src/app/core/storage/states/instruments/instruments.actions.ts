export class LoadInstruments {
  static readonly type = '[Instruments] Load Instruments';
  constructor(
    public page?: number,
    public size?: number,
    public provider?: string,
    public kind?: string,
    public symbol?: string,
  ) {}
}

export class LoadProviders {
  static readonly type = '[Instruments] Load Providers';
}

export class LoadExchanges {
  static readonly type = '[Instruments] Load Exchanges';
  constructor(public provider?: string) {}
}

export class ClearInstruments {
  static readonly type = '[Instruments] Clear Instruments';
}
