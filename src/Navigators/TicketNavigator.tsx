/*************************************************
 * AggMaps
 * @exports
 * @component TicketNavigator.tsx
 * Created by Subashree S on 19/09/2023
 * Copyright © 2023 AggMaps. All rights reserved.
 *************************************************/

import React, { useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import {
  TicketListScreen,
  CreateTicketScreen,
  ViewTicketDetailScreen,
  SimplePrint,
  Discovery,
} from "../Screens/Tickets";
import Container from "../Components/Container";
import { COLOR } from "../Utils/Constants";

const TicketsStack = createStackNavigator();

// @refresh reset
const TicketNavigator = () => {
  return (
    <Container backgroundColor={COLOR.VIEW_BG} barStyle={"dark-content"}>
      <TicketsStack.Navigator screenOptions={{ headerShown: false }}>
        <TicketsStack.Screen
          name="TicketListScreen"
          component={TicketListScreen}
        />
        <TicketsStack.Screen
          name="CreateTicketScreen"
          component={CreateTicketScreen}
        />
        <TicketsStack.Screen
          name="ViewTicketDetailScreen"
          component={ViewTicketDetailScreen}
        />
        <TicketsStack.Screen name="Discovery" component={Discovery} />
        <TicketsStack.Screen name="SimplePrint" component={SimplePrint} />
      </TicketsStack.Navigator>
    </Container>
  );
};

export default TicketNavigator;
