/*************************************************
 * RNSETUP
 * @exports
 * CreateTicketSlice.ts
 * Created by Subashree on 11/10/2023
 * Copyright © 2023 RNSETUP. All rights reserved.
 *************************************************/
import { createSlice } from "@reduxjs/toolkit";
import {
  LocationsResponse,
  CustomersResponse,
  ProductsResponse,
  QuantityTypeResponse,
  TruckTypeResponse,
  ProjectResponse,
  CreateTicketRequest,
} from "../Models/CreateTicketModal";
import { createTicketApi } from "../Services/Module";
import { stat } from "react-native-fs";
import { act } from "react-test-renderer";

type CreateTicketState = {
  MasterLocationsResponse: LocationsResponse;
  MasterCustomersResponse: CustomersResponse;
  MasterProductsResponse: ProductsResponse;
  SearchProductsResponse: ProductsResponse;
  QuantityTypeResponse: QuantityTypeResponse;
  TruckTypeResponse: TruckTypeResponse;
  MasterProjectResponse: ProjectResponse;
  SearchProjectResponse: ProjectResponse;
  CreateTicketResponse: CreateTicketRequest;
  MasterTicketListResponse: [];
  TicketDetail: {};
  ViewTicketResponse: {};
  TicketImage: [];

  TicketListResponse: [];
  LocationsResponse: LocationsResponse;
  CustomersResponse: CustomersResponse;
  ProductsResponse: ProductsResponse;
  ProjectResponse: ProjectResponse;
  TicketListDisplayResponse: [];
  ProductsListDropdown: [];
};

const initialState: CreateTicketState = {
  MasterLocationsResponse: [
    {
      Id: 0,
      SiteName: "",
      CompanyId: 0,
      Latitude: "",
      Longitude: "",
      State: "",
      City: "",
      Email: "",
      Phone: "",
      DayTicketCount: 0,
      MaxTrailers: 0,
      PrintTickets: {},
    },
  ],
  LocationsResponse: [
    {
      Id: 0,
      SiteName: "",
      CompanyId: 0,
      Latitude: "",
      Longitude: "",
      State: "",
      City: "",
      Email: "",
      Phone: "",
      DayTicketCount: 0,
      MaxTrailers: 0,
      PrintTickets: {},
    },
  ],

  MasterCustomersResponse: [
    {
      Id: 0,
      Name: "",
      CompanyId: 0,
      Phone: "",
      PhoneIso: "",
      Email: "",
      Dba: "",
      TotalOutstanding: 0,
      CreditLimit: 0,
      CreditTerm: "",
      CreditTermCode: "",
    },
  ],
  CustomersResponse: [
    {
      Id: 0,
      Name: "",
      CompanyId: 0,
      Phone: "",
      PhoneIso: "",
      Email: "",
      Dba: "",
      TotalOutstanding: 0,
      CreditLimit: 0,
      CreditTerm: "",
      CreditTermCode: "",
    },
  ],

  MasterProductsResponse: [
    {
      Id: 0,
      Name: "",
      ProductCode: "",
      Size: "",
      Description: "",
      Taxable: false,
      Certified: false,
      DotApproved: false,
      CategoryId: 0,
      LocationId: 0,
      UnitId: 0,
    },
  ],

  ProductsResponse: [
    {
      Id: 0,
      Name: "",
      ProductCode: "",
      Size: "",
      Description: "",
      Taxable: false,
      Certified: false,
      DotApproved: false,
      CategoryId: 0,
      LocationId: 0,
      UnitId: 0,
    },
  ],

  SearchProductsResponse: [
    {
      Id: 0,
      Name: "",
      ProductCode: "",
      Size: "",
      Description: "",
      Taxable: false,
      Certified: false,
      DotApproved: false,
      CategoryId: 0,
      LocationId: 0,
      UnitId: 0,
    },
  ],
  QuantityTypeResponse: [
    {
      Id: 0,
      Name: "",
    },
  ],
  TruckTypeResponse: [
    {
      Id: 0,
      Name: "",
      ShortName: "",
    },
  ],
  MasterProjectResponse: [
    {
      Id: 0,
      Name: "",
      CustomerId: 0,
      CompanyId: 0,
      StartDate: "",
      EndDate: "",
      AddressLine1: "",
      AddressLine2: "",
      City: "",
      State: "",
      Zip: "",
    },
  ],
  ProjectResponse: [
    {
      Id: 0,
      Name: "",
      CustomerId: 0,
      CompanyId: 0,
      StartDate: "",
      EndDate: "",
      AddressLine1: "",
      AddressLine2: "",
      City: "",
      State: "",
      Zip: "",
    },
  ],
  SearchProjectResponse: [
    {
      Id: 0,
      Name: "",
      CustomerId: 0,
      CompanyId: 0,
      StartDate: "",
      EndDate: "",
      AddressLine1: "",
      AddressLine2: "",
      City: "",
      State: "",
      Zip: "",
    },
  ],
  CreateTicketResponse: {
    Id: 0,
    InvoiceId: 0,
    UserId: 0,
    CompanyId: 0,
    LocationId: 0,
    CustomerId: 0,
    ProjectId: 0,
    ProductId: 0,
    TruckTypeId: 0,
    Date: "",
    UnitId: 0,
    TruckNum: "",
    TicketNum: "",
    PONum: "",
    Quantity: 0,
    TrailerQuantity: 0,
    Rate: 0,
    Latitude: 0,
    Longitude: 0,
    Updated: "",
    Created: "",
    Deleted: false,
    Api: false,
    Images: [
      {
        Id: 0,
      },
    ],
  },
  MasterTicketListResponse: [],
  TicketListResponse: [],
  TicketDetail: {},
  TicketImage: [],
  TicketListDisplayResponse: [],
  ProductsListDropdown: [],
};

export const dashboardSlice = createSlice({
  name: "createTicket",
  initialState,
  reducers: {
    setProductsFromLocations: (state, action: any) => {
      state.SearchProductsResponse = action.payload;
    },
    setProjectsFromCustomers: (state, action: any) => {
      state.SearchProjectResponse = action.payload;
    },
    setTicketsListArrayForOffline: (state, action: any) => {
      state.TicketListResponse = [...state.TicketListResponse, action.payload];
    },
    updateDashboardCustomersInOffline: (state, action: any) => {
      const newArray = [...state.CustomersResponse];
      newArray[action.payload.index] = action.payload.updatedObject;
      state.CustomersResponse = newArray;
    },
    updateMasterCustomersInOffline: (state, action: any) => {
      const newArray = [...state.MasterCustomersResponse];
      newArray[action.payload.index] = action.payload.updatedObject;
      state.MasterCustomersResponse = newArray;
    },
    updateTicketImage: (state, action: any) => {
      state.TicketImage = action.payload;
    },
    updateTicketDetail: (state, action: any) => {
      state.TicketDetail = action.payload;
    },
    updateTicketInOffline: (state, action: any) => {
      state.TicketListResponse = state.TicketListResponse.map((item: any) =>
        item?.Id === action.payload.updatedObject?.Id
          ? action.payload.updatedObject
          : item
      );
    },
    setCompanyLocations: (state, action: any) => {
      state.LocationsResponse = action.payload;
    },
    setCompanyCustomers: (state, action: any) => {
      state.CustomersResponse = action.payload;
    },
    setCompanyProducts: (state, action: any) => {
      state.ProductsResponse = action.payload;
    },
    setCompanyProjects: (state, action: any) => {
      state.ProjectResponse = action.payload;
    },
    setCompanyTickets: (state, action: any) => {
      state.TicketListResponse = action.payload;
    },
    setCustomers: (state, action: any) => {
      state.MasterCustomersResponse = action.payload;
    },
    setLocations: (state, action: any) => {
      state.MasterLocationsResponse = action.payload;
    },
    setProducts: (state, action: any) => {
      state.MasterProductsResponse = action.payload;
    },
    setProjects: (state, action: any) => {
      state.MasterProjectResponse = action.payload;
    },
    setTickets: (state, action: any) => {
      state.MasterTicketListResponse = action.payload;
    },
    removeTicket: (state, action: any) => {
      state.MasterTicketListResponse = state.MasterTicketListResponse.filter(
        (item) => item.Id !== action.payload
      );
    },
    removeCompanyTicket: (state, action: any) => {
      state.TicketListResponse = state.TicketListResponse.filter(
        (item) => item.Id !== action.payload
      );
    },
    setCompanyTicketsListForDisplay: (state, action: any) => {
      state.TicketListDisplayResponse = action.payload;
    },
    removeCompanyTickeListDisplay: (state, action: any) => {
      state.TicketListDisplayResponse = state.TicketListDisplayResponse.filter(
        (item) => item.Id !== action.payload
      );
    },
    updateTicketDisplayInOffline: (state, action: any) => {
      const newArray = [...state.TicketListDisplayResponse];
      newArray[action.payload.index] = action.payload.updatedObject;
      state.TicketListDisplayResponse = newArray;
    },
    setProductsListDropDown: (state, action: any) => {
      state.ProductsListDropdown = action.payload;
    },
    updateViewTicketResponse: (state, action: any) => {
      state.ViewTicketResponse = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder.addMatcher(
      createTicketApi.endpoints.getQuantityTypes.matchFulfilled,
      (state, { payload }) => {
        state.QuantityTypeResponse = payload;
      }
    );
    builder.addMatcher(
      createTicketApi.endpoints.getTruckTypes.matchFulfilled,
      (state, { payload }) => {
        state.TruckTypeResponse = payload;
      }
    );
    builder.addMatcher(
      createTicketApi.endpoints.createTicket.matchFulfilled,
      (state, { payload }) => {
        state.CreateTicketResponse = payload;
      }
    );
  },
});

export const {
  setProductsFromLocations,
  setProjectsFromCustomers,
  setTicketsListArrayForOffline,
  updateDashboardCustomersInOffline,
  updateMasterCustomersInOffline,
  updateTicketImage,
  updateTicketDetail,
  updateViewTicketResponse,
  updateTicketInOffline,
  setCompanyCustomers,
  setCompanyLocations,
  setCompanyProducts,
  setCompanyProjects,
  setCompanyTickets,
  setLocations,
  setCustomers,
  setProducts,
  setProjects,
  setTickets,
  removeTicket,
  removeCompanyTicket,
  setCompanyTicketsListForDisplay,
  updateTicketDisplayInOffline,
  removeCompanyTickeListDisplay,
  setProductsListDropDown,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
