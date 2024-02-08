/*************************************************
 * RNSETUP
 * @exports
 * DashboradSlice.ts
 * Created by Subashree on 04/10/2023
 * Copyright © 2023 RNSETUP. All rights reserved.
 *************************************************/
import { createSlice } from "@reduxjs/toolkit";
import {
  UserDetailResponse,
  DashboardResponse,
  CompanyResponse,
} from "../Models/DashboardModel";
import { dashBoardApi } from "../Services/Module";
import { act } from "react-test-renderer";

type DashBoardState = {
  UserResponse: UserDetailResponse;
  DashboardResponse: DashboardResponse;
  DashboardCustomerResponse: CompanyResponse;
  selectedCompany: {};
  offlineTicketCount: 0;
  lastSyncedDate:'',
};

const initialState: DashBoardState = {
  UserResponse: {
    Id: 0,
    FirstName: "",
    Surname: "",
    Email: "",
    Phone: "",
    ProfileImage: "",
  },
  DashboardResponse: [
    {
      Id: 0,
      Name: "",
      Phone: "",
      PhoneIso: "",
      Email: "",
      TicketCount: 0,
      MaxTicketNum: 0,
      DayTicketCount: 0,
      Permissions: [],
      Raised: false,
    },
  ],
  DashboardCustomerResponse: [
    {
      Id: 0,
      Name: "",
      Phone: "",
      PhoneIso: "",
      Email: "",
      TicketCount: 0,
      MaxTicketNum: 0,
      Permissions: [],
      Raised: false,
    },
  ],
  selectedCompany: {},
  offlineTicketCount: 0,
  lastSyncedDate:'',
};

export const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    updateDashboard: (state, action: any) => {
      state.DashboardCustomerResponse = action.payload;
    },
    updateDashboardInOffline: (state, action: any) => {
      state.DashboardResponse = action.payload;
    },
    setSelectedCompanyFromdashboard: (state, action: any) => {
      state.selectedCompany = action.payload;
    },
    setDashboardOfflineTicketCount: (state, action: any) => {
      state.offlineTicketCount = action.payload;
    },
    setLastSyncedDate: (state, action: any) => {
      state.lastSyncedDate = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      dashBoardApi.endpoints.getUserDetails.matchFulfilled,
      (state, { payload }) => {
        state.UserResponse = payload;
      }
    );
    builder.addMatcher(
      dashBoardApi.endpoints.getDashboard.matchFulfilled,
      (state, { payload }) => {
        state.DashboardResponse = payload;
      }
    );
  },
});
export const {
  updateDashboard,
  updateDashboardInOffline,
  setSelectedCompanyFromdashboard,
  setDashboardOfflineTicketCount,
  setLastSyncedDate,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
