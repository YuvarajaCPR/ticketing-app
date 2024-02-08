/*************************************************
 * AggMaps
 * @exports
 * DashboardModel.ts
 * Created by Subashree on 21/09/2023
 * Copyright © 2023 AggMaps. All rights reserved.
 *************************************************/

// Request types
export type UserDetailRequest = {};

// Response types
export type UserDetailResponse = {
  Id: number;
  FirstName: string;
  Surname: string;
  Email: string;
  Phone: string;
  ProfileImage: string;
};

// Request types
export type DashboardRequest = {};

// Response types
export type DashboardResponse = 
  [{
    Id: number,
    Name: string,
    Phone: string, 
    PhoneIso: string,
    Email: string,
    TicketCount : number,
    MaxTicketNum: number,
    DayTicketCount: number,
    Permissions : Array<String>,
    Raised: boolean,
  }];
  export type CompanyResponse = 
  [{
    Id: number,
    Name: string,
    Phone: string, 
    PhoneIso: string,
    Email: string,
    TicketCount : number,
    MaxTicketNum: number,
    Permissions : Array<String>,
    Raised: boolean,
  }];
