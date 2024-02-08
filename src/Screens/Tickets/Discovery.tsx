import React, { FC, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Button,
  TouchableOpacity,
  Image,
  TextInput,
  Platform,
  FlatList,
  Pressable,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import {
  DiscoveryFilterOption,
  usePrintersDiscovery,
} from "react-native-esc-pos-printer";
import { PrintersList } from "../../PrinterComponents/PrintersList";
import { useNavigation } from "@react-navigation/native";
import type { DeviceInfo } from "react-native-esc-pos-printer";
import BleManager from "react-native-ble-manager";
import EscPosPrinter from "react-native-esc-pos-printer";
import { PrintersDiscovery } from "react-native-esc-pos-printer";
import { getScaleAxis } from "../../Utils/Utility";
import { COLOR } from "../../Utils/Constants";
import CustomButton from "../../Components/CustomButton";
import { RootState } from "../../Store";
import { useSelector } from "react-redux";
import RNZebraBluetoothPrinter from "react-native-zebra-bluetooth-printer";

const Discovery: FC = ({ route }) => {
  const ticketDetails = route.params.ticketDetails;

  const windowHeight = Dimensions.get("window").height;
  const windowWidth = Dimensions.get("window").width;

  const { start, printerError, isDiscovering, printers } =
    usePrintersDiscovery();
  const [devices, setDevices] = useState<Device[]>([]);
  const [tcpVal, setTcpVal] = useState("TCP:192.168.29.25");
  const navigation = useNavigation();

  const selectedCompany = useSelector(
    (state: RootState) => state.dashboard.selectedCompany
  );

  const userResponse = useSelector(
    (state: RootState) => state.dashboard.UserResponse
  );

  // // Component DidMount
  // useEffect(() => {
  //   EscPosPrinter.init({
  //     target: tcpVal,
  //     seriesName: "EPOS2_TM_T88VII",
  //     language: "EPOS2_LANG_EN",
  //   }).then(() => {
  //     console.log("init success");
  //   });
  // }, []);

  // // Component DidMount
  // useEffect(() => {
  //   console.log("isDiscovering", isDiscovering);
  //   console.log("printers", printers);
  //   console.log("printerError", printerError);

  //   // setDevices(printers);
  // }, [isDiscovering, printers]);

  // Component DidMount
  useEffect(() => {
    RNZebraBluetoothPrinter.isEnabledBluetooth().then((res) => {
      //do something with res
      console.log("isEnabledBluetooth", res);

      if (res) {
        RNZebraBluetoothPrinter.enableBluetooth().then((result) => {
          //do something with res

          console.log("enableBluetooth", result);

          RNZebraBluetoothPrinter.scanDevices().then((deviceArray) => {
            //do something with res
            let foundDevices = deviceArray.found;
            console.log("foundDevices", JSON.parse(foundDevices));

            setDevices(...devices, JSON.parse(foundDevices));

            console.log("devices", devices);

            RNZebraBluetoothPrinter.pairedDevices().then(
              (pairedDeviceArray) => {
                //do something with deviceArray

                console.log("pairedDeviceArray", pairedDeviceArray);
              }
            );
          });
        });
      }
    });
  }, []);

  const searchPrinters = () => {
    RNZebraBluetoothPrinter.isEnabledBluetooth().then((res) => {
      //do something with res
      console.log("isEnabledBluetooth", res);

      if (res) {
        RNZebraBluetoothPrinter.enableBluetooth().then((result) => {
          //do something with res

          console.log("enableBluetooth", result);

          RNZebraBluetoothPrinter.scanDevices().then((deviceArray) => {
            //do something with res
            let foundDevices = deviceArray.found;
            console.log("foundDevices", JSON.parse(foundDevices));

            setDevices(...devices, JSON.parse(foundDevices));

            console.log("devices", devices);

            RNZebraBluetoothPrinter.pairedDevices().then(
              (pairedDeviceArray) => {
                //do something with deviceArray

                console.log("pairedDeviceArray", pairedDeviceArray);
              }
            );
          });
        });
      }
    });
  }

  const TicketViewHeader = () => {
    const navigation: any = useNavigation();

    return (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity
          style={styles.topImgContainer}
          onPress={() => navigation.goBack()}
        >
          <Image
            source={require("../../assets/imgBack.png")}
            style={styles.imgContainer}
          />
        </TouchableOpacity>
        <View style={styles.textContainer}>
          <Text style={{ color: "black", fontSize: 18, fontWeight: "600" }}>
            Discover Printers
          </Text>
        </View>
      </View>
    );
  };

  const renderItem = ({ item }) => {
    return (
      <Pressable
        onPress={() =>

       
            navigation.navigate("SimplePrint", {
              printer: item,
              ticketDetails: ticketDetails,
              selectedCompany: selectedCompany,
              userDetails: userResponse,
            })
        }
        style={styles.itemContainer}
      >
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.subtitle}>Address: {item.address}</Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      {TicketViewHeader()}
      {/* <View
        style={{ alignItems: "center", flexDirection: "row", marginTop: 25 }}
      >
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>Enter TCP: </Text>
        <TextInput
          style={{
            marginLeft: 10,
            backgroundColor: COLOR.WHITE,
            borderColor: "lightgray",
            borderRadius: 10,
            borderWidth: 1,
            paddingLeft: 10,
            padding: 15,
          }}
          placeholder="Enter TCP"
          placeholderTextColor={"black"}
          value={tcpVal}
          onChangeText={(value) => {
            setTcpVal(value);
          }}
        ></TextInput>
      </View> */}
      <View style={styles.contentCotainer}></View>
      {devices.length > 0 ? (
        <View style={styles.flatListcontainer}>
          <FlatList data={devices} renderItem={renderItem} />
        </View>
      ) : (
        <><View>
            <ActivityIndicator
              style={{
                flex: 1,
                // position: "absolute",
                // marginTop: windowHeight / 2,
                // marginLeft: windowWidth / 2,
              }}
              animating={true}
              size="small"
              color={COLOR.BLUE} />
          </View>

            {/* //<PrintersList
            //   onPress={(printer: any) => {
            //     if (printer) {
            //       navigation.navigate("SimplePrint", {
            //         printer: printer,
            //         ticketDetails: ticketDetails,
            //         selectedCompany: selectedCompany,
            //       });
            //     }
            //   }}
            //   printers={devices}
            // /> */}
            <View
              style={{
                alignItems: "center",
                marginTop: 40,
                justifyContent: "center",
              }}
            >
              <Text style={{ textAlign: "center", fontSize: 15 }}>
                No Printers Found
              </Text>
            </View></>
      )}

      <View
        style={{
          marginTop: 40,
          width: 200,
        }}
      >
        <CustomButton
          text={"Search"}
          onPress={() => {
            searchPrinters();
          }}
          bgColor={COLOR.BLUE}
        />
      </View>

      {printerError ? (
        <Text style={styles.errorText}>{printerError.message}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  flatListcontainer: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 26,
    width: 300,
    minHeight: 350,
    overflow: "hidden",
    paddingVertical: 20,
  },
  itemContainer: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginLeft: 20,
    paddingVertical: 10,
    marginRight: 5,
  },
  title: {
    fontSize: 16,
  },

  subtitle: {
    fontSize: 12,
    fontWeight: "400",
    color: "#8e8e93",
  },
  container: {
    flex: 1,
    backgroundColor: "#fcf9f9",
    flexDirection: "column",
    alignItems: "center",
  },

  contentCotainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
  },

  errorText: {
    color: "red",
    fontSize: 16,
    marginTop: 5,
  },
  imgContainer: {
    marginLeft: 1,
    width: 30,
    height: 30,
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  topImgContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: getScaleAxis(12),
    marginLeft: 10,
    width: 30,
    height: 30,
  },
});
export default Discovery;
