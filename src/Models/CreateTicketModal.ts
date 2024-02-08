/*************************************************
 * AggMaps
 * @exports
 * CreateTicketModal.ts
 * Created by Subashree on 11/1number/2number23
 * Copyright © 2number23 AggMaps. All rights reserved.
 *************************************************/

//Request types
export type LocationsRequest = [
  {
    Id: number;
    
  }
];

// Response types
export type LocationsResponse = [
  {
    Id: number;
    SiteName: string;
    CompanyId: number;
    Latitude: string;
    Longitude: string;
    State: string;
    City: string;
    Email: string;
    Phone: string;
    DayTicketCount: number;
    MaxTrailers: number;
    PrintTickets: any;
  }
];

// Response types
export type CustomersResponse = [
  {
    Id: number;
    Name: string;
    CompanyId: number;
    Phone: string;
    PhoneIso: string;
    Email: string;
    Dba: string;
    TotalOutstanding: number;
    CreditLimit: number;
    CreditTerm: string;
    CreditTermCode: string;
  }
];

export type ProductsResponse = [
  {
    Id: number;
    Name: string;
    ProductCode: string;
    Size: string;
    Description: string;
    Taxable: Boolean;
    Certified: Boolean;
    DotApproved: Boolean;
    CategoryId: number;
    LocationId: number;
    UnitId: number;
  }
];

export type QuantityTypeResponse = [
  {
    Id: number;
    Name: string;
  }
];

export type TruckTypeResponse = [
  {
    Id: number;
    Name: string;
    ShortName: string;
  }
];

export type ProjectResponse = [
  {
    Id: number;
    Name: string;
    CustomerId: number;
    CompanyId: number;
    StartDate: string;
    EndDate: string;
    AddressLine1: string;
    AddressLine2: string;
    City: string;
    State: string;
    Zip: string;
  }
];

export type CreateTicketRequest = {
  Id: number;
  InvoiceId: number;
  UserId: number;
  CompanyId: number;
  LocationId: number;
  CustomerId: number;
  ProjectId: number;
  ProductId: number;
  TruckTypeId: number;
  Date: string;
  UnitId: number;
  TruckNum: string;
  TicketNum: string;
  PONum: string;
  Quantity: number;
  TrailerQuantity: number;
  Rate: number;
  Latitude: number;
  Longitude: number;
  Updated: String;
  Created: string;
  Deleted: Boolean;
  Api: Boolean;
  Images: [
    {
      Id: number;
    }
  ];
};