/*************************************************
 * GoBox
 * @exports
 * @component AuthNavigator.tsx
 * Created by Deepak B on 01/07/2022
 * Copyright © 2022 GoBox. All rights reserved.
 *************************************************/

import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { AuthorizeLoginScreen } from "../Screens";
import { COLOR } from "../Utils/Constants";
import Container from "../Components/Container";

export type AuthStackParamList = {
  Authorize: undefined;
  Splash: undefined;
};

const AuthStack = createStackNavigator<AuthStackParamList>();
// @refresh reset
const AuthNavigator = () => {
  return (
    <Container backgroundColor={COLOR.VIEW_BG} barStyle={"dark-content"}>
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen
        name="Authorize"
        component={AuthorizeLoginScreen}
      />
    </AuthStack.Navigator>
    </Container>
  );
};

export default AuthNavigator;
