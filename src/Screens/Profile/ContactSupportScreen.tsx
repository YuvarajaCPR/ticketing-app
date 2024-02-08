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
  ScrollView,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useEffect, FC, useState } from "react";
import { useNavigation, useIsFocused } from "@react-navigation/native";
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
import {
  BASE_URL,
  TICKETS,
  IMAGES,
  COMPANIES,
  CONTACT_SUPPORT,
} from "../../Utils/URL";
import moment from "moment";
import { useSendSupportMessageMutation } from "../../Services/Module/ProfileService";
import SyncLoading from "../../Components/SyncLoading";

const ContactSupportScreen: FC = ({ route }) => {
  const navigation: any = useNavigation();
  const isFocused = useIsFocused();
  const dispatch = useDispatch();

  const UserResponse = useSelector(
    (state: RootState) => state.dashboard.UserResponse
  );
  const accessTokenResponse = useSelector(
    (state: RootState) => state.auth.accessTokenResponse
  );

  const [isConnected, setIsConnected] = useState(false);
  const [isSyncLoading, setIsSyncLoading] = useState(false);
  const [message, setMessage] = useState("");

  const deviceHeight = Dimensions.get("window").height;
  const windowWidth = Dimensions.get("window").width;

  const [
    sendSupportmessage,
    {
      isSuccess: supportMessageSuccess,
      isLoading: supportMessageLoading,
      data: supportMessageResponse,
    },
  ] = useSendSupportMessageMutation();

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
                          } else if (response.status == 200 || response.status == 204 ) {
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

  // Component DidMount
  useEffect(() => {
    if (supportMessageSuccess) {
      Alert.alert(
        "",
        "Support message send successfully",
        [{ text: "OK", onPress: () => navigation.goBack() }],
        { cancelable: false }
      );
    }
  }, [supportMessageSuccess]);

  const sendMessagePressed = async () => {
    if (message.length) {
      if (isConnected) {
        sendSupportmessage({ Message: message });
      } else {
        //Save API params in Async storage for sync
        let createTicketInput = await AsyncStorage.getItem("offlineSync");
        if (createTicketInput !== null) {
          let createTicketArray: [] = JSON.parse(createTicketInput);

          let offlineInput = {
            apiName: `${CONTACT_SUPPORT}`,
            inputParams: JSON.stringify({ Message: message }),
            method: "POST",
          };

          createTicketArray = createTicketArray.concat([offlineInput]);

          await AsyncStorage.setItem(
            "offlineSync",
            JSON.stringify(createTicketArray)
          );
        } else {
          let createTicketArray = [];
          let offlineInput = {
            apiName: `${CONTACT_SUPPORT}`,
            inputParams: JSON.stringify({ Message: message }),
            method: "POST",
          };

          createTicketArray.push(offlineInput);

          await AsyncStorage.setItem(
            "offlineSync",
            JSON.stringify(createTicketArray)
          );
        }
        Alert.alert(
          "",
          "Support message send successfully in offline",
          [{ text: "OK", onPress: () => navigation.goBack() }],
          { cancelable: false }
        );
      }
    } else {
      Alert.alert("", "Enter Support message", [{ text: "OK" }], {
        cancelable: false,
      });
    }
  };

  const contactSupportheader = () => {
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
          <Text style={{ color: "black", fontSize: 20, fontWeight: "600" }}>
            {"Contact Support"}
          </Text>
        </View>
        <View
          style={{
            backgroundColor: isConnected ? "green" : "red",
            width: 15,
            height: 15,
            borderRadius: 7,
            marginRight: 5,
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
          {isConnected ? "Online" : "Offline"}
        </Text>
      </View>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLOR.VIEW_BG,
        justifyContent: "center",
      }}
    >
      {contactSupportheader()}
      <ScrollView>
        <View
          style={{ marginHorizontal: 20, justifyContent: "center", flex: 1 }}
        >
          <TextInput
            style={{
              backgroundColor: COLOR.WHITE,
              borderColor: "lightgray",
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
              borderTopRightRadius: 10,
              borderBottomRightRadius: 10,
              borderWidth: 1,
              paddingLeft: 10,
              padding: 15,
              height: 200,
              textAlignVertical: "top",
            }}
            placeholder="Enter Message"
            placeholderTextColor={"black"}
            value={message}
            maxLength={500}
            multiline
            onChangeText={(value) => {
              setMessage(value);
            }}
          ></TextInput>
          <View style={{ flex: 1, marginTop: 25 }}>
            <CustomButton
              text={"Submit"}
              onPress={sendMessagePressed}
              bgColor={COLOR.BLUE}
              btnLoading={supportMessageLoading}
            />
          </View>
        </View>
      </ScrollView>
      {isSyncLoading ? <SyncLoading isSyncLoading={isSyncLoading} /> : null}
    </View>
  );
};

export default ContactSupportScreen;

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
