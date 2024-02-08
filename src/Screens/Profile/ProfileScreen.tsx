/*************************************************
 * AggMaps
 * @exports
 * ProfileScreen.tsx
 * Created by Subashree on 25/09/2023
 * Copyright © 2023 AggMaps. All rights reserved.
 *************************************************/

// imports
import {
  View,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  StyleSheet,
  Dimensions,
  ImageSourcePropType,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, FC, useState } from "react";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../Store";
import CustomButton from "../../Components/CustomButton";
import Utility from "../../Utils/Utility";
import { COLOR, FONT_SIZE } from "../../Utils/Constants";
import { navigate } from "../../Navigators/utils";
import { getScaleAxis } from "../../Utils/Utility";
import NetInfo from "@react-native-community/netinfo";
import { FlatList } from "react-native-gesture-handler";
import { store } from "../../Store";
import { navigateAndSimpleReset } from "../../Navigators/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { decode } from "base64-arraybuffer";
import {
  setDashboardOfflineTicketCount,
  setLastSyncedDate,
} from "../../Store/DashboardSlice";
import { BASE_URL, TICKETS, IMAGES, COMPANIES } from "../../Utils/URL";
import moment from "moment";
import SyncLoading from "../../Components/SyncLoading";

const ProfileScreen: FC = ({ route }) => {
  const navigation: any = useNavigation();
  const isFocused = useIsFocused();
  const isBackButton = route.params ? route.params.isBackButton : false;
  const dispatch = useDispatch();

  const UserResponse = useSelector(
    (state: RootState) => state.dashboard.UserResponse
  );
  const accessTokenResponse = useSelector(
    (state: RootState) => state.auth.accessTokenResponse
  );

  const [isConnected, setIsConnected] = useState(false);
  const [isSyncLoading, setIsSyncLoading] = useState(false);

  const deviceHeight = Dimensions.get("window").height;
  const windowWidth = Dimensions.get("window").width;

  type dataType = {
    id: string;
    name: string;
    icon?: ImageSourcePropType;
    vIcon?: React.ReactNode;
    isRightIcon?: boolean;
    onPress?: () => void;
  };

  const DATA: Array<dataType> = [
    {
      id: "1",
      name: "Contact Support",
      icon: require("../../assets/imgContactSupport.png"),

      isRightIcon: true,
      onPress: () => {
        navigate("ContactSupportScreen");
      },
    },
    {
      id: "2",
      name: "Privacy Policy",
      icon: require("../../assets/PolicyIcon.png"),
      isRightIcon: true,
      onPress: () => {
        navigate("PrivacyPolicyScreen");
      },
    },
    {
      id: "3",
      name: "Terms & Conditions",
      icon: require("../../assets/TermsIcon.png"),
      isRightIcon: true,
      onPress: () => {
        navigate("TermsAndConditionScreen");
      },
    },
  ];

  // Component DidMount
  useEffect(() => {
    checkNetworkConnection();
  }, []);

  /**
   * Check Network Connection - Definition - it does check the network connectivity status and updates accordingly.
   */
  const checkNetworkConnection = () => {
    NetInfo.addEventListener((state) => {
      console.log("Is Internet connected?", state.isConnected);
      setIsConnected(state.isConnected);
    });
  };

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

  const _renderProfileImage = () => {
    if (UserResponse?.ProfileImage) {
      return (
        <View
          style={{
            marginVertical: 10,
            alignItems: "center",
          }}
        >
          <Image
            resizeMode={"cover"}
            source={{ uri: UserResponse?.ProfileImage }}
            style={{
              height: deviceHeight / 8,
              width: deviceHeight / 8,
              borderRadius: deviceHeight / 8,
            }}
          />
          {/* <Image
          resizeMode={"cover"}
          source={require("../../assets/imgEditImage.png")
          }
          style={{
            height: 25,
            width: 25,
            bottom:0,
            marginTop:-20,
            marginLeft: 60
          }}
          /> */}
        </View>
      );
    } else {
      return (
        <TouchableOpacity
          style={{
            marginVertical: 10,
            alignItems: "center",
          }}
        >
          <Image
            resizeMode={"cover"}
            source={require("../../assets/placeholder.png")}
            style={{
              height: deviceHeight / 8,
              width: deviceHeight / 8,
              borderRadius: deviceHeight / 8,
            }}
          />
          {/* <Image
          resizeMode={"cover"}
          source={require("../../assets/imgEditImage.png")
          }
          style={{
            height: 25,
            width: 25,
            position:'absolute'
          }}
          /> */}
        </TouchableOpacity>
      );
    }
  };

  const _renderProfileList = () => {
    return (
      <FlatList
        data={DATA}
        style={{
          backgroundColor: "white",
          flexDirection: "column",
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10,
          marginHorizontal: 10,
          marginTop: 25,
        }}
        keyExtractor={(item) => item.Id}
        ItemSeparatorComponent={() => (
          <View style={{ height: 0.5, backgroundColor: "#9FABB9" }} />
        )}
        renderItem={({ item, index }) => (
          <>
            <TouchableOpacity
              style={{ flexDirection: "row", flex: 1, padding: 20 }}
              onPress={() => {
                item?.onPress();
              }}
            >
              {item.icon ? (
                <Image
                  resizeMode={"contain"}
                  source={item.icon}
                  style={{
                    height: 20,
                    width: 20,
                  }}
                />
              ) : null}
              {item.vIcon ? item.vIcon : null}
              <Text
                style={{
                  color: "black",
                  fontSize: 17,
                  fontWeight: "500",
                  flex: 1,
                  marginLeft: 10,
                }}
              >
                {item.name}
              </Text>
              {item.isRightIcon ? (
                <Image
                  resizeMode={"contain"}
                  source={require("../../assets/rightChevronGrey.png")}
                  style={{
                    height: 18,
                    width: 18,
                  }}
                />
              ) : null}
            </TouchableOpacity>
          </>
        )}
      />

      // <Pressable
      //   key={item.id}
      //   onPress={() => {
      //     item?.onPress();
      //   }}
      //   style={{
      //     backgroundColor: "white",
      //     padding: 18,
      //     flexDirection: "column",
      //     borderTopLeftRadius: 10,
      //     borderTopRightRadius: 10,
      //     borderBottomLeftRadius: 10,
      //     borderBottomRightRadius: 10,
      //     marginHorizontal:10,
      //   }}
      // >

      // </Pressable>
    );
    // });
    // return listItem;
  };

  const profileheader = () => {
    return (
      <View style={styles.container}>
        {isBackButton ? (
          <TouchableOpacity
            style={styles.topImgContainer}
            onPress={() => navigation.goBack()}
          >
            <Image
              source={require("../../assets/imgBack.png")}
              style={styles.imgContainer}
            />
          </TouchableOpacity>
        ) : null}
        <View style={styles.textContainer}>
          <Text style={{ color: "black", fontSize: 20, fontWeight: "600" }}>
            {"Profile"}
          </Text>
        </View>
        <View
          style={{
            backgroundColor: isConnected ? "green" : "red",
            width: 15,
            height: 15,
            borderRadius: 7,
          }}
        ></View>
        <Text
          style={{
            color: "black",
            fontSize: 15,
            fontWeight: "300",
            marginRight: 12,
          }}
        >
          {" "}
          {isConnected ? "Online" : "Offline"}{" "}
        </Text>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLOR.VIEW_BG }}>
      <SafeAreaView>
        {profileheader()}
        <ScrollView>
          <View style={{ marginHorizontal: 10, marginVertical: 10 }}>
            {_renderProfileImage()}
            <Text style={styles.nameText}>
              {UserResponse && UserResponse.FirstName}{" "}
              {UserResponse && UserResponse.Surname}
            </Text>
            <Text style={styles.emailText}>
              {UserResponse && UserResponse.Email}
            </Text>
            {/* <Text style={styles.phoneText}>
              {UserResponse && UserResponse.Phone}
            </Text> */}
            {_renderProfileList()}
            {/* <Text style={styles.versionText}>
              Version V{DeviceInfo.getVersion()}
            </Text> */}
            <View style={{ flex: 1, marginTop: 25, marginHorizontal: 10 }}>
              <CustomButton
                text={"Logout"}
                onPress={() => {
                  Utility.showAlertWithYesCancelAction(
                    "Logout",
                    "Are you sure you want to log out?",
                    async () => {
                      store.dispatch({ type: "RESET_ALL" });
                      navigateAndSimpleReset("Splash");

                      // let deviceName = await DeviceInfo.getDeviceName();
                      // let osType = await DeviceInfo.getSystemName();
                      // logoutData = {
                      //   deviceId: deviceName,
                      //   deviceType: osType,
                      // };
                      // await logout({
                      //   refreshToken: tokens?.refresh.token,
                      //   ...logoutData,
                      // })
                      //   .then((res) => {})
                      //   .catch((err) => {});
                    }
                  );
                }}
                bgColor={COLOR.PRIMARY_1}
                // btnLoading={isLoading}
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
      {isSyncLoading ? <SyncLoading isSyncLoading={isSyncLoading} /> : null}
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  nameText: {
    fontSize: 20,
    color: COLOR.BLACK,
    fontWeight: "600",
    alignSelf: "center",
  },
  emailText: {
    fontSize: FONT_SIZE.M,
    color: COLOR.BLACK,
    fontWeight: "300",
    alignSelf: "center",
    marginVertical: 4,
  },
  phoneText: {
    fontSize: FONT_SIZE.M,
    color: COLOR.BLACK,
    fontWeight: "300",
    alignSelf: "center",
    marginBottom: 20,
  },
  container: {
    width: "100%",
    height: getScaleAxis(72),
    flexDirection: "row",
    alignItems: "center",
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
  imgContainer: {
    marginLeft: 1,
    width: 30,
    height: 30,
  },
});
