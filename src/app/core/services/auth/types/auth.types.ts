export interface GetTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  refresh_expires_in: number;
  token_type: string;
  'not-before-policy': number;
  session_state: string;
  scope: string;
}

export interface ConnectOptions {
  grant_type?: string;
  client_id?: string;
  username?: string;
  password?: string;
}
