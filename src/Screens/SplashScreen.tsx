/*************************************************
 * AggMaps
 * @exports
 * SplashScreen.tsx
 * Created by Subashree on 02/10/2023
 * Copyright © 2023 AggMaps. All rights reserved.
 *************************************************/

// imports
import { StyleSheet, Text, View, ActivityIndicator, Alert } from "react-native";
import React, { FC, useEffect, useState } from "react";
import CustomButton from "../Components/CustomButton";
import { COLOR } from "../Utils/Constants";
import { navigate, navigateAndSimpleReset } from "../Navigators/utils";
import { useSelector, useDispatch } from "react-redux";
import { RootState, store } from "../Store";
import NetInfo from "@react-native-community/netinfo";
import { updateNetworkStatus } from "../Store/DeviceSlice";
import { useAccessTokenMutation } from "../Services/Module/AuthService";
import { Config } from "../Utils/URL";
import moment from "moment";

const SplashScreen: FC = () => {
  const tokens = useSelector(
    (state: RootState) => state.auth.accessTokenResponse
  );
  const loggedInDate = useSelector(
    (state: RootState) => state.auth.loggedInDate
  );

  const dispatch = useDispatch();

  const [isNetworkavailable, setIsNetworkavailable] = useState(true);
  const [isRefreshTokenLoading, setIsRefreshTokenLoading] = useState(false);

  const navigateToHome = async () => {
    await new Promise((resolve) =>
      setTimeout(() => {
        resolve(true);
      }, 1000)
    );
    navigateAndSimpleReset("Main");
  };

  useEffect(() => {   
    checkNetworkConnection();
    setIsRefreshTokenLoading(true);

      console.log("tokens", tokens?.access_token);
      if (tokens?.access_token) {
        if (isTokenExpired()) {
          //Token expired clear the store and show the login button
          setIsRefreshTokenLoading(false);
          store.dispatch({ type: "RESET_ALL" });
        } else {
          navigateToHome();
        }
      } else {
        setIsRefreshTokenLoading(false);
      }
  }, []);

  const isOneHourAhead = (givenDate: Date) => {
    const currentDate = new Date();

    console.log("currentDate", currentDate);
    console.log("givenDate", givenDate);

    let isOneHourAhead = moment(givenDate).isBefore(
      moment().subtract(tokens?.expires_in, "seconds")
    );

    return isOneHourAhead;
  };

  // Function to check if a token is expired
  const isTokenExpired = () => {
    const givenDate = new Date(loggedInDate);
    const result = isOneHourAhead(givenDate);

    console.log("isTokenExpired ==", result);
    return result;
  };

  const onLoginPressed = async () => {
    if (isNetworkavailable) {
      navigate("Auth");
    } else {
      Alert.alert("Please Check Internet Connection");
    }
  };

  /**
   * Check Network Connection - Definition - it does check the network connectivity status and updates accordingly.
   */
  const checkNetworkConnection = () => {
    NetInfo.addEventListener((state) => {
      console.log("Is Internet connected?", state.isConnected);
      setIsNetworkavailable(state.isConnected);

      dispatch(updateNetworkStatus(state.isConnected));
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AggMaps</Text>
      {isRefreshTokenLoading ? (
        <ActivityIndicator
          style={{ marginTop: 25 }}
          animating={isRefreshTokenLoading}
          size="small"
          color={COLOR.PRIMARY_1}
        />
      ) : (
        <View style={{ paddingVertical: 50, width: 200 }}>
          <CustomButton
            text={"Login"}
            onPress={onLoginPressed}
            bgColor={COLOR.BLACK}
            btnLoading={false}
          />
        </View>
      )}
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F7F9FC",
    flexDirection: "column",
  },
  title: {
    fontSize: 35,
    fontWeight: "bold",
    color: "black",
  },
});
