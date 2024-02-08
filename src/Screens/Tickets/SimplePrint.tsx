import React, { memo, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Button,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { PrinterInfo } from "../../PrinterComponents/PrinterInfo";
import EscPosPrinter, {
  getPrinterSeriesByName,
} from "react-native-esc-pos-printer";
import { useRoute, type RouteProp } from "@react-navigation/native";
// import { base64Image } from '../base64Image';
import type { DeviceInfo } from "react-native-esc-pos-printer";
import { useNavigation } from "@react-navigation/native";
import { getScaleAxis } from "../../Utils/Utility";
import { COLOR } from "../../Utils/Constants";
import CustomButton from "../../Components/CustomButton";
import RNZebraBluetoothPrinter from "react-native-zebra-bluetooth-printer";
import moment from "moment";
// import RNPrint from 'react-native-print';

export type RootStackParamList = {
  Discovery: undefined;
  SimplePrint: {
    printer: DeviceInfo;
    ticketDetails: {};
    selectedCompany:{};
    userDetails:{};
  };
};

type SimplePrintRouteProp = RouteProp<RootStackParamList, "SimplePrint">;

async function print(ticketDetails, selectedCompany) {
  console.log("selectedCompany", selectedCompany);
  console.log("ticketDetails", ticketDetails);

  const printing = new EscPosPrinter.printing();

  await printing
    .initialize()
    .align("center")
    .size(2, 2)
    .line(selectedCompany?.Name)
    .smooth(true)
    .newline()
    .size(1, 1)
    .textLine(48, {
      left: "Ticket#",
      right: ticketDetails?.Id,
      gapSymbol: ".",
    })
    .newline()
    .textLine(48, {
      left: "Customer",
      right: ticketDetails?.customer?.Name,
      gapSymbol: ".",
    })
    .newline()
    .textLine(48, {
      left: "Location",
      right: ticketDetails?.location?.SiteName,
      gapSymbol: ".",
    })
    .newline()
    .textLine(48, {
      left: "Product",
      right: ticketDetails?.product?.Name,
      gapSymbol: ".",
    })
    .newline()
    .textLine(48, {
      left: "Truck #",
      right: ticketDetails?.TruckNum,
      gapSymbol: ".",
    })
    .newline()
    .textLine(48, {
      left: "PO #",
      right: ticketDetails?.PONum,
      gapSymbol: ".",
    })
    .newline()
    .textLine(48, {
      left: "Unit Cost",
      right: ticketDetails?.Rate !== null ? `$${ticketDetails?.Rate}` : `$0`,
      gapSymbol: ".",
    })
    .newline()
    .textLine(48, {
      left: "Qty",
      right: ticketDetails?.Quantities.toString(),
      gapSymbol: ".",
    })
    .newline()
    .size(2, 2)
    .textLine(40, {
      left: "Total Cost",
      right: ticketDetails?.Rate !== null ? `$${ticketDetails?.Rate}` : `$0`,
    })
    .newline()
    .cut()
    .send();
}

const SimplePrint = memo(() => {
  const {
    params: { printer, ticketDetails, selectedCompany, userDetails },
  } = useRoute<SimplePrintRouteProp>();

  const [init, setInit] = useState(false);
  const [printing, setPrinting] = useState(false);
  const navigation = useNavigation();
  

    // Component DidMount
    useEffect(() => {
      console.log('connectDevice', printer);

      RNZebraBluetoothPrinter.connectDevice(printer.address).then((res) => {

        console.log('connectDevice', res);
        //do something with res
        //for android, device address is mac address
        //for iOS, device address is a long string like 0C347F9F-2881-9CCB-43B0-205976944626
      })
    }, []);

  // const zebraDisconnect = () => {
  //   RNZebraBluetoothPrinter.unpairDevice(printer.address).then((res) => {
  //     //do something with res
  //     console.log('unpairDevice', res);
  //     Alert.alert('', 'Device disconnected successfully')
  //     navigation.goBack();
  //   })
  // }

  const zebraPrint = () => {
    const sum = ticketDetails?.Quantities.reduce((acc, current) => acc + parseFloat(current), 0);

    const zpl = `^XA" +
    "^FO30,40^A0N,40,40^FD${selectedCompany?.Name}^FS" +
    "^FO30,80^GB480,1,1^FS" +
    "^FO30,120^A0N,25,25^FDTicket #:^FS^FO300,120^A0N,25,25^FD${ticketDetails?.Id}^FS" +
    "^FO30,160^A0N,25,25^FDDate: ${moment(ticketDetails?.Created).format("MM/DD/YYYY")}^FS^FO300,160^A0N,25,25^FDTime: ${moment(ticketDetails?.Created).format("HH:mm:ss")}^FS" +
    "^FO30,200^GB480,1,1^FS" +
    "^FO30,240^A0N,20,20^FDDriver Name: ^FS^FO300,240^A0N,20,20^FD${userDetails?.FirstName} ${userDetails?.Surname}^FS" +
    "^FO30,280^GB480,1,1^FS" +
    "^FO30,320^A0N,20,20^FDCustomer: ^FS^FO300,320^A0N,20,20^FD${ticketDetails?.customer?.Name}^FS" +
    "^FO30,360^A0N,20,20^FDProduct: ^FS^FO300,360^A0N,20,20^FD${ticketDetails?.product?.Name}^FS" +
    "^FO30,400^A0N,20,20^FDTruck #: ^FS^FO300,400^A0N,20,20^FD${ticketDetails?.TruckNum}^FS" +
    "^FO30,440^A0N,20,20^FDPO #: ^FS^FO300,440^A0N,20,20^FD${ticketDetails?.PONum}^FS" +
    "^FO30,480^GB480,1,1^FS" +
    "^FO30,520^A0N,20,20^FDTrailer Count: ^FS^FO300,520^A0N,20,20^FD${ticketDetails?.Quantities?.length}^FS" +
    "^FO30,560^A0N,20,20^FDUnit: ^FS^FO300,560^A0N,20,20^FD${sum}/ ${ticketDetails?.units?.Name}^FS" +
    "^FO30,600^GB480,1,1^FS" +
    "^XZ`;

  RNZebraBluetoothPrinter.print(zpl).then((res) => {
    //do something with res
    console.log('print zebra', res);
  })
  }

  // const printHTML = async () => {
  //   await RNPrint.print({
  //     html: '<h1>Heading 1</h1><h2>Heading 2</h2><h3>Heading 3</h3>'
  //   })
  // }


  
  const printSimpleReceipt = async () => {
    if (!init) {
      await EscPosPrinter.init({
        target: printer.target,
        seriesName: getPrinterSeriesByName(printer.deviceName),
        language: "EPOS2_LANG_EN",
      });
      setInit(true);
    }
    try {
      setPrinting(true);
      await print(ticketDetails, selectedCompany);
    } catch (e) {
      console.log("Print error", e);
      Alert.alert("Error", "Could not able to print ticket");
    } finally {
      setPrinting(false);
    }
  };

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
            Printer Info
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {TicketViewHeader()}
      <View style={styles.contentCotainer}>


     <PrinterInfo printer={printer} /> 
      </View>
      <View
        style={{
          width: 200,
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CustomButton
          text={"Print"}
          // onPress={printSimpleReceipt}
          onPress={zebraPrint}
          bgColor={COLOR.BLUE}
          btnLoading={printing}
        />
         {/* <CustomButton
          text={"Diconnect"}
          // onPress={printSimpleReceipt}
          onPress={zebraDisconnect}
          bgColor={COLOR.BLUE}
          btnLoading={printing}
        /> */}
        <Text style={styles.errorText} />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fcf9f9",
    alignItems: "center",
    justifyContent: "center",
  },

  contentCotainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  errorText: {
    color: "red",
    fontSize: 16,
    marginTop: 20,
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
export default SimplePrint;
