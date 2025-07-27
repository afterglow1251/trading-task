import { ConnectOptions } from '../types/auth.types';

export const GetTokenBodyParams: { [K in keyof Required<ConnectOptions>]: K } =
  {
    grant_type: 'grant_type',
    client_id: 'client_id',
    username: 'username',
    password: 'password',
  } as const;
