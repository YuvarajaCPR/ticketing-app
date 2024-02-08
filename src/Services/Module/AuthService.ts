/*************************************************
 * RNSETUP
 * @exports
 * AuthService.ts
 * Created by Ramesh Baskar on 01/07/2022
 * Copyright © 2022 RNSETUP. All rights reserved.
 *************************************************/
import {api} from '../api';
import {GET_ACCESS_TOKEN, REFRESH_TOKEN} from '../../Utils/URL';
import {
  AccessTokenResponse,
  AccessTokenRequest,
  RefreshTokenResponse,
  RefreshTokenRequest,
} from '../../Models/AuthModel';

export const authApi = api.injectEndpoints({
  endpoints: build => ({
    accessToken: build.mutation<AccessTokenResponse, AccessTokenRequest>({
      query: credentials => ({
        url: GET_ACCESS_TOKEN,
        method: 'POST',
        body: credentials,
      }),
    }),
    refreshToken: build.mutation<RefreshTokenResponse, RefreshTokenRequest>({
      query: credentials => ({
        url: REFRESH_TOKEN,
        method: 'POST',
        body: credentials,
      }),
    }),
  }),

  overrideExisting: true,
});

export const {useAccessTokenMutation, useRefreshTokenMutation} = authApi;
