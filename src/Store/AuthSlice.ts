/*************************************************
 * RNSETUP
 * @exports
 * AuthSlice.ts
 * Created by Subashree on 19/09/2023
 * Copyright © 2023 AggMaps. All rights reserved.
 *************************************************/
import {createSlice} from '@reduxjs/toolkit';
import {AccessTokenResponse, RefreshTokenResponse} from '../Models/AuthModel';
import {authApi, profileApi} from '../Services/Module';

const initialState: AuthState = {
  accessTokenResponse: null,
  refreshTokenResponse: null,
  loggedInDate:"",
  authCode:"",
};
type AuthState = {
  accessTokenResponse: AccessTokenResponse | null;
  refreshTokenResponse: RefreshTokenResponse | null;
  loggedInDate: "";
  authCode:"";
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setTokenExpire: (state, action) => {
      state.accessTokenResponse = action.payload;
    },
    setLoggedInDate: (state, action) => {
      state.loggedInDate = action.payload;
    },
    setAuthCode: (state, action) => {
      state.authCode = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addMatcher(
      authApi.endpoints.accessToken.matchFulfilled,
      (state, {payload}) => {
        state.accessTokenResponse = payload;
      },
    );
    builder.addMatcher(
      authApi.endpoints.refreshToken.matchFulfilled,
      (state, {payload}) => {
        state.refreshTokenResponse = payload;
      },
    );
  },
});
export const {setTokenExpire, setLoggedInDate, setAuthCode} = authSlice.actions;

export default authSlice.reducer;
