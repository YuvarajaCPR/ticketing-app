import React from "react";
import { Image, StyleSheet, Text, View, TouchableOpacity, Platform } from "react-native";
import { getScaleAxis } from "../Utils/Utility";
import { useNavigation } from "@react-navigation/native";

type PropsType = {
    isOnline: boolean;
    isEdit: boolean;
  };
const CreateTicketHeader = (props: PropsType) => {
    const {isOnline, isEdit} = props || {};
    
    const navigation: any = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.topImgContainer} onPress={() => navigation.goBack()}>
        <Image
          source={require("../assets/imgBack.png")}
          style={styles.imgContainer}
        />
      </TouchableOpacity>
      <View style={styles.textContainer}>
        <Text style={{color:'black', fontSize:18, fontWeight:'600'}}>{isEdit ? 'Edit' : 'Create'}</Text>
      </View>
      <View style = {{backgroundColor: isOnline ? 'green' : 'red', width:15, height:15, borderRadius:7}}></View>
      <Text style={{color:'black', fontSize:15, fontWeight:'300', marginRight:12}}> {isOnline ? 'Online' : 'Offline'} </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: getScaleAxis(72),
    flexDirection: "row",
    alignItems: "center",
  },
  imgContainer: {
    marginLeft: 1,
    width: 30,
    height: 30,
  },
  textContainer: {
    flex: 1,
    marginLeft:10
  },
  topImgContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: getScaleAxis(12),
    marginLeft:20,
    width: 30,
    height: 30,
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

export default CreateTicketHeader;
