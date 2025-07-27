import {
  Instrument,
  Paging,
  Provider,
} from '../../../../shared/types/instruments.types';

export interface GetListInstrumentsResponse {
  paging: Paging;
  data: Instrument[];
}

export interface GetListProvidersResponse {
  data: Provider[];
}

export interface GetListExchangesResponse {
  data: {
    [key in Provider]: string[];
  };
}
