/*************************************************
 * RNSETUP
 * @exports
 * @component MainNavigator.tsx
 * Created by Subashree on 03/10/2023
 * Copyright © 2023 RNSETUP. All rights reserved.
 *************************************************/
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import Icon from "react-native-vector-icons/AntDesign";
import DashboardNavigator from "./DashboardNavigator";
import ProfileNavigator from "./ProfileNavigator";
import TicketNavigator from "./TicketNavigator";
import { useSelector } from "react-redux";
import { RootState } from "../Store";
import {
    TouchableOpacity,
    Image,
    Text,
    StyleSheet,
    View,
    Platform,
  } from "react-native";
const Tab = createBottomTabNavigator();

// @refresh reset
const BottomTabNavigator = () => {
  return (
<Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarLabel: '', // Set tabBarLabel to an empty string to remove text
        tabBarIcon: ({ focused, color, size }) => {
          // You can return any component that you like here!
          return  <Image style = {{ marginTop:20}}
          source={route.name === "Home" ? focused ? require('../assets/imgSelHome.png') : require('../assets/imgHome.png')
        : route.name === "Tickets" ? focused ? require('../assets/imgSelTickets.png') : require('../assets/imgTickets.png') : 
        focused ? require('../assets/imgSelAccount.png') : require('../assets/imgAccount.png')}
        />;
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={DashboardNavigator}
        options={{
          headerShown: false,
          tabBarLabelPosition: "below-icon",
        }}
      />
      <Tab.Screen
        name="Tickets"
        component={TicketNavigator}
        options={{
          headerShown: false,
          tabBarLabelPosition: "below-icon",
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileNavigator}
        options={{
          headerShown: false,
          tabBarLabelPosition: "below-icon",
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
