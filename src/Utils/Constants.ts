/*************************************************
 * AggMaps
 * @exports
 * Constants.ts
 * Created by Abdul on 06/07/2023
 * Copyright © 2023 AggMaps. All rights reserved.
 *************************************************/
import {getScaleAxis} from './Utility';
import {StyleSheet} from 'react-native';

export const NAVIGATION_KEY = {
  AUTH: 'AUTH',
  LOGIN: 'LOGIN',
  PROFILE_SCREEN: 'PROFILE_SCREEN',
  FORGET_PASSWORD: 'FORGET_PASSWORD',
  EMAIL_VERIFICATION: 'EMAIL_VERIFICATION',
  HOME_SCREEN: 'HOME_SCREEN',
};

export const COUNTRY_LIST = [
  {
    value: '1',
    label: 'USA',
  },
];

export const API_DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';
export const DISPLAY_DATE_FORMAT_1 = 'MMM DD, YYYY';
export const DISPLAY_DATE_FORMAT_2 = 'dddd, MMM DD, YYYY';
export const DISPLAY_DATE_FORMAT_3 = 'MM-DD-YYYY';

export const INVITE_TYPE = ['SMS', 'EMAIL'];
export const RESEND_CODE_TIMING = '120';

// Colors
export const COLOR = {
  PRIMARY_1: '#000000',
  PRIMARY_2: '#2CA0B9',
  SECONDARY_1: '#C4DDE2',
  SECONDARY_2: '#CDDDE1',
  SECONDARY_3: '#D4E2E5',
  DARK_GREY: '#687074',
  DARK_GREY_OPACITY: '#68707450',
  GREY_SHADE: '#D8D9D6',
  LIGHT_GREY: '#C3C3C3',
  VIEW_BG: '#F3F5F8',
  BLUE:'#468FF6',
  TRANSPARENT: '#00000001',
  BLACK: '#000000',
  LIGHT_BLACK: '#171821',
  BLACK_OPACITY: '#231F20',
  WHITE: '#FFFFFF',
  GREEN: '#459B6F',
  GREEN_ICON: '#1AA050',
  LIGHT_GREEN: '#BEE0D9',
  RED: '#C21717',
  RED_ICON: '#E40013',
  RED_STATUS: '#C41F1F',
  LIGHT_RED: '#F0CED2',
  ORANGE: '#EE7200',
  WARNING: '#E28700',
  WARNING_1: '#E69200',
  TEXT_1: '#118EAA',
  TEXT_2: '#116B7E',
  TEXT_3: '#5296A5',
  TEXT_4: '#024250',
  HEADER_BG_1: '#1A95B0CC',
  CARD_BG_1: '#5296A540',
  CARD_BG_2: '#5296A533',
  CARD_BG_3: '#CDDEE3',
  CARD_BG_4: '#5296A530',
  ADD_STORE_BG: '#CADDE3',
  WELCOME_GRADIENT: [
    '#FFFFFF10',
    '#C4DDE240',
    '#C4DDE230',
    '#C4DDE210',
    '#C4DDE2',
  ],
  BLACK_GRADIEMT: [
    '#00000001',
    '#00000092',
    '#00000095',
    '#00000097',
    '#00000099',
    '#000000',
  ],
  SUB_BG: '#7BABC630',
  SUB_BG_1: '#7BABC6',
  GREEN_COLOR: '#50C878',
  RED_COLOR: '#f50247',
  TOOL_BAR: '#ff0000',
  ALERT_COLOR: '#009ccc',
  TAB_BAR_BACKGROUND: '#E7F7FC',
};

// Font Size
export const FONT_SIZE = {
  GIANT: 84,
  MONSTER: 32,
  MEGA: 30,
  BIG: 28,
  XXXL: 26,
  XXL: 24,
  XL: 22,
  L: 20,
  M: 18,
  REGULAR: 16,
  S: 14,
  XS: 12,
  TINY: 10,
};

// Font family
export const FONT_FAMILY = {
  REGULAR: '',
  MEDIUM: '',
  BOLD: '',
  SEMI_BOLD: '',
};
export const fontStyles = StyleSheet.create({
  H1: {
    fontSize: getScaleAxis(20),
    color: COLOR.BLACK,
    lineHeight: getScaleAxis(24),
    fontWeight: '600',
    fontStyle: 'normal',
  },
  H2: {
    fontSize: getScaleAxis(18),
    color: COLOR.BLACK,
  },
  H3: {
    fontSize: getScaleAxis(15),
    color: COLOR.BLACK,
    lineHeight: getScaleAxis(18),
    fontWeight: '600',
    fontStyle: 'normal',
  },
  H4: {
    fontSize: getScaleAxis(13),
    color: COLOR.BLACK,
    lineHeight: getScaleAxis(16),
    fontWeight: '400',
    fontStyle: 'normal',
  },
  H5: {
    fontSize: getScaleAxis(12),
    color: COLOR.BLACK,
    lineHeight: getScaleAxis(15),
    fontWeight: '400',
    fontStyle: 'normal',
  },
});

// Regular Expressions
export const REGEX = {
  NAME: new RegExp(/^[a-z A-Z ']*$/),
  PASSWORD: new RegExp(
    /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{5,100}$/,
  ),
  EMAIL: new RegExp(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  ),
  PHONE_NUBER: new RegExp(/^[0-9 +()-]*$/),
  ONLY_NUBER: new RegExp(/^[0-9]*$/),
};
