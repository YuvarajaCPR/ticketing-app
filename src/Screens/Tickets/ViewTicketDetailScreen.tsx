/*************************************************
 * AggMaps
 * @exports
 * TicketListScreen.tsx
 * Created by Subashree on 02/10/2023
 * Copyright © 2023 AggMaps. All rights reserved.
 *************************************************/

// imports
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  FlatList,
  StyleSheet,
  ScrollView,
  Platform,
  Alert,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import React, { useEffect, FC, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import NetInfo from "@react-native-community/netinfo";
import { getScaleAxis } from "../../Utils/Utility";
import { COLOR } from "../../Utils/Constants";
import moment from "moment";
import RNFS from "react-native-fs";
import {
  updateTicketImage,
  updateTicketDetail,
  updateViewTicketResponse,
} from "../../Store/CreateTicketSlice";
import { RootState, store } from "../../Store";
import Utility from "../../Utils/Utility";
import { useDeleteTicketMutation } from "../../Services/Module/CreateTicketService";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import {
  setTickets,
  setCompanyTickets,
  updateDashboardCustomersInOffline,
  updateMasterCustomersInOffline,
  removeCompanyTicket,
  removeTicket,
} from "../../Store/CreateTicketSlice";

import {
  setDashboardOfflineTicketCount,
  setLastSyncedDate,
} from "../../Store/DashboardSlice";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { TICKETS, COMPANIES, BASE_URL } from "../../Utils/URL";
import { navigateAndSimpleReset } from "../../Navigators/utils";
import axios from "axios";
import { decode } from "base64-arraybuffer";
import { TextInput } from "react-native-gesture-handler";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import SyncLoading from "../../Components/SyncLoading";

const ViewTicketDetailScreen: FC = ({ route }) => {
  const windowHeight = Dimensions.get("window").height;
  const windowWidth = Dimensions.get("window").width;
  const [isSyncLoading, setIsSyncLoading] = useState(false);

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  //const ticket = route.params.ticket;
  const ticketIndex = route.params.ticketIndex;

  const [ticket, setTicket] = useState(route?.params?.ticket);
  const [isConnected, setIsConnected] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [deleteTicketModalVisible, setDeleteTicketModalVisible] =
    useState(false);
  const [othersReasonText, setOthersReasonText] = useState("");
  const [othersReasonVisible, setOthersReasonVisible] = useState(false);

  const [activeIndex, setActiveIndex] = useState(0);

  const flatListRef = useRef<FlatList | null>(null);
  const [imagesArray, setImagesArray] = useState([]);

  const ticketImages = useSelector(
    (state: RootState) => state.createTicket.TicketImage
  );

  const viewTicketResponse = useSelector(
    (state: RootState) => state.createTicket.ViewTicketResponse
  );

  const selectedCompany = useSelector(
    (state: RootState) => state.dashboard.selectedCompany
  );

  const customersResponse = useSelector(
    (state: RootState) => state.createTicket.CustomersResponse
  );

  const masterCustomersResponse = useSelector(
    (state: RootState) => state.createTicket.MasterCustomersResponse
  );

  const accessTokenResponse = useSelector(
    (state: RootState) => state.auth.accessTokenResponse
  );

  const lastSyncedDate = useSelector(
    (state: RootState) => state.dashboard.lastSyncedDate
  );

  const [
    deleteTicket,
    {
      data: ticketResponse,
      isSuccess: successTickets,
      isError: errorTickets,
      isLoading: deleteTicketLoading,
    },
  ] = useDeleteTicketMutation();

  const [arrTicketInfo, setArrTicketInfo] = useState([]);

  const [deleteReasonArray, setDeleteReasonArray] = useState([
    { reason: "Wrong Material", isSelected: false },
    { reason: "Material rejected by customer", isSelected: false },
    { reason: "Truck issues", isSelected: false },
    { reason: "Other", isSelected: false },
  ]);

  const [isLandscape, setIsLandscape] = useState<boolean>(
    Dimensions.get("window").width > Dimensions.get("window").height
  );

  // Component DidMount
  useEffect(() => {
    checkNetworkConnection();
  }, []);

  const handleOrientationChange = () => {
    const { width, height } = Dimensions.get("window");
    setIsLandscape(width > height);
  };

  useEffect(() => {
    // Add event listener for orientation changes
    Dimensions.addEventListener("change", handleOrientationChange);
  }, []);

  // Component DidMount
  useEffect(() => {
    if (successTickets) {
      Alert.alert(
        "",
        "Ticket deleted successfully",
        [{ text: "OK", onPress: () => navigation.goBack() }],
        { cancelable: false }
      );
    }
  }, [successTickets]);

  // Component DidMount
  useEffect(() => {
    console.log("ticket Detail", ticket);
    let imagesArray = [];
    if (ticket?.Images) {
      for (let index = 0; index < ticket?.Images.length; index++) {
        const imageElement = ticket?.Images[index];
        let imageString = `file://${RNFS.DocumentDirectoryPath}/${ticket?.Id}${imageElement?.Id}.jpg`;
        imagesArray.push({ Id: imageElement?.Id, uri: imageString });
      }

      if (ticket?.images) {
        for (let index = 0; index < ticket?.images.length; index++) {
          const imageElement = ticket?.images[index];
          imagesArray.push({ Id: 0, uri: imageElement.uri });
        }
      }
    } else {
      for (let index = 0; index < ticket?.images.length; index++) {
        const imageElement = ticket?.images[index];
        imagesArray.push({ Id: 0, uri: imageElement.uri });
      }
    }
    let arrTicketInfo = [];
    arrTicketInfo.push({
      name: "Truck#",
      value: `${ticket?.TruckNum}`,
      image: require("../../assets/imgTruck.png"),
    });
    arrTicketInfo.push({
      name: "PO#",
      value: `${ticket?.PONum}`,
      image: require("../../assets/imgPO.png"),
    });

    //To display quantities from multiple trailers
    let arr = ticket?.Quantities; //["12", "24"];
    for (let index = 0; index < arr.length; index++) {
      const element = arr[index];
      console.log("element", element);
      let quantityObject = {
        name: `Qty ${index + 1}`,
        value: `${
          element.includes(".") ? element.replace(/\.?0+$/, "") : element
        } ${ticket?.units?.Name}`,
        image: require("../../assets/imgQuantity.png"),
      };

      arrTicketInfo.push(quantityObject);
    }
    setArrTicketInfo(arrTicketInfo);

    arrTicketInfo.push({
      name: "Unit Cost",
      value: ticket?.Rate !== null ? `$${ticket?.Rate}` : `$0`,
      image: require("../../assets/imgUnitCost.png"),
    });

    dispatch(updateTicketImage(imagesArray));
    dispatch(updateTicketDetail(ticket));
  }, [ticket]);
  useEffect(() => {
    if (viewTicketResponse) {
      setTicket(viewTicketResponse);
      dispatch(updateViewTicketResponse(undefined));
    }
  }, [viewTicketResponse]);

  // Component DidMount
  useEffect(() => {
    if (isConnected) {
      const fetchData = async () => {
        if (isConnected) {
          let offlineSync = await AsyncStorage.getItem("offlineSync");
          console.log("offlineSync", offlineSync);

          if (offlineSync !== null && isFocused) {
            setIsSyncLoading(true);

            let offlineSyncArray: [
              { method: string; apiName: string; inputParams: any }
            ] = JSON.parse(offlineSync);

            console.log("offlineSyncArray", offlineSyncArray);

            for (let index = 0; index < offlineSyncArray.length; index++) {
              const element = offlineSyncArray[index];
              if (element?.inputParams) {
                if (element?.apiName.includes("images")) {
                  //Add Ticket Images
                  let postTicketResponse = await AsyncStorage.getItem(
                    "postTicketResponse"
                  );

                  if (postTicketResponse !== null) {
                    let postTicketResponseArray: [Object] =
                      JSON.parse(postTicketResponse);

                    console.log(
                      "postTicketResponseArray",
                      postTicketResponseArray
                    );

                    let arrApiName = element.apiName.split("/");
                    let offlineTicketId = arrApiName[arrApiName.length - 2];

                    console.log("offlineTicketId", offlineTicketId);

                    let filterpostTicketResArr = postTicketResponseArray.filter(
                      (res) => {
                        return res.TicketNum == offlineTicketId;
                      }
                    );

                    let onlineTicket = filterpostTicketResArr[0];

                    let apiName = element.apiName;
                    if (onlineTicket) {
                      apiName = `${TICKETS}/${onlineTicket?.Id}/${IMAGES}`;
                      await axios
                        .post(
                          `${BASE_URL}/${apiName}`,
                          decode(element?.inputParams),
                          {
                            headers: {
                              "Content-Type": "multipart/form-data",
                              Authorization: `Bearer ${accessTokenResponse?.access_token}`,
                              Cookie:
                                "rgisanonymous=true; rguserid=51d7049d-1c39-440e-aeae-b24569142b49; rguuid=true",
                            },
                          }
                        )
                        .then(async (response) => {
                          console.log("response 1==", response);

                          if (response.status == 201) {
                            let postTicketImageResponse =
                              await AsyncStorage.getItem(
                                "postTicketImageResponse"
                              );
                            if (postTicketImageResponse !== null) {
                              let postTicketImageResponseArray: [Object] =
                                JSON.parse(postTicketImageResponse);

                              let postImageRes = {
                                Id: response.data?.Id,
                                TicketId: onlineTicket?.Id,
                                offlineTicketNum: onlineTicket?.TicketNum,
                              };
                              postTicketImageResponseArray =
                                postTicketImageResponseArray.concat([
                                  postImageRes,
                                ]);

                              await AsyncStorage.setItem(
                                "postTicketImageResponse",
                                JSON.stringify(postTicketImageResponseArray)
                              );
                            } else {
                              let arrApiName = element.apiName.split("/");
                              let onlineTicketId =
                                arrApiName[arrApiName.length - 2];

                              let postImageRes = {
                                Id: response.data?.Id,
                                TicketId: onlineTicketId,
                                offlineTicketNum: onlineTicketId,
                              };

                              await AsyncStorage.setItem(
                                "postTicketImageResponse",
                                JSON.stringify([postImageRes])
                              );
                            }

                            if (index == offlineSyncArray.length - 1) {
                              setIsSyncLoading(false);
                              dispatch(
                                setLastSyncedDate(
                                  moment().format("MM/DD/YY - hh:mm A")
                                )
                              );

                              Utility.showAlert(
                                "Success",
                                "Sync completed successfully"
                              );
                              AsyncStorage.removeItem("offlineSync");
                              dispatch(setDashboardOfflineTicketCount(0));
                              AsyncStorage.removeItem(
                                "postTicketImageResponse"
                              );
                              AsyncStorage.removeItem("postTicketResponse");
                            }
                          } else if (response.status == 401) {
                            store.dispatch({ type: "RESET_ALL" });
                            navigateAndSimpleReset("Splash");
                          } else {
                            Utility.showAlert("Error", response.data.Message);
                          }
                        })
                        .catch((error) => {
                          console.log("catch 1==", error);
                        });
                    } else {
                      await axios
                        .post(
                          `${BASE_URL}/${element?.apiName}`,
                          decode(element?.inputParams),
                          {
                            headers: {
                              "Content-Type": "multipart/form-data",
                              Authorization: `Bearer ${accessTokenResponse?.access_token}`,
                              Cookie:
                                "rgisanonymous=true; rguserid=51d7049d-1c39-440e-aeae-b24569142b49; rguuid=true",
                            },
                          }
                        )
                        .then(async (response) => {
                          console.log("response 1==", response);

                          if (response.status == 201) {
                            let postTicketImageResponse =
                              await AsyncStorage.getItem(
                                "postTicketImageResponse"
                              );
                            if (postTicketImageResponse !== null) {
                              let postTicketImageResponseArray: [Object] =
                                JSON.parse(postTicketImageResponse);

                              let arrApiName = element.apiName.split("/");
                              let onlineTicketId =
                                arrApiName[arrApiName.length - 2];

                              let postImageRes = {
                                Id: response.data?.Id,
                                TicketId: onlineTicketId,
                                OfflineTicketNum: onlineTicketId,
                              };

                              postTicketImageResponseArray =
                                postTicketImageResponseArray.concat([
                                  postImageRes,
                                ]);

                              await AsyncStorage.setItem(
                                "postTicketImageResponse",
                                JSON.stringify(postTicketImageResponseArray)
                              );
                            } else {
                              let arrApiName = element.apiName.split("/");
                              let onlineTicketId =
                                arrApiName[arrApiName.length - 2];

                              let postImageRes = {
                                Id: response.data?.Id,
                                TicketId: onlineTicketId,
                                OfflineTicketNum: onlineTicketId,
                              };

                              await AsyncStorage.setItem(
                                "postTicketImageResponse",
                                JSON.stringify([postImageRes])
                              );
                            }

                            if (index == offlineSyncArray.length - 1) {
                              setIsSyncLoading(false);
                              dispatch(
                                setLastSyncedDate(
                                  moment().format("MM/DD/YY - hh:mm A")
                                )
                              );

                              Utility.showAlert(
                                "Success",
                                "Sync completed successfully"
                              );
                              AsyncStorage.removeItem("offlineSync");
                              AsyncStorage.removeItem(
                                "postTicketImageResponse"
                              );
                              AsyncStorage.removeItem("postTicketResponse");
                              dispatch(setDashboardOfflineTicketCount(0));
                              dispatch(
                                setLastSyncedDate(
                                  moment().format("MM/DD/YY - hh:mm A")
                                )
                              );
                            }
                          } else if (response.status == 401) {
                            store.dispatch({ type: "RESET_ALL" });
                            navigateAndSimpleReset("Splash");
                          } else {
                            Utility.showAlert("Error", response.data.Message);
                          }
                        })
                        .catch((error) => {
                          console.log("catch 1==", error);
                        });
                    }
                  }else{
                    await axios
                        .post(
                          `${BASE_URL}/${element?.apiName}`,
                          decode(element?.inputParams),
                          {
                            headers: {
                              "Content-Type": "multipart/form-data",
                              Authorization: `Bearer ${accessTokenResponse?.access_token}`,
                              Cookie:
                                "rgisanonymous=true; rguserid=51d7049d-1c39-440e-aeae-b24569142b49; rguuid=true",
                            },
                          }
                        )
                        .then(async (response) => {
                          console.log("response 1==", response);

                          if (response.status == 201) {
                            let postTicketImageResponse =
                              await AsyncStorage.getItem(
                                "postTicketImageResponse"
                              );
                            if (postTicketImageResponse !== null) {
                              let postTicketImageResponseArray: [Object] =
                                JSON.parse(postTicketImageResponse);

                              let arrApiName = element.apiName.split("/");
                              let onlineTicketId =
                                arrApiName[arrApiName.length - 2];

                              let postImageRes = {
                                Id: response.data?.Id,
                                TicketId: onlineTicketId,
                                OfflineTicketNum: onlineTicketId,
                              };

                              postTicketImageResponseArray =
                                postTicketImageResponseArray.concat([
                                  postImageRes,
                                ]);

                              await AsyncStorage.setItem(
                                "postTicketImageResponse",
                                JSON.stringify(postTicketImageResponseArray)
                              );
                            } else {
                              let arrApiName = element.apiName.split("/");
                              let onlineTicketId =
                                arrApiName[arrApiName.length - 2];

                              let postImageRes = {
                                Id: response.data?.Id,
                                TicketId: onlineTicketId,
                                OfflineTicketNum: onlineTicketId,
                              };

                              await AsyncStorage.setItem(
                                "postTicketImageResponse",
                                JSON.stringify([postImageRes])
                              );
                            }

                            if (index == offlineSyncArray.length - 1) {
                              setIsSyncLoading(false);
                              dispatch(
                                setLastSyncedDate(
                                  moment().format("MM/DD/YY - hh:mm A")
                                )
                              );

                              Utility.showAlert(
                                "Success",
                                "Sync completed successfully"
                              );
                              AsyncStorage.removeItem("offlineSync");
                              AsyncStorage.removeItem(
                                "postTicketImageResponse"
                              );
                              AsyncStorage.removeItem("postTicketResponse");
                              dispatch(setDashboardOfflineTicketCount(0));
                              dispatch(
                                setLastSyncedDate(
                                  moment().format("MM/DD/YY - hh:mm A")
                                )
                              );
                            }
                          } else if (response.status == 401) {
                            store.dispatch({ type: "RESET_ALL" });
                            navigateAndSimpleReset("Splash");
                          } else {
                            Utility.showAlert("Error", response.data.Message);
                          }
                        })
                        .catch((error) => {
                          console.log("catch 1==", error);
                        });
                  }
                } else {
                  if (element.method == "PATCH") {
                    //Edit Ticket
                    let postTicketResponse = await AsyncStorage.getItem(
                      "postTicketResponse"
                    );
                    if (postTicketResponse !== null) {
                      let postTicketResponseArray: [Object] =
                        JSON.parse(postTicketResponse);

                      console.log(
                        "postTicketResponseArray",
                        postTicketResponseArray
                      );

                      let arrApiName = element.apiName.split("/");
                      let offlineTicketId = arrApiName[arrApiName.length - 1];

                      console.log("offlineTicketId", offlineTicketId);

                      let filterpostTicketResArr =
                        postTicketResponseArray.filter((res) => {
                          return res.TicketNum == offlineTicketId;
                        });

                      let onlineTicketId = filterpostTicketResArr[0];

                      let apiName = element.apiName;
                      if (onlineTicketId) {
                        apiName = `${COMPANIES}/${onlineTicketId.CompanyId}/${TICKETS}/${onlineTicketId?.Id}`;

                        await axios({
                          method: element?.method,
                          url: `${BASE_URL}/${apiName}`,
                          data: element?.inputParams,
                          headers: {
                            Authorization: `Bearer ${accessTokenResponse?.access_token}`,
                          },
                        })
                          .then(async (response) => {
                            console.log(
                              "edit offline ticket response 2==",
                              response.data
                            );
                            if (response.status == 401) {
                              store.dispatch({ type: "RESET_ALL" });
                              navigateAndSimpleReset("Splash");
                            } else if (response.status == 200) {
                              if (index == offlineSyncArray.length - 1) {
                                setIsSyncLoading(false);
                                dispatch(
                                  setLastSyncedDate(
                                    moment().format("MM/DD/YY - hh:mm A")
                                  )
                                );

                                Utility.showAlert(
                                  "Success",
                                  "Sync completed successfully"
                                );
                                AsyncStorage.removeItem("offlineSync");
                                dispatch(setDashboardOfflineTicketCount(0));
                                AsyncStorage.removeItem(
                                  "postTicketImageResponse"
                                );
                                AsyncStorage.removeItem("postTicketResponse");
                              }
                            } else {
                              Utility.showAlert("Error", response.data.Message);
                            }
                          })
                          .catch((error) => {
                            console.log("catch 2==", error);
                          });
                      }
                    } else {
                      await axios({
                        method: element?.method,
                        url: `${BASE_URL}/${element.apiName}`,
                        data: element?.inputParams,
                        headers: {
                          Authorization: `Bearer ${accessTokenResponse?.access_token}`,
                        },
                      })
                        .then(async (response) => {
                          console.log(
                            "edit online ticket response 2==",
                            response.data
                          );
                          if (response.status == 401) {
                            store.dispatch({ type: "RESET_ALL" });
                            navigateAndSimpleReset("Splash");
                          } else if (response.status == 200) {
                            if (index == offlineSyncArray.length - 1) {
                              setIsSyncLoading(false);
                              dispatch(
                                setLastSyncedDate(
                                  moment().format("MM/DD/YY - hh:mm A")
                                )
                              );

                              Utility.showAlert(
                                "Success",
                                "Sync completed successfully"
                              );
                              AsyncStorage.removeItem("offlineSync");
                              dispatch(setDashboardOfflineTicketCount(0));
                              AsyncStorage.removeItem(
                                "postTicketImageResponse"
                              );
                              AsyncStorage.removeItem("postTicketResponse");
                            }
                          } else {
                            Utility.showAlert("Error", response.data.Message);
                          }
                        })
                        .catch((error) => {
                          console.log("catch 2==", error);
                        });
                    }
                  } else {
                    //Add for Delete Ticket
                    let arrApiName = element.apiName.split("/");
                    let deleteNameString = arrApiName[arrApiName.length - 1];

                    if (deleteNameString == "delete") {
                      let postTicketResponse = await AsyncStorage.getItem(
                        "postTicketResponse"
                      );
                      if (postTicketResponse !== null) {
                        let postTicketResponseArray: [Object] =
                          JSON.parse(postTicketResponse);

                        console.log(
                          "postTicketResponseArray",
                          postTicketResponseArray
                        );

                        let arrApiName = element.apiName.split("/");
                        let offlineTicketId = arrApiName[arrApiName.length - 2];

                        console.log("offlineTicketId", offlineTicketId);

                        let filterpostTicketResArr =
                          postTicketResponseArray.filter((res) => {
                            return res.TicketNum == offlineTicketId;
                          });

                        let onlineTicketId = filterpostTicketResArr[0];

                        let apiName = element.apiName;
                        if (onlineTicketId) {
                          //Delete Ticket for a offline created ticket.
                          apiName = `${COMPANIES}/${onlineTicketId?.CompanyId}/${TICKETS}/${onlineTicketId?.Id}/delete`;
                          console.log("apiName", apiName);
                          console.log(
                            " element?.inputParams",
                            element?.inputParams
                          );

                          await axios({
                            method: element?.method,
                            url: `${BASE_URL}/${apiName}`,
                            data: element?.inputParams,
                            headers: {
                              Authorization: `Bearer ${accessTokenResponse?.access_token}`,
                            },
                          })
                            .then(async (response) => {
                              console.log(
                                "delete offline ticket response 2==",
                                response
                              );
                              if (response.status == 401) {
                                store.dispatch({ type: "RESET_ALL" });
                                navigateAndSimpleReset("Splash");
                              } else if (response.status == 204) {
                                if (index == offlineSyncArray.length - 1) {
                                  setIsSyncLoading(false);
                                  dispatch(
                                    setLastSyncedDate(
                                      moment().format("MM/DD/YY - hh:mm A")
                                    )
                                  );

                                  Utility.showAlert(
                                    "Success",
                                    "Sync completed successfully"
                                  );
                                  AsyncStorage.removeItem("offlineSync");
                                  dispatch(setDashboardOfflineTicketCount(0));
                                  AsyncStorage.removeItem(
                                    "postTicketImageResponse"
                                  );
                                  AsyncStorage.removeItem("postTicketResponse");
                                }
                              } else {
                                Utility.showAlert(
                                  "Error",
                                  response.data.Message
                                );
                              }
                            })
                            .catch((error) => {
                              console.log("catch 2==", error);
                            });
                        }
                      } else {
                        //Delete ticket for a online created ticket
                        await axios({
                          method: element?.method,
                          url: `${BASE_URL}/${element.apiName}`,
                          data: element?.inputParams,
                          headers: {
                            Authorization: `Bearer ${accessTokenResponse?.access_token}`,
                          },
                        })
                          .then(async (response) => {
                            console.log(
                              "delete online ticket response 2==",
                              response
                            );
                            if (response.status == 401) {
                              store.dispatch({ type: "RESET_ALL" });
                              navigateAndSimpleReset("Splash");
                            } else if (response.status == 204) {
                              if (index == offlineSyncArray.length - 1) {
                                setIsSyncLoading(false);
                                dispatch(
                                  setLastSyncedDate(
                                    moment().format("MM/DD/YY - hh:mm A")
                                  )
                                );

                                Utility.showAlert(
                                  "Success",
                                  "Sync completed successfully"
                                );
                                AsyncStorage.removeItem("offlineSync");
                                dispatch(setDashboardOfflineTicketCount(0));
                                AsyncStorage.removeItem(
                                  "postTicketImageResponse"
                                );
                                AsyncStorage.removeItem("postTicketResponse");
                              }
                            } else {
                              Utility.showAlert("Error", response.data.Message);
                            }
                          })
                          .catch((error) => {
                            console.log("catch 2==", error);
                          });
                      }
                    } else {
                      //Create Ticket
                      await axios({
                        method: element?.method,
                        url: `${BASE_URL}/${element.apiName}`,
                        data: element?.inputParams,
                        headers: {
                          Authorization: `Bearer ${accessTokenResponse?.access_token}`,
                        },
                      })
                        .then(async (response) => {
                          console.log(
                            "Create ticket response 2==",
                            response.data
                          );
                          if (response.status == 401) {
                            store.dispatch({ type: "RESET_ALL" });
                            navigateAndSimpleReset("Splash");
                          } else if (response.status == 200 || response.status == 204) {
                            if (element?.method == "POST" && element.apiName != "support") {
                              let postTicketResponse =
                                await AsyncStorage.getItem(
                                  "postTicketResponse"
                                );
                              if (postTicketResponse !== null) {
                                let postTicketResponseArray: [Object] =
                                  JSON.parse(postTicketResponse);

                                postTicketResponseArray =
                                  postTicketResponseArray.concat([
                                    response.data,
                                  ]);

                                await AsyncStorage.setItem(
                                  "postTicketResponse",
                                  JSON.stringify(postTicketResponseArray)
                                );
                              } else {
                                await AsyncStorage.setItem(
                                  "postTicketResponse",
                                  JSON.stringify([response.data])
                                );
                              }
                            }

                            if (index == offlineSyncArray.length - 1) {
                              setIsSyncLoading(false);
                              dispatch(
                                setLastSyncedDate(
                                  moment().format("MM/DD/YY - hh:mm A")
                                )
                              );

                              Utility.showAlert(
                                "Success",
                                "Sync completed successfully"
                              );
                              AsyncStorage.removeItem("offlineSync");
                              dispatch(setDashboardOfflineTicketCount(0));
                              AsyncStorage.removeItem(
                                "postTicketImageResponse"
                              );
                              AsyncStorage.removeItem("postTicketResponse");
                            }
                          } else {
                            Utility.showAlert("Error", response.data.Message);
                          }
                        })
                        .catch((error) => {
                          console.log("catch 2==", error);
                        });
                    }
                  }
                }
              } else {
                //Delete ticket Images
                if (element?.apiName.includes("images")) {
                  //Delete Ticket Image
                  let postTicketResponse = await AsyncStorage.getItem(
                    "postTicketImageResponse"
                  );
                  if (postTicketResponse !== null) {
                    let postTicketResponseArray: [Object] =
                      JSON.parse(postTicketResponse);

                    console.log(
                      "postTicketImageResponse",
                      postTicketResponseArray
                    );

                    let arrApiName = element.apiName.split("/");
                    let offlineImageId = arrApiName[arrApiName.length - 1];
                    let offlineTicketId = arrApiName[arrApiName.length - 3];
                    let companyId = arrApiName[1];

                    console.log("offlineTicketId", offlineTicketId);
                    console.log("offlineImageId", offlineImageId);

                    let filterpostTicketResArr = postTicketResponseArray.filter(
                      (res) => {
                        return res.TicketNum == offlineTicketId;
                      }
                    );
                    let apiName = element?.apiName;
                    let onlineTicketId = filterpostTicketResArr[0];
                    if (onlineTicketId) {
                      apiName = `${COMPANIES}/${companyId}/${TICKETS}/${onlineTicketId?.TicketId}/${IMAGES}/${onlineTicketId?.Id}`;
                    }

                    await axios({
                      method: element?.method,
                      url: `${BASE_URL}/${apiName}`,
                      headers: {
                        Authorization: `Bearer ${accessTokenResponse?.access_token}`,
                      },
                    })
                      .then(async (response) => {
                        console.log("response 3==", response);

                        if (response.status == 401) {
                          store.dispatch({ type: "RESET_ALL" });
                          navigateAndSimpleReset("Splash");
                        } else if (response.status == 200) {
                          if (index == offlineSyncArray.length - 1) {
                            setIsSyncLoading(false);
                            dispatch(
                              setLastSyncedDate(
                                moment().format("MM/DD/YY - hh:mm A")
                              )
                            );

                            Utility.showAlert(
                              "Success",
                              "Sync completed successfully"
                            );
                            AsyncStorage.removeItem("offlineSync");
                            dispatch(setDashboardOfflineTicketCount(0));
                            AsyncStorage.removeItem("postTicketImageResponse");
                            AsyncStorage.removeItem("postTicketResponse");
                          }
                        } else {
                          Utility.showAlert("Error", response.data.Message);
                        }
                      })
                      .catch((error) => {
                        console.log("catch 3==", error);
                      });
                  } else {
                    await axios({
                      method: element?.method,
                      url: `${BASE_URL}/${element?.apiName}`,
                      headers: {
                        Authorization: `Bearer ${accessTokenResponse?.access_token}`,
                      },
                    })
                      .then(async (response) => {
                        console.log("response 3==", response);

                        if (response.status == 401) {
                          store.dispatch({ type: "RESET_ALL" });
                          navigateAndSimpleReset("Splash");
                        } else if (response.status == 200) {
                          if (index == offlineSyncArray.length - 1) {
                            setIsSyncLoading(false);
                            dispatch(
                              setLastSyncedDate(
                                moment().format("MM/DD/YY - hh:mm A")
                              )
                            );

                            Utility.showAlert(
                              "Success",
                              "Sync completed successfully"
                            );
                            AsyncStorage.removeItem("offlineSync");
                            dispatch(setDashboardOfflineTicketCount(0));
                            AsyncStorage.removeItem("postTicketImageResponse");
                            AsyncStorage.removeItem("postTicketResponse");
                          }
                        } else {
                          Utility.showAlert("Error", response.data.Message);
                        }
                      })
                      .catch((error) => {
                        console.log("catch 3==", error);
                      });
                  }
                }
              }
            }
          }
        }
      };

      fetchData();
    }
  }, [isConnected]);

  /**
   * Check Network Connection - Definition - it does check the network connectivity status and updates accordingly.
   */
  const checkNetworkConnection = () => {
    NetInfo.addEventListener((state) => {
      console.log("Is Internet connected?", state.isConnected);
      setIsConnected(state.isConnected);
    });
  };

  const openModal = () => {
    setImageModalVisible(true);
    setActiveIndex(0);
  };

  const closeModal = () => {
    setImageModalVisible(false);
  };

  const goToPreviousImage = () => {
    if (flatListRef.current && flatListRef.current.scrollToIndex) {
      const newIndex = Math.max(0, activeIndex - 1);
      flatListRef.current.scrollToIndex({ animated: true, index: newIndex });
      setActiveIndex(newIndex);
    }
  };

  const goToNextImage = () => {
    if (flatListRef.current && flatListRef.current.scrollToIndex) {
      if (ticketImages) {
        const newIndex = Math.min(ticketImages.length - 1, activeIndex + 1);
        flatListRef.current.scrollToIndex({
          animated: true,
          index: newIndex,
        });
        setActiveIndex(newIndex);
      }
    }
  };

  const reasonItemPressed = (item, index) => {
    setDeleteReasonArray((prevArray) =>
      prevArray.map((obj) =>
        obj.reason === item.reason
          ? { ...obj, isSelected: obj?.isSelected ? false : true }
          : { ...obj, isSelected: false }
      )
    );
    if (deleteReasonArray[index].reason == "Other") {
      if (!deleteReasonArray[index].isSelected == true) {
        setOthersReasonVisible(true);
        setOthersReasonText("");
      } else {
        setOthersReasonVisible(false);
      }
    } else {
      setOthersReasonVisible(false);
    }
  };

  const deleteTicketPressed = async () => {
    let filterDeleteReasonArray = deleteReasonArray.filter((res) => {
      return res.isSelected == true;
    });
    if (filterDeleteReasonArray.length > 0) {
      setDeleteTicketModalVisible(false);

      let reasonString = "";
      let selectedReason = filterDeleteReasonArray[0].reason;
      if (selectedReason == "Other") {
        reasonString = othersReasonText;
      } else {
        reasonString = selectedReason;
      }

      if (isConnected) {
        deleteTicket({
          companyId: selectedCompany?.Id,
          ticketId: ticket?.Id,
          DeleteReason: reasonString,
        });
      } else {
        //Save API params in Async storage for sync
        let deleteTicketInput = await AsyncStorage.getItem("offlineSync");
        if (deleteTicketInput !== null) {
          let deleteTicketArray: [] = JSON.parse(deleteTicketInput);

          let offlineInput = {
            apiName: `${COMPANIES}/${selectedCompany?.Id}/${TICKETS}/${ticket?.Id}/delete`,
            inputParams: { DeleteReason: reasonString },
            method: "POST",
          };

          deleteTicketArray = deleteTicketArray.concat(offlineInput);

          await AsyncStorage.setItem(
            "offlineSync",
            JSON.stringify(deleteTicketArray)
          );
        } else {
          let deleteTicketArray = [];
          let offlineInput = {
            apiName: `${COMPANIES}/${selectedCompany?.Id}/${TICKETS}/${ticket?.Id}/delete`,
            inputParams: { DeleteReason: reasonString },
            method: "POST",
          };

          deleteTicketArray.push(offlineInput);

          await AsyncStorage.setItem(
            "offlineSync",
            JSON.stringify(deleteTicketArray)
          );
        }
        //Remove the deleted ticket Object from ticket list array
        dispatch(removeCompanyTicket(ticket?.Id));
        dispatch(removeTicket(ticket?.Id));

        //Update Dashboard customer list in offline
        customersResponse.map((item, index) => {
          if (item.Id === ticket.CustomerId) {
            let updatedObject = {
              ...item,
              DayTicketCount: item?.DayTicketCount - 1,
            }; // Create a new object with the updated age
            dispatch(
              updateDashboardCustomersInOffline({
                updatedObject: updatedObject,
                index: index,
              })
            );
          }
        });

        //Update master customer list in offline
        masterCustomersResponse.map((item, index) => {
          if (item.Id === ticket.CustomerId) {
            let updatedObject = {
              ...item,
              DayTicketCount: item?.DayTicketCount - 1,
            }; // Create a new object with the updated age
            dispatch(
              updateMasterCustomersInOffline({
                updatedObject: updatedObject,
                index: index,
              })
            );
          }
        });

        //Update dashboard ticket count in offline
        const offlineDashboardTicketCount =
          store.getState().dashboard.offlineTicketCount;

        if (offlineDashboardTicketCount) {
          if (offlineDashboardTicketCount > 0) {
            let offlineTicketCount = offlineDashboardTicketCount - 1;
            dispatch(setDashboardOfflineTicketCount(offlineTicketCount));
          }
        }

        Alert.alert(
          "",
          "Ticket deleted successfully in offline",
          [{ text: "OK", onPress: () => navigation.goBack() }],
          { cancelable: false }
        );
      }
    } else {
      Utility.showAlert("", "Select Reason to delete a ticket");
    }
  };

  const TicketViewHeader = () => {
    const navigation: any = useNavigation();

    return (
      <View style={styles.container}>
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
            #{ticket?.Id}
          </Text>
        </View>

        <View style={{ flexDirection: "row", marginRight: 10 }}>
          <TouchableOpacity onPress={() =>navigation.navigate("Discovery", {ticketDetails: ticket})}
            style={{
              width: 70,
              height: 30,
              backgroundColor: "white",
            }}
          >
            <Image style={{}} source={require("../../assets/imgPrint.png")} />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: 30,
              marginLeft: 5,
              height: 30,
              backgroundColor: "white",
            }}
            onPress={() =>
              navigation.navigate("CreateTicketScreen", {
                isEdit: true,
                ticketIndex: ticketIndex,
                ticketDetails: ticket,
              })
            }
          >
            <Image style={{}} source={require("../../assets/imgEdit.png")} />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: 30,
              marginLeft: 5,
              height: 30,
              backgroundColor: "white",
            }}
            onPress={() => setDeleteTicketModalVisible(true)}
          >
            <Image style={{}} source={require("../../assets/imgDelete.png")} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: COLOR.VIEW_BG,
          marginHorizontal: 10,
          flexDirection: "column",
        }}
      >
        {TicketViewHeader()}

        <View
          style={{
            backgroundColor: COLOR.WHITE,
            marginHorizontal: 10,
            flexDirection: "column",
            borderRadius: 20,
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <Text
              style={{
                marginLeft: 15,
                fontSize: 19,
                color: "black",
                fontWeight: "500",
                marginTop: 20,
                flex: 1,
                
              }}
              numberOfLines={1}
            >
              {ticket?.product?.Name}
            </Text>
            {ticketImages.length ? (
              <View
                style={{
                  width: 50,
                  height: 50,
                  marginRight: 20,
                  marginTop: 20,
                }}
              >
                <TouchableOpacity
                  style={{ width: 50, height: 50,  }}
                  onPress={() => openModal()}
                >
                  <Image
                    style={{ width: 50, height: 50, borderRadius:5 }}
                    source={{
                      uri: ticketImages[0].uri,
                    }}
                  />
                  <View
                    style={{
                      backgroundColor: COLOR.BLUE,
                      width: 15,
                      height: 15,
                      borderRadius: 7,
                      alignItems: "center",
                      justifyContent: "center",
                      marginTop: -18,
                      marginLeft: 30,
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        textAlign: "center",
                        fontSize: 10,
                      }}
                    >
                      {ticketImages.length}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
          <View
            style={{
              flexDirection: "row",
              marginHorizontal: 15,
              alignItems: "center",
              marginTop: ticketImages.length ? -15 : 10,
            }}
          >
            <Image
              style={{ width: 20, height: 20 }}
              source={require("../../assets/imgCalendar.png")}
            />
            <Text
              style={{
                marginLeft: 5,
                fontSize: 15,
                color: "gray",
                flex: 1,
                alignItems: "flex-end",
              }}
            >
              {moment(ticket?.Created).format("MM/DD/YY - hh:mm A")}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "lightgray",
              height: 1,
              marginTop: 10,
            }}
          ></View>

          <View
            style={{
              flexDirection: "column",
            }}
          >
            {arrTicketInfo.map((item) => (
              <View
                style={{
                  flexDirection: "column",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      width: 50,
                      height: 50,
                      backgroundColor: "#EAF0FB",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Image
                      style={{ width: 30, height: 30 }}
                      source={item.image}
                    ></Image>
                  </View>

                  <Text
                    style={{
                      marginLeft: 14,
                      fontSize: 15,
                      color: "black",
                      flex: 1,
                    }}
                  >
                    {item.name}
                  </Text>

                  <Text
                    style={{
                      fontSize: 15,
                      color: "black",
                      textAlign: "right",
                      alignItems: "flex-end",
                      marginRight: 10,
                      flex: 1,
                      fontWeight:'bold'
                    }}
                    numberOfLines={1}
                  >
                    {item.value}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "lightgray",
                    height: 1,
                  }}
                ></View>
              </View>
            ))}
            <View
              style={{
                flexDirection: "row",
                marginVertical: 20,
                marginLeft: 10,
              }}
            >
              <Text
                style={{
                  fontSize: 17,
                  fontWeight: "bold",
                  color: "black",
                  flex: 1,
                }}
              >
                Total Cost
              </Text>

              <Text
                style={{
                  fontSize: 15,
                  color: "black",
                  textAlign: "center",
                  alignItems: "flex-end",
                  marginRight: 10,
                  fontWeight:'bold'
                }}
              >
                ${ticket?.Rate !== null ? ticket?.Rate : "0"}
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            backgroundColor: COLOR.WHITE,
            marginHorizontal: 10,
            marginTop: 20,
            flexDirection: "row",
            borderRadius: 20,
            height: 70,
            alignItems: "center",
          }}
        >
          <Image
            resizeMode={"cover"}
            source={require("../../assets/placeholder.png")}
            style={{
              height: 40,
              width: 40,
              borderRadius: 20,
              marginLeft: 15,
            }}
          />
          <View
            style={{
              flexDirection: "column",
              marginLeft: 5,
            }}
          >
            <Text
              style={{
                fontSize: 15,
                color: "black",
                fontWeight: "500",
              }}
            >
              {ticket?.user?.FirstName} {ticket?.user?.Surname}
            </Text>

            <View
              style={{
                flexDirection: "row",
                marginTop: 10,
              }}
            >
              <Image
                style={{ width: 18, height: 18 }}
                source={require("../../assets/imgLocation.png")}
              />
              <Text
                style={{
                  fontSize: 14,
                  color: "gray",
                  marginLeft: 5,
                }}
              >
                {ticket?.location?.SiteName}
              </Text>
            </View>
          </View>
        </View>

        <View
          style={{
            backgroundColor: COLOR.WHITE,
            marginHorizontal: 10,
            marginTop: 20,
            flexDirection: "column",
            borderRadius: 20,
            height: 50,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              marginLeft: 15,
              flex: 1,
              alignItems: "center",
            }}
          >
            <Image
              style={{}}
              source={require("../../assets/lastSyncIcon.png")}
            />
            <Text
              style={{
                flex: 1,
                marginLeft: 5,
                fontSize: 14,
                color: "#55B85C",
              }}
            >
              Sync Completed
            </Text>
            <View style={{ flex: 1, flexDirection: "row" }}>
              <Text
                style={{
                  flex: 1,
                  color: "black",
                  textAlign: "right",
                  marginRight: 10,
                }}
              >
                {lastSyncedDate ? lastSyncedDate : "Not synced"}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
      {imageModalVisible && (
        <View style={styles.modalContainer}>
          <TouchableOpacity
            onPress={() => closeModal()}
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <View style={{ alignItems: "center", flexDirection: "row" }}>
              <TouchableOpacity
                style={{ paddingHorizontal: 10 }}
                onPress={goToPreviousImage}
                disabled={activeIndex === 0}
              >
                <Image
                  style={{}}
                  source={require("../../assets/imgRightArrow.png")}
                />
              </TouchableOpacity>
              <FlatList
                ref={(ref) => (flatListRef.current = ref)}
                data={ticketImages}
                scrollEnabled={false}
                pagingEnabled
                horizontal
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <Image
                    source={{
                      uri: item.uri,
                    }}
                    style={{ width: 300, height: 300, flex: 1 }}
                    resizeMode="contain"
                  />
                )}
                initialScrollIndex={activeIndex}
                getItemLayout={(data, index) => ({
                  length: 300,
                  offset: 300 * index,
                  index,
                })}
              />
              <TouchableOpacity
                style={{
                  paddingHorizontal: 10,
                  marginTop: 20,
                  width: 50,
                  height: 50,
                }}
                onPress={goToNextImage}
                disabled={activeIndex === ticketImages.length - 1}
              >
                <Image
                  style={{}}
                  source={require("../../assets/imgLeftArrow.png")}
                />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>
      )}

      {deleteTicketModalVisible && (
        <View style={styles.modalContainer}>
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 10,
              marginHorizontal: 20,
              height: isLandscape
                ? othersReasonVisible
                  ? 300
                  : 300
                : othersReasonVisible
                ? 420
                : 300,
            }}
          >
            <View
              style={{
                flexDirection: "column",
                marginTop: isLandscape ? 10 : 25,
                marginHorizontal: 20,
              }}
            >
              <Text style={{ fontSize: 17, fontWeight: "bold" }}>
                Are you sure you want to delete this ticket?
              </Text>

              <FlatList
                style={{ marginTop: 10 }}
                data={deleteReasonArray}
                keyExtractor={(item) => item.reason}
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      padding: 10,
                      alignItems: "center",
                    }}
                    onPress={() => reasonItemPressed(item, index)}
                  >
                    {item.isSelected ? (
                      <Image
                        style={{ width: 20, height: 20 }}
                        source={require("../../assets/imgSelAllLocations.png")}
                      />
                    ) : (
                      <Image
                        style={{ width: 20, height: 20 }}
                        source={require("../../assets/imgUnSelectDeleteReason.png")}
                      />
                    )}

                    <Text
                      style={{
                        flex: 1,
                        marginLeft: 5,
                        fontSize: 15,
                        color: "black",
                      }}
                      numberOfLines={1}
                    >
                      {item.reason}
                    </Text>
                  </TouchableOpacity>
                )}
              />
              {othersReasonVisible ? (
                <TextInput
                  style={{
                    backgroundColor: "#EFEFEF",
                    borderColor: "lightgray",
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                    borderTopRightRadius: 10,
                    borderBottomRightRadius: 10,
                    borderWidth: 1,
                    paddingLeft: 10,
                    padding: 15,
                    height: isLandscape ? 45 : 90,
                    marginTop: isLandscape ? 0 : 10,
                  }}
                  placeholder="Reason for deleting the ticket"
                  placeholderTextColor={"#B1B1B1"}
                  value={othersReasonText}
                  maxLength={100}
                  multiline={true}
                  onChangeText={(value) => {
                    setOthersReasonText(value);
                  }}
                ></TextInput>
              ) : null}

              <View
                style={{
                  flexDirection: "row",
                  marginTop: isLandscape ? 10 : 15,
                  flex: 1,
                  justifyContent: "flex-end",
                }}
              >
                <TouchableOpacity
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: COLOR.VIEW_BG,
                    borderRadius: 10,
                    borderColor: "black",
                    borderWidth: 1,
                    height: 40,
                    width: 100,
                  }}
                  onPress={() => setDeleteTicketModalVisible(false)}
                >
                  <Text
                    style={{ fontSize: 15, color: "black", fontWeight: "400" }}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    marginHorizontal: 10,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: COLOR.BLUE,
                    borderRadius: 10,
                    borderColor: "white",
                    borderWidth: 1,
                    height: 41,
                    width: 100,
                  }}
                  onPress={() => deleteTicketPressed()}
                >
                  <Text
                    style={{
                      fontSize: 15,
                      color: "white",
                      fontWeight: "400",
                    }}
                  >
                    Delete
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      )}

      {isSyncLoading ? <SyncLoading isSyncLoading={isSyncLoading} /> : null}

      <View
        style={{
          flex: 1,
          position: "absolute",
          marginTop: windowHeight / 2,
          marginLeft: windowWidth / 2,
        }}
      >
        <ActivityIndicator
          style={{}}
          color={COLOR.BLUE}
          animating={deleteTicketLoading}
        ></ActivityIndicator>
      </View>
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
  serachBox: {
    borderColor: "#BDC1C7",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
    height: 50,
    flexDirection: "row",
    marginHorizontal: 10,
    marginVertical: getScaleAxis(10),
    backgroundColor: "white",
  },
  modalContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
  },
});

export default ViewTicketDetailScreen;
