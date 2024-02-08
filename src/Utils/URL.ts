/*************************************************
 * AggMaps
 * @exports
 * URL.ts
 * Created by Subashree S on 19/09/2023
 * Copyright © 2023 AggMaps. All rights reserved.
 *************************************************/

/**
 * Base URL
 */

export const Config = {
  grant_type: 'authorization_code',
  client_id: 'pJdcs8QLJlqcYk1goqXf0Oe33VXDmZ2g',
  client_secret:
    'aR5kjkc2ljofXSEQCej1NWo4X4Yb8xdurVZY22eyLnLYbnvqyKx3Dt57UvaGFHMb',
  redirect_uri: 'aggmaps://oauth-callback',
};

export const OAUTH_URL =
  'https://alliance:trucking@staging.aggmaps.com/oauth/v2';

export const BASE_URL = 'https://staging.aggmaps.com/api/v2';

export const GET_ACCESS_TOKEN = '/access_token';
export const REFRESH_TOKEN = '/refresh_token';
export const USER = 'me';
export const DASHBOARD = 'dashboard';
export const COMPANIES = 'companies';
export const LOCATIONS = 'locations';
export const CUSTOMERS = 'customers';
export const PRODUCTS = 'products';
export const QUANTITY_TYPES = 'units'
export const TRUCK_TYPE = 'trucktypes';
export const PROJECTS = 'projects';
export const TICKETS = 'tickets';
export const IMAGES = 'images';
export const CONTACT_SUPPORT = 'support'