import {
  withNgxsStoragePlugin,
  SESSION_STORAGE_ENGINE,
} from '@ngxs/storage-plugin';
import { BarsState } from '../states/bars/bars.state';
import { InstrumentsState } from '../states/instruments/instruments.state';
import { STORAGE_KEYS } from './storage-keys.const';

export const ngxsStates = [BarsState, InstrumentsState];

export const ngxsStorageConfig = withNgxsStoragePlugin({
  keys: [
    {
      key: STORAGE_KEYS.BARS,
      engine: SESSION_STORAGE_ENGINE,
    },
    {
      key: STORAGE_KEYS.INSTRUMENTS,
      engine: SESSION_STORAGE_ENGINE,
    },
  ],
});
