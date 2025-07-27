export type Provider = 'alpaca' | 'dxfeed' | 'oanda' | 'simulation';

export interface Instrument {
  id: string;
  symbol: string;
  kind: string;
  exchange: string;
  description: string;
  tickSize: number;
  currency: string;
  baseCurrency?: string;
  mappings: Mappings;
  profile: Profile;
}

export type Mappings = Partial<{
  simulation: SimulationMapping;
  alpaca: BaseMapping;
  dxfeed: BaseMapping;
  oanda: BaseMapping;
}>;

export interface Profile {
  name: string;
  location?: string;
  gics: Gics;
}

export interface TradingHours {
  regularStart: string;
  regularEnd: string;
  electronicStart: string;
  electronicEnd: string;
}

export interface BaseMapping {
  symbol: string;
  exchange: string;
  defaultOrderSize: number;
  tradingHours: TradingHours;
}

export interface SimulationMapping extends BaseMapping {
  maxOrderSize: number;
}

export interface Paging {
  page: number;
  pages: number;
  items: number;
}

export type Gics =
  | {}
  | {
      sectorId: number;
      industryGroupId: number;
      industryId: number;
      subIndustryId: number;
    };
