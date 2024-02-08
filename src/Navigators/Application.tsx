/*************************************************
 * AggMaps
 * @exports
 * @Ccomponent Application.tsx
 * Created by Subashree on 19/09/2023
 * Copyright © 2023 AggMaps. All rights reserved.
 *************************************************/

import React, { useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { SplashScreen } from "../Screens";
import AuthNavigator from "./AuthNavigator";
import { navigationRef } from "./utils";
import { useSelector } from "react-redux";
import { RootState } from "../Store";
import DashboardNavigator from "./DashboardNavigator";
import BottomTabNavigator from "./BottomTabNavigator";
// import FlashMessage from 'react-native-flash-message';

export type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  Main: undefined;
  Home: undefined;
  Dashboard: undefined;
};
const RootStack = createStackNavigator<RootStackParamList>();

// @refresh reset
const ApplicationNavigator = () => {

  return (
    <NavigationContainer theme={DefaultTheme} ref={navigationRef}>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="Splash" component={SplashScreen} />
        <RootStack.Screen
          name="Auth"
          component={AuthNavigator}
          options={{
            animationEnabled: false,
          }}
        />
        <RootStack.Screen
          name="Main"
          component={BottomTabNavigator}
          options={{
            animationEnabled: false,
          }}
        />
      </RootStack.Navigator>
      {/* <FlashMessage position="top" hideStatusBar={true} duration={5000} /> */}
    </NavigationContainer>
  );
};

export default ApplicationNavigator;
