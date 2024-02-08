/*************************************************
 * Aggmaps
 * @exports
 * AuthModels.ts
 * Created by Subashree on 19/09/2023
 * Copyright © 2023 Aggmaps. All rights reserved.
 *************************************************/

// Request types
export type AccessTokenRequest = {
  grant_type: string;
  client_id: string;
  client_secret: string;
  redirect_uri: string;
  code: string;
};
export type SignupRequest = {
  FirstName: string;
  LastName: string;
  Email: string;
  Password: string;
  PhoneNumber: string;
  deviceId: string;
  deviceType: string;
  deviceOs: string;
};

export type RefreshTokenRequest = {
  grant_type: string;
  client_id: string;
  client_secret: string;
  refresh_token: string;
};

export type AccessTokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
};
export type RefreshTokenResponse = {
  access: {
    token: string;
    expires: string;
  };
  refresh: {
    token: string;
    expires: string;
  };
};

// Customize Error Format Types
export type CustomError = {
  status: number;
  data: {
    code: number;
    status: string;
    message: string;
  };
};
