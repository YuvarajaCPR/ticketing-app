/*************************************************
 * AggMaps
 * @exports
 * SplashScreen.tsx
 * Created by Abdul on 06/07/2023
 * Copyright © 2023 AggMaps. All rights reserved.
 *************************************************/

// imports
import { View, Platform, Linking, Text } from "react-native";
import React, { useEffect, FC, useState } from "react";
import { useDispatch } from "react-redux";
import CustomButton from "../Components/CustomButton";
import { COLOR } from "../Utils/Constants";
import { navigateAndSimpleReset } from "../Navigators/utils";
import { useAccessTokenMutation } from "../Services/Module/AuthService";
import { OAUTH_URL, Config } from "../Utils/URL";
import AuthorizeHeader from "../Components/AuthorizeHeader";
import { setLoggedInDate, setAuthCode } from "../Store/AuthSlice";
import moment from "moment";
import { InAppBrowser } from "react-native-inappbrowser-reborn";
// import {authorize, refresh, AuthConfiguration} from 'react-native-app-auth';

const AuthorizeLoginScreen: FC = () => {
  const [code, setCode] = useState("");
  const dispatch = useDispatch();

  const [
    getAccessToken,
    { data: accessTokenResponse, isSuccess, isLoading, error, isError },
  ] = useAccessTokenMutation();

  useEffect(() => {
    openAuthorizationURL();
  }, []);

  /* The API success or error responses are handled by react-toolkit-query. Just check the API responses in useEffect*/
  useEffect(() => {
    if (isSuccess) {
      if (accessTokenResponse) {
        console.log("accessTokenResponse authorize", accessTokenResponse);
        if (accessTokenResponse?.access_token) {
          navigateAndSimpleReset("Main");
        }
      }
    }
    if (isError) {
      console.log("error login", error);
      // let customError = error as CustomError;
      // if (customError.status !== 200) {
      //   let customError = error as CustomError;
      // Utility.showSnackBar(customError?.data?.message, "Error");
    }
  }, [isSuccess, isError]);

  useEffect(() => {
    const handleOpenURL = (event: { url: string }) => {
      const { url } = event;
      if (url.startsWith("aggmaps://oauth-callback")) {
        if (Platform.OS == "ios" || Platform.OS == "android") {
          InAppBrowser.close();
          InAppBrowser.closeAuth()
        }

        // Handle the URL as needed in your app
        const code = url.split("?code=")[1];
        console.log("Received custom code:", code);
        setCode(code);
        dispatch(setAuthCode(code));
        dispatch(setLoggedInDate(moment(new Date()).format()));
      }
    };

    // Add event listener when the component mounts
    Linking.addEventListener("url", handleOpenURL);

    // Remove event listener when the component unmounts
    return () => {
      Linking.removeAllListeners("url");
    };
  }, []);

  const openAuthorizationURL = async () => {
    const oAuthURL = `${OAUTH_URL}/authorize?response_type=code&client_id=${Config.client_id}&redirect_uri=${Config.redirect_uri}&client_secret=${Config.client_secret}`;

    try {
      if (Platform.OS == "ios" || Platform.OS == "android") {

        // const authConfig = {
        //   clientId: Config.client_id,
        //   redirectUrl: Config.redirect_uri,
        //   scopes: ['openid', 'profile', 'email'],
        //   serviceConfiguration: {
        //     authorizationEndpoint: `${OAUTH_URL}/authorize`,
        //     tokenEndpoint: `${OAUTH_URL}/access_token`,
        //   },
        // };

        // try {
        //   const result = await authorize(authConfig);
        //   console.log('Authorization Result:', result);
        // } catch (error) {
        //   console.error('Authorization Error:', error);
        // }

        await InAppBrowser.open(oAuthURL, {
          // iOS Properties
          dismissButtonStyle: "cancel",
          preferredBarTintColor: COLOR.VIEW_BG,
          preferredControlTintColor: "white",
          readerMode: false,
          animated: true,
          modalPresentationStyle: "fullScreen",
          modalTransitionStyle: "coverVertical",
          modalEnabled: true,
          enableBarCollapsing: false,
          // Android Properties
          showTitle: true,
          toolbarColor: COLOR.VIEW_BG,
          secondaryToolbarColor: "black",
          navigationBarColor: "black",
          navigationBarDividerColor: "white",
          enableUrlBarHiding: true,
          enableDefaultShare: true,
          forceCloseOnRedirection: false,
          // Specify full animation resource identifier(package:anim/name)
          // or only resource name(in case of animation bundled with app).
          animations: {
            startEnter: "slide_in_right",
            startExit: "slide_out_left",
            endEnter: "slide_in_left",
            endExit: "slide_out_right",
          },
          ephemeralWebSession: true,
        });
      } else {
        Linking.openURL(oAuthURL);
      }
    } catch (error) {}
  };

  const onAuthorizePressed = async () => {
    let data = {
      ...Config,
      code: code,
    };
    await getAccessToken(data);
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#F7F9FC",
      }}
    >
      <AuthorizeHeader />
      {code !== "" ? (
        <View
          style={{
            flex: 1,
            paddingHorizontal: 20,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{ textAlign: "center", color: "black", marginBottom: 25 }}
          >
            The application "AggMaps" would like the ability to access your
            Information.
          </Text>
          <View style={{ width: 200 }}>
            <CustomButton
              text={"Authorize"}
              onPress={onAuthorizePressed}
              bgColor={COLOR.BLACK}
              btnLoading={isLoading}
            />
          </View>
        </View>
      ) : null}
    </View>
  );
};

export default AuthorizeLoginScreen;
