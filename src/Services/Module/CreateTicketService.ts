/*************************************************
 * Aggmaps
 * @exports
 * CreateTicketService.ts
 * Created by Subashree on 11/10/2023
 * Copyright © 2023 Aggmaps. All rights reserved.
 *************************************************/
import { api } from "../api";
import {
  LocationsResponse,
  CustomersResponse,
  ProductsResponse,
  QuantityTypeResponse,
  TruckTypeResponse,
  ProjectResponse,
} from "../../Models/CreateTicketModal";
import {
  LOCATIONS,
  COMPANIES,
  CUSTOMERS,
  PRODUCTS,
  QUANTITY_TYPES,
  TRUCK_TYPE,
  PROJECTS,
  TICKETS,
  IMAGES,
} from "../../Utils/URL";

export const createTicketApi = api.injectEndpoints({
  endpoints: (build) => ({
    // To get Locations
    getLocations: build.query<LocationsResponse, any>({
      query: (params) => `${COMPANIES}/${params.id}/${LOCATIONS}`,
    }),
    // To get Customers
    getCustomers: build.query<CustomersResponse, any>({
      query: (params) => `${COMPANIES}/${params.id}/${CUSTOMERS}`,
    }),
    // To get Products
    getProducts: build.query<ProductsResponse, any>({
      query: (params) => `${COMPANIES}/${params.id}/${PRODUCTS}`,
    }),
    // To get Quantity types
    getQuantityTypes: build.query<QuantityTypeResponse, any>({
      query: () => QUANTITY_TYPES,
    }),
    // To get Truck types
    getTruckTypes: build.query<TruckTypeResponse, any>({
      query: () => TRUCK_TYPE,
    }),
    // To get Projects
    getProjects: build.query<ProjectResponse, any>({
      query: (params) => `${COMPANIES}/${params.id}/${PROJECTS}`,
    }),
    //To create ticket
    createTicket: build.mutation({
      query: (params) => ({
        url: `${COMPANIES}/${params.CompanyId}/${TICKETS}`,
        method: "POST",
        body: params,
      }),
    }),
    //To update ticket
    updateTicket: build.mutation({
      query: (params) => ({
        url: `${COMPANIES}/${params.CompanyId}/${TICKETS}/${params.Id}`,
        method: "PATCH",
        body: params,
      }),
    }),
    //To get ticket Detail
    getTicketDetail: build.mutation({
      query: (params) => ({
        url: `${COMPANIES}/${params.CompanyId}/${TICKETS}/${params.Id}`,
        method: "GET",
      }),
    }),
    //To Delete ticket Image
    deleteTicketImage: build.mutation({
      query: (params) => ({
        url: `${COMPANIES}/${params.CompanyId}/${TICKETS}/${params.Id}/${IMAGES}/${params.ImageId}`,
        method: "DELETE",
      }),
    }),
    // To delete ticket
    deleteTicket: build.mutation({
      query: (params) => ({
        url: `${COMPANIES}/${params.companyId}/${TICKETS}/${params.ticketId}/delete`,
        method: "POST",
        body: {'DeleteReason': params.DeleteReason},
      }),
    }),
    // To get Tickets
    getTickets: build.query<any, any>({
      query: (params) => ({
        url: `${COMPANIES}/${params.companyId}/${TICKETS}?limit=1000`,
      }),
    }),
    //To get ticket Image
    getTicketImage: build.mutation({
      query: (params) => ({
        url: `${COMPANIES}/${params.CompanyId}/${TICKETS}/${params.Id}/${IMAGES}/${params.ImageId}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useLazyGetLocationsQuery,
  useLazyGetCustomersQuery,
  useLazyGetProductsQuery,
  useLazyGetProjectsQuery,
  useLazyGetQuantityTypesQuery,
  useLazyGetTruckTypesQuery,
  useCreateTicketMutation,
  useUpdateTicketMutation,
  useLazyGetTicketsQuery,
  useDeleteTicketImageMutation,
  useGetTicketDetailMutation,
  useGetTicketImageMutation,
  useDeleteTicketMutation,
} = createTicketApi;
