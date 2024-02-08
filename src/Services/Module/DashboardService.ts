/*************************************************
 * Aggmaps
 * @exports
 * DashboardService.ts
 * Created by Subashree on 02/10/2023
 * Copyright © 2023 Aggmaps. All rights reserved.
 *************************************************/
import {api} from '../api';
import {UserDetailResponse, DashboardResponse} from '../../Models/DashboardModel';
import {USER, COMPANIES} from '../../Utils/URL';

export const dashBoardApi = api.injectEndpoints({
  endpoints: build => ({
    // To get User details
    getUserDetails: build.query<UserDetailResponse, any>({
      query: () => USER,
    }),
    getDashboard: build.query<DashboardResponse, any>({
      query: () => COMPANIES,
    }),
  }),
});

export const {useLazyGetUserDetailsQuery, useLazyGetDashboardQuery} = dashBoardApi;
