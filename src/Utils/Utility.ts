/*************************************************
 * AggMaps
 * @exports
 * Utility.ts
 * Created by Abdul on 20/07/2023
 * Copyright © 2023 AggMaps. All rights reserved.
 *************************************************/

//imports
import {
  CommonActions,
  createNavigationContainerRef,
} from '@react-navigation/native';
import {Alert, Dimensions} from 'react-native';
// import Snackbar from 'react-native-snackbar';
import {showMessage} from 'react-native-flash-message';
import {create} from 'react-native-pixel-perfect';

// Components
import {REGEX} from './Constants';

export default class Utility {
  // used to show snackbar with text message
  // static showSnackBar(text: string, isLong: boolean = false) {
  //   let data: any = {text};
  //   if (isLong) {
  //     data.duration = Snackbar.LENGTH_LONG;
  //   }
  //   Snackbar.show(data);
  // }

  // used to show alert with yes and cancel actions
  static showAlertWithYesCancelAction(
    title: string,
    message: string,
    callback: Function,
  ) {
    Alert.alert(
      title,
      message,
      [
        {text: 'Yes', onPress: () => callback()},
        {text: 'Cancel', onPress: () => {}},
      ],
      {cancelable: false},
    );
  }

   // used to show alert with yes and cancel actions
   static showAlert(
    title: string,
    message: string,
  ) {
    Alert.alert(
      title,
      message,
    );
  }

  // function to validate whether the email is valid or not
  static validateEmail = (email: string) => {
    return String(email).toLowerCase().match(REGEX.EMAIL);
  };

  // function to validate whether the password is valid or not
  static validatePassword = (password: string) => {
    return String(password).toLowerCase().match(REGEX.PASSWORD);
  };
}

export const navigationRef = createNavigationContainerRef();

export const navigate = (name: string, params: any) => {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
};

export const navigateBack = () => {
  if (navigationRef.isReady()) {
    navigationRef.goBack();
  }
};

export const navigateAndReset = (routes = [], index = 0) => {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(
      CommonActions.reset({
        index,
        routes,
      }),
    );
  }
};

export const navigateAndSimpleReset = (name: any, index = 0) => {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(
      CommonActions.reset({
        index,
        routes: [{name}],
      }),
    );
  }
};
export const getScaleAxis = (value: number): number => {
  const {width, height} = Dimensions.get('window');
  const designResolution = {
    width,
    height,
  }; //this size is the size that your design is made for (screen size)
  const perfectSize = create(designResolution);
  return perfectSize(value);
};
