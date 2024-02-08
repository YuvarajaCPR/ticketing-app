import React from "react";
import { Image, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { COLOR, fontStyles } from "../Utils/Constants";
import { getScaleAxis } from "../Utils/Utility";
import { useNavigation } from "@react-navigation/native";

type PropsType = {
  profileName: string;
  profileImage?: string;
};

const DashboardHeader = (props: PropsType) => {
  const { profileName, profileImage } = props || {};
  const navigation: any = useNavigation();

  return (
    <View style={styles.container}>
      {profileImage ? (
        <TouchableOpacity
          style={styles.topImgContainer}
          onPress={() => navigation.navigate("ProfileScreen", {isBackButton: true})}
        >
          <Image
            // source={require('../assets/placeholder.png')}
            source={{ uri: profileImage }}
            style={styles.imgContainer}
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.topImgContainer}
          onPress={() => navigation.navigate("ProfileScreen", {isBackButton: true})}
        >
          <Image
            source={require("../assets/placeholder.png")}
            style={styles.imgContainer}
          />
        </TouchableOpacity>
      )}
      <TouchableOpacity
        style={styles.textContainer}
        onPress={() => navigation.navigate("ProfileScreen", {isBackButton: true})}
      >
        <Text style={fontStyles.H1}>{profileName}</Text>
      </TouchableOpacity>
      {/* <View style={styles.rightContainer}>
        <Image source={require("../assets/imgNotifications.png")} />
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: getScaleAxis(72),
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
  },
  imgContainer: {
    width: getScaleAxis(40),
    height: getScaleAxis(40),
    borderRadius: getScaleAxis(20),
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  topImgContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: getScaleAxis(12),
    marginLeft: getScaleAxis(15),
    width: getScaleAxis(48),
    height: getScaleAxis(48),
    borderRadius: getScaleAxis(25),
    borderColor: "lightgray",
    borderWidth: 1,
    backgroundColor: "white",
  },
  rightContainer: {
    width: getScaleAxis(25),
    height: getScaleAxis(25),
    alignContent: "flex-end",
    marginRight: 10,
  },
  topLeftContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: getScaleAxis(12),
    overflow: "hidden",
    position: "absolute",
    left: getScaleAxis(20),
  },
});

export default DashboardHeader;
