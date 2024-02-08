/*************************************************
 * AggMaps
 * @exports
 * @component ProfileNavigator.tsx
 * Created by Subashree S on 19/09/2023
 * Copyright © 2023 AggMaps. All rights reserved.
 *************************************************/

import React, { useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { ProfileScreen, PrivacyPolicyScreen, TermsAndConditionScreen, ContactSupportScreen } from "../Screens/Profile";
import { COLOR } from "../Utils/Constants";
import Container from "../Components/Container";

const ProfileStack = createStackNavigator();

// @refresh reset
const ProfileNavigator = () => {
  return (
    <Container backgroundColor={COLOR.VIEW_BG} barStyle={"dark-content"}>
      <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
        <ProfileStack.Screen name="ProfileScreen" component={ProfileScreen} />
        <ProfileStack.Screen
          name="PrivacyPolicyScreen"
          component={PrivacyPolicyScreen}
        />
        <ProfileStack.Screen
          name="TermsAndConditionScreen"
          component={TermsAndConditionScreen}
        />
         <ProfileStack.Screen
          name="ContactSupportScreen"
          component={ContactSupportScreen}
        />
      </ProfileStack.Navigator>
    </Container>
  );
};

export default ProfileNavigator;
