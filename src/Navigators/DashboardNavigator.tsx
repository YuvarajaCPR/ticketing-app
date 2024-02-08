/*************************************************
 * AggMaps
 * @exports
 * @component DashboardNavigator.tsx
 * Created by Subashree S on 19/09/2023
 * Copyright © 2023 AggMaps. All rights reserved.
 *************************************************/

import React, { useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { DashboardScreen } from "../Screens/Dashboard";
import { CreateTicketScreen } from "../Screens/Tickets";
import Container from "../Components/Container";
import { COLOR } from "../Utils/Constants";
import { ProfileScreen, PrivacyPolicyScreen, TermsAndConditionScreen, ContactSupportScreen } from "../Screens/Profile";

const HomeStack = createStackNavigator();

// @refresh reset
const DashboardNavigator = () => {
  return (
    <Container backgroundColor={COLOR.VIEW_BG} barStyle={"dark-content"}>
      <HomeStack.Navigator screenOptions={{ headerShown: false }}>
        <HomeStack.Screen name="Home" component={DashboardScreen} />
        <HomeStack.Screen name="CreateTicketScreen" component={CreateTicketScreen} />
        <HomeStack.Screen name="ProfileScreen" component={ProfileScreen} />
        <HomeStack.Screen
          name="PrivacyPolicyScreen"
          component={PrivacyPolicyScreen}
        />
        <HomeStack.Screen
          name="TermsAndConditionScreen"
          component={TermsAndConditionScreen}
        />
         <HomeStack.Screen
          name="ContactSupportScreen"
          component={ContactSupportScreen}
        />
      </HomeStack.Navigator>
    </Container>
  );
};

export default DashboardNavigator;
