/*************************************************
 * RNSETUP
 * @exports
 * api.ts
 * Created by Ramesh Baskar on 01/07/2022
 * Copyright © 2022 RNSETUP. All rights reserved.
 *************************************************/
import { BASE_URL, OAUTH_URL, GET_ACCESS_TOKEN, Config } from "../Utils/URL";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { RootState, store } from "../Store";
import { CustomError } from "../Models/AuthModel";
import { setTokenExpire } from "../Store/AuthSlice";
import Utility from "../Utils/Utility";
import { Alert } from "react-native";
import { navigateAndSimpleReset } from "../Navigators/utils";

const NetworkError = {
  error: {
    status: 408,
    statusText: "Bad Request",
    data: {
      code: 408,
      status: "Network Error",
      message: "Please check your internet connectivity",
    },
  },
};

const baseOAuthQuery = fetchBaseQuery({
  prepareHeaders: (headers, { getState }) => {
    headers.set("Content-Type", "application/json");
    headers.set("cache-control", "no-cache");

    const token = (getState() as RootState).auth.accessTokenResponse
      ?.access_token;
    console.log("baseOAuthQuery", token);
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
  baseUrl: OAUTH_URL,
});

const baseQuery = fetchBaseQuery({
  prepareHeaders: (headers, { getState }) => {
    headers.set("Content-Type", "application/json");
    headers.set("cache-control", "no-cache");

    const token = (getState() as RootState).auth.accessTokenResponse
      ?.access_token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
  baseUrl: BASE_URL,
});

const baseQueryWithInterceptor: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError | CustomError
> = async (args, api, extraOptions) => {
  // const isNetworkavailable = store.getState().device.isNetworkAvailable;
  // if (!isNetworkavailable) {
  //   return NetworkError;
  // }

  let result;
  if (api.endpoint === "accessToken" || api.endpoint === "refreshToken") {
    result = await baseOAuthQuery(args, api, extraOptions);
  } else {
    result = await baseQuery(args, api, extraOptions);
  }
  
  if (result.error) {
    if (result.error.status === 401) {
      // try to get a new token
      const authCode =
        store.getState().auth.authCode;

      let data = {
      ...Config,
      code: authCode,
      };

      const refreshResult: any = await baseOAuthQuery(
        {
          url: GET_ACCESS_TOKEN,
          method: "POST",
          body: data,
        },
        api,
        extraOptions
      );

      console.log("refreshResult ====", refreshResult);

      if (refreshResult.data) {
        // store the new token
        store.dispatch(setTokenExpire(refreshResult.data));
        // retry the initial query
        result = await baseQuery(args, api, extraOptions);
      } else {
        store.dispatch({ type: "RESET_ALL" });
        navigateAndSimpleReset("Splash");
      }
    } else if (result.error.status === 400) {
      let arrError:[] = result.error?.data.Errors;
      if (arrError) {
        if (arrError.length) {
          Alert.alert("", arrError.toString());
        }else {
          Alert.alert("", result.error?.data.Message);
        }
      }else {
        Alert.alert("", result.error?.data.Message);
      }
    } else if (result.error.status === 403) {
      return NetworkError;
    } else if (result.error?.status === "FETCH_ERROR") {
      return NetworkError;
    }
  }

  return result;
};

export const api = createApi({
  baseQuery: baseQueryWithInterceptor,
  endpoints: () => ({}),
});
