/*************************************************
 * AggMaps
 * SyncLoading
 * Created by Yuvaraja C on 22/12/2023
 * Copyright © 2023 AGGmaps. All rights reserved.
 *************************************************/

import React from "react";
import { View, Text, ActivityIndicator, Dimensions } from "react-native";
import { COLOR } from "../Utils/Constants";

const SyncLoading = (props: any) => {
  const deviceHeight = Dimensions.get("window").height;
  const windowWidth = Dimensions.get("window").width;
  return (
    <View
      style={{
        flex: 1,
        position: "absolute",
        marginTop: deviceHeight / 2 - 20,
        marginLeft: windowWidth / 2 - 30,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#d4d5d6",
        borderRadius: 5,
      }}
    >
      <ActivityIndicator
        size="large"
        color={COLOR.BLUE}
        animating={props.isSyncLoading}
      />

      <Text
        style={{
          marginTop: 10,
          textAlign: "center",
          fontSize: 16,
          fontWeight: "bold",
          color: "black",
          padding: 5,
        }}
      >
        Syncing...
      </Text>
    </View>
  );
};

export default SyncLoading;
