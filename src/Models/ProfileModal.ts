/*************************************************
 * Aggmaps
 * @exports
 * ProfileModal.ts
 * Created by Subashree on 19/09/2023
 * Copyright © 2023 Aggmaps. All rights reserved.
 *************************************************/

{
  /***************** Request types *************/
}
export type AddAddressRequest = {
  user_id: number | null;
  latitude: string;
  longitude: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
};

export type GetAddressRequest = {
  user_id: number;
};

export type UpdateAddressRequest = {
  user_address_id: number;
  latitude: string;
  longitude: string;
  user_id: number;
  address: string;
  city: string;
  state: string;
  zipcode: string;
};

export type GetUserRequest = {
  user_id: number;
};

export type UpdateUserRequest = {
  user_id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  profile_pic?: string;
};

export type LogoutRequest = {
  refreshToken: string;
  deviceId: string;
  deviceType: string;
};

export type InviteRequest = {
  invited_by: 1;
  users: InviteUsers;
};

export type InviteUsers = {
  invitees_name: string;
  invitees_mobile_number: string;
  invitees_email_address: string;
  other_invitee_details: string;
};

{
  /***************** Response types *************/
}

export type AddAddressResponse = {
  response: {
    status: string;
    message: string;
    address: Address;
  };
};

export type GetAddressResponse = {
  response: {
    status: string;
    address: Address;
  };
};

export type Address = {
  user_address_id: number;
  user_id: number;
  latitude: string;
  longitude: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  createdAt: string;
  updatedAt: string;
};

export type UpdateAddressResponse = {
  response: {
    address: Address;
    status: string;
  };
};

export type GetUserResponse = {
  response: {
    userDetail: UserDetail;
  };
};

export type UserDetail = {
  user_id: number;
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  user_devices: UserDevice;
  profile_pic: string;
};

export type UserDevice = {
  user_device_id: 1;
  device_id: string;
  user_id: 1;
  device_type: string;
  device_os: string;
  last_login: string;
  latest_version: null;
  first_install_date: null;
  latest_version_date: null;
  uninstall_date: null;
  createdAt: string;
  updatedAt: string;
};

export type UpdateUserResponse = {
  response: {
    status: string;
    message: string;
    user: {
      userDetail: UserDetail;
      image_Url: '';
    };
  };
};

export type LogoutResponse = {};

export type InviteResponse = {
  response: {
    status: string;
    message: string;
  };
};
