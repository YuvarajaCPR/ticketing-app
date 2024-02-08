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
  TextInput,
  ActivityIndicator,
  RefreshControl,
  Platform,
  Dimensions,
} from "react-native";
import React, { useEffect, FC, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, store } from "../../Store";
import NetInfo from "@react-native-community/netinfo";
import { getScaleAxis } from "../../Utils/Utility";

import { useLazyGetTicketsQuery } from "../../Services/Module/CreateTicketService";
import {
  setCompanyTickets,
  setCompanyTicketsListForDisplay,
} from "../../Store/CreateTicketSlice";
import {
  setDashboardOfflineTicketCount,
  setLastSyncedDate,
} from "../../Store/DashboardSlice";
import { COLOR } from "../../Utils/Constants";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";
import DropDownPicker from "react-native-dropdown-picker";
import { BASE_URL, TICKETS, IMAGES, COMPANIES } from "../../Utils/URL";
import RNFS from "react-native-fs";
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { navigateAndSimpleReset } from "../../Navigators/utils";
import { decode } from "base64-arraybuffer";
import Utility from "../../Utils/Utility";
import SyncLoading from "../../Components/SyncLoading";

const TicketListScreen: FC = ({ route }) => {
  const [isSyncLoading, setIsSyncLoading] = useState(false);
  
  const dispatch = useDispatch();
  const navigation: any = useNavigation();
  // const isRefresh = route.params.isRefresh;
  const isFocused = useIsFocused();

  const windowHeight = Dimensions.get("window").height;
  const windowWidth = Dimensions.get("window").width;

  const [getAllTickets, {}] = useLazyGetTicketsQuery();

  const dashboardResponse = useSelector(
    (state: RootState) => state.dashboard.DashboardResponse
  );

  const ticketsListResponse = useSelector(
    (state: RootState) => state.createTicket.TicketListResponse
  );

  const truckTypeResponse = useSelector(
    (state: RootState) => state.createTicket.TruckTypeResponse
  );

  const customerResponse = useSelector(
    (state: RootState) => state.createTicket.CustomersResponse
  );

  const quantityResponse = useSelector(
    (state: RootState) => state.createTicket.QuantityTypeResponse
  );

  const productsResponse = useSelector(
    (state: RootState) => state.createTicket.ProductsResponse
  );

  const locationsResponse = useSelector(
    (state: RootState) => state.createTicket.LocationsResponse
  );

  const selectedCompany = useSelector(
    (state: RootState) => state.dashboard.selectedCompany
  );

  const userResponse = useSelector(
    (state: RootState) => state.dashboard.UserResponse
  );

  const accessTokenResponse = useSelector(
    (state: RootState) => state.auth.accessTokenResponse
  );

  const productsListDropdownArr = useSelector(
    (state: RootState) => state.createTicket.ProductsListDropdown
  );

  const [isDateTouched, setIsDateTouched] = useState(false);
  const [expandedItem, setExpandedItem] = useState<number | null>(null);
  const [materialDropdownOpen, setmaterialDropdownOpen] = useState(false);
  const [materialValue, setMaterialValue] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [listOfAllTickets, setListOfAllTickets] = useState<any>([]);
  const [searchListOfAllTickets, setSearchListOfAllTickets] = useState<any>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [searchValue, setSearchValue] = useState<string>("");

  const [selectDate, setSelectedDate] = useState("");

  const searchInputRef = useRef();

  // Component DidMount
  useEffect(() => {
    if (isConnected) {
      const fetchData = async () => {
        if (isConnected) {
          let offlineSync = await AsyncStorage.getItem("offlineSync");
          // console.log("offlineSync", offlineSync);

          if (offlineSync !== null && isFocused) {
            setIsSyncLoading(true);

            let offlineSyncArray: [
              { method: string; apiName: string; inputParams: any }
            ] = JSON.parse(offlineSync);

            // console.log("offlineSyncArray", offlineSyncArray);

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

                    // console.log(
                    //   "postTicketResponseArray",
                    //   postTicketResponseArray
                    // );

                    let arrApiName = element.apiName.split("/");
                    let offlineTicketId = arrApiName[arrApiName.length - 2];

                    // console.log("offlineTicketId", offlineTicketId);

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
                          // console.log("response 1==", response);

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
                              invokeTicketList();
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
                          // console.log("response 1==", response);

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
                              invokeTicketList();

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
                        // console.log("response 1==", response);

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
                            AsyncStorage.removeItem("postTicketImageResponse");
                            AsyncStorage.removeItem("postTicketResponse");
                            invokeTicketList();

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

                      // console.log(
                      //   "postTicketResponseArray",
                      //   postTicketResponseArray
                      // );

                      let arrApiName = element.apiName.split("/");
                      let offlineTicketId = arrApiName[arrApiName.length - 1];

                      // console.log("offlineTicketId", offlineTicketId);

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
                            // console.log(
                            //   "edit offline ticket response 2==",
                            //   response.data
                            // );
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
                                invokeTicketList();
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
                          // console.log(
                          //   "edit online ticket response 2==",
                          //   response.data
                          // );
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
                              invokeTicketList();
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

                        // console.log(
                        //   "postTicketResponseArray",
                        //   postTicketResponseArray
                        // );

                        let arrApiName = element.apiName.split("/");
                        let offlineTicketId = arrApiName[arrApiName.length - 2];

                        // console.log("offlineTicketId", offlineTicketId);

                        let filterpostTicketResArr =
                          postTicketResponseArray.filter((res) => {
                            return res.TicketNum == offlineTicketId;
                          });

                        let onlineTicketId = filterpostTicketResArr[0];

                        let apiName = element.apiName;
                        if (onlineTicketId) {
                          //Delete Ticket for a offline created ticket.
                          apiName = `${COMPANIES}/${onlineTicketId?.CompanyId}/${TICKETS}/${onlineTicketId?.Id}/delete`;
                          // console.log("apiName", apiName);
                          // console.log(
                          //   " element?.inputParams",
                          //   element?.inputParams
                          // );

                          await axios({
                            method: element?.method,
                            url: `${BASE_URL}/${apiName}`,
                            data: element?.inputParams,
                            headers: {
                              Authorization: `Bearer ${accessTokenResponse?.access_token}`,
                            },
                          })
                            .then(async (response) => {
                              // console.log(
                              //   "delete offline ticket response 2==",
                              //   response
                              // );
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
                                  invokeTicketList();
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
                            // console.log(
                            //   "delete online ticket response 2==",
                            //   response
                            // );
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
                                invokeTicketList();
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
                          } else if (
                            response.status == 200 ||
                            response.status == 204
                          ) {
                            if (
                              element?.method == "POST" &&
                              element.apiName != "support"
                            ) {
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
                              invokeTicketList();
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

                    // console.log(
                    //   "postTicketImageResponse",
                    //   postTicketResponseArray
                    // );

                    let arrApiName = element.apiName.split("/");
                    let offlineImageId = arrApiName[arrApiName.length - 1];
                    let offlineTicketId = arrApiName[arrApiName.length - 3];
                    let companyId = arrApiName[1];

                    // console.log("offlineTicketId", offlineTicketId);
                    // console.log("offlineImageId", offlineImageId);

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
                        // console.log("response 3==", response);

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
                            invokeTicketList();
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
                        // console.log("response 3==", response);

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
                            invokeTicketList();
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
          } else {
            invokeTicketList();
          }
        } else {
          formTicketForDisplayTextAndImages(ticketsListResponse);
        }
      };
      fetchData();
    } else {
      formTicketForDisplayTextAndImages(ticketsListResponse);
    }
  }, [isConnected, ticketsListResponse]);

  const invokeTicketList = async () => {
    const ticketsPayload = await getAllTickets({
      companyId: selectedCompany.Id,
    });
    if (!ticketsPayload?.error) {
      dispatch(setCompanyTickets(ticketsPayload?.data));
      formTicketForDisplayTextAndImages(ticketsPayload?.data);
    }
  };

  const formTicketForDisplayTextAndImages = (ticketsList: any[]) => {
    if (ticketsList) {
      let ticketsListArray = [];

      let filteredTicketsFromUser = ticketsList.filter((ticket) => {
        return ticket.UserId == userResponse.Id;
      });

      var sortedTicketsFromDate = filteredTicketsFromUser
        .sort((a, b) => {
          return new Date(a.Created).getTime() - new Date(b.Created).getTime();
        })
        .reverse();

      for (let index = 0; index < sortedTicketsFromDate.length; index++) {
        const element = sortedTicketsFromDate[index];
        downloadAndSaveImage(element?.Images, element?.Id);

        let filteredProductsFromTickets = productsResponse.filter((product) => {
          return product.Id == element.ProductId;
        });

        let filteredLocationFromTickets = locationsResponse.filter(
          (location) => {
            return location.Id == element.LocationId;
          }
        );

        let filteredUnitsFromTickets = quantityResponse.filter((quantity) => {
          return quantity.Id == element.UnitId;
        });

        let filteredTruckTypeFromTickets = truckTypeResponse.filter(
          (truckType) => {
            return truckType.Id == element.TruckTypeId;
          }
        );

        let filteredCustomerFromTickets = customerResponse.filter(
          (customer) => {
            return customer.Id == element.CustomerId;
          }
        );

        let productImage = "";
        if (filteredProductsFromTickets) {
          if (filteredProductsFromTickets[0]?.Name === "1” Minus Flex Base") {
            productImage = require("../../assets/imgCement.jpg");
          } else if (filteredProductsFromTickets[0]?.Name === "Concrete") {
            productImage = require("../../assets/imgConcrete.jpg");
          } else if (filteredProductsFromTickets[0]?.Name === "Cushion Sand") {
            productImage = require("../../assets/imgSand.jpg");
          } else if (filteredProductsFromTickets[0]?.Name === "Dirt") {
            productImage = require("../../assets/imgBrick.jpg");
          } else if (filteredProductsFromTickets[0]?.Name === "Dirt & Rock") {
            productImage = require("../../assets/imgBrick.jpg");
          } else if (filteredProductsFromTickets[0]?.Name === "Select Fill") {
            productImage = require("../../assets/imgSand.jpg");
          } else if (
            filteredProductsFromTickets[0]?.Name === "Top Soil (screened)"
          ) {
            productImage = require("../../assets/imgSand.jpg");
          } else if (
            filteredProductsFromTickets[0]?.Name === "Top Soil (unscreened)"
          ) {
            productImage = require("../../assets/imgSand.jpg");
          } else {
            productImage = require("../../assets/imgSand.jpg");
          }
        } else {
          productImage = require("../../assets/imgCement.jpg");
        }

        let ticketsObj = {};
        if (element?.images) {
          ticketsObj = {
            ...element,
            product: filteredProductsFromTickets[0],
            productImage: productImage,
            location: filteredLocationFromTickets[0],
            units: filteredUnitsFromTickets[0],
            truckTypes: filteredTruckTypeFromTickets[0],
            user: userResponse,
            customer: filteredCustomerFromTickets[0],
            Quantity: element?.Quantities.length
              ? element?.Quantities.toString()
              : "",
          };
        } else {
          ticketsObj = {
            ...element,
            product: filteredProductsFromTickets[0],
            productImage: productImage,
            location: filteredLocationFromTickets[0],
            units: filteredUnitsFromTickets[0],
            truckTypes: filteredTruckTypeFromTickets[0],
            customer: filteredCustomerFromTickets[0],
            user: userResponse,
            images: element.images ? element.images : [],
            Quantity: element?.Quantities.length
              ? element?.Quantities.toString()
              : "",
          };
        }
        ticketsListArray.push(ticketsObj);
      }

      // var sortedTicketsFromCreatedDate = ticketsListArray
      //   .sort((a, b) => {
      //     return new Date(a.Created).getTime() - new Date(b.Created).getTime();
      //   })
      //   .reverse();

      // console.log(
      //   "sortedTicketsFromCreatedDate ==",
      //   sortedTicketsFromCreatedDate
      // );

      setListOfAllTickets(ticketsListArray);
      setSearchListOfAllTickets(ticketsListArray);
      dispatch(setCompanyTicketsListForDisplay(ticketsListArray));
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  };

  const downloadAndSaveImage = async (
    imagesArray: string | any[],
    ticketId: any
  ) => {
    // Replace with your actual image URL and authorization token
    let imageArray: any[] = [];

    if (imagesArray.length > 0) {
      for (let index = 0; index < imagesArray.length; index++) {
        const imageObj = imagesArray[index];
        const imageUrl = `${BASE_URL}/${TICKETS}/${ticketId}/images/${imageObj?.Id}`;

        const authToken = accessTokenResponse?.access_token;

        RNFS.unlink(
          RNFS.DocumentDirectoryPath + `/${ticketId}${imageObj?.Id}.jpg`
        )
          .then(async (res) => {
            // console.log("res ==", res);
          })
          .catch((error) => {});

        try {
          const response = await RNFS.downloadFile({
            fromUrl: imageUrl,
            toFile:
              RNFS.DocumentDirectoryPath + `/${ticketId}${imageObj?.Id}.jpg`,
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          });

          // Use a promise to get the result and check the HTTP status code
          const result = await response.promise;

          if (result.statusCode === 200) {
            // console.log(
            //   "file result",
            //   "file://" +
            //     RNFS.DocumentDirectoryPath +
            //     "/" +
            //     `${ticketId}${imageObj?.Id}.jpg`
            // );

            let filePath = `file://${RNFS.DocumentDirectoryPath}/${ticketId}${imageObj?.Id}.jpg`;
            imageArray.push(filePath);
          } else {
            console.error(`Image download failed for ${result.statusCode}`);
          }
        } catch (error) {
          console.error(`Error downloading image from ${imageUrl}`, error);
        }
      }

      return imageArray;
    }
  };

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

  const onPullRefresh = async (onEndReached = false) => {
    setSearchValue("");
    setMaterialValue("");
    setSelectedDate("");

    // setIsLoading(true);
    if (isConnected) {
      const ticketsPayload = await getAllTickets({
        companyId: selectedCompany.Id,
      });
      if (!ticketsPayload?.error) {
        dispatch(setCompanyTickets(ticketsPayload?.data));
        formTicketForDisplayTextAndImages(ticketsPayload?.data);
      }
    } else {
      formTicketForDisplayTextAndImages(ticketsListResponse);
    }
  };

  const toggleItem = (index: number) => {
    if (expandedItem === index) {
      setExpandedItem(null);
    } else {
      setExpandedItem(index);
    }
  };

  const filterFromAllTicket = (search?: any, date?: any) => {
    let allTicketFilter;
    let searchfilter: any = search ?? searchValue;
    let datefilter: any = date ?? selectDate;

    if (searchfilter !== "" || datefilter !== "" || materialValue !== "") {
      if (searchfilter !== "") {
        const filtered = listOfAllTickets.filter(
          (item) =>
            item.location.SiteName.toLowerCase().includes(
              searchfilter.toLowerCase()
            ) ||
            item.product.Name.toLowerCase().includes(
              searchfilter.toLowerCase()
            ) ||
            item.customer.Name.toLowerCase().includes(
              searchfilter.toLowerCase()
            ) ||
            item?.Id.toString().includes(searchfilter)
        );
        allTicketFilter = filtered;
      } else {
        allTicketFilter = listOfAllTickets;
      }
      if (datefilter !== "") {
        let choosenDateFromPicker = moment(datefilter).format("YYYY-MM-DD");
        let filteredTicketsFromDate = allTicketFilter.filter(
          (loc: { Created: moment.MomentInput }) => {
            return (
              moment(loc.Created).format("YYYY-MM-DD") == choosenDateFromPicker
            );
          }
        );
        allTicketFilter = filteredTicketsFromDate;
      }
      if (materialValue !== "") {
        let filteredMaterials = allTicketFilter.filter(
          (loc: { ProductId: any }) => {
            return loc.ProductId == materialValue;
          }
        );
        allTicketFilter = filteredMaterials;
      }
    } else {
      allTicketFilter = listOfAllTickets;
    }

    setSearchListOfAllTickets(allTicketFilter);
  };

  const handleSearch = (text: string) => {
    setIsDateTouched(false);

    if (text !== "") {
      setSearchValue(text);
      filterFromAllTicket(text);
    } else {
      filterFromAllTicket("");
    }
    setSearchValue(text);
  };

  const onOpenMaterialPicker = () => {
    setIsDateTouched(false);

    handleBlur();

    if (materialDropdownOpen) {
      setmaterialDropdownOpen(false);
    } else {
      setmaterialDropdownOpen(true);
    }
  };

  const materialValChanged = (materialId: string | null) => {
    filterFromAllTicket();
  };

  const onChange = (event: Event, selectedDate?: Date) => {
    const currentDate = selectedDate || selectDate;
    setIsDateTouched(false); // On iOS, always show the date picker
    setSelectedDate(currentDate);

    filterFromAllTicket(undefined, currentDate);
  };

  const setDateTouched = () => {
    setmaterialDropdownOpen(false);

    if (isDateTouched) {
      setIsDateTouched(false);
    } else {
      setIsDateTouched(true);
    }
    handleBlur();
  };

  const handleBlur = () => {
    if (searchInputRef.current) {
      searchInputRef.current.blur();
    }
  };

  const handleClearText = () => {
    setSearchValue("");
    filterFromAllTicket("");
  };

  const ticketheader = () => {
    return (
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={{ color: "black", fontSize: 20, fontWeight: "600" }}>
            {"Tickets"}
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
        marginHorizontal: 10,
        flexDirection: "column",
      }}
    >
      {ticketheader()}
      <>
        {(searchValue !== "" || selectDate !== "" || materialValue !== "") && (
          <TouchableOpacity
            onPress={() => {
              setSearchListOfAllTickets(listOfAllTickets);
              setSearchValue("");
              setSelectedDate("");
              setMaterialValue("");
            }}
          >
            <View
              style={{
                borderRadius: 20,
                borderWidth: 1,
                borderColor: "black",
                alignSelf: "flex-end",
                marginHorizontal: 10,
              }}
            >
              <Text style={{ paddingVertical: 2, paddingHorizontal: 10 }}>
                Clear
              </Text>
            </View>
          </TouchableOpacity>
        )}

        <View style={styles.serachBox}>
          <Image
            source={require("../../assets/imgSearch.png")}
            style={{ alignSelf: "center", width: 20, height: 20 }}
          />
          <TextInput
            ref={searchInputRef}
            placeholder="Search ..."
            onChangeText={handleSearch}
            returnKeyType="search"
            value={searchValue}
            onSubmitEditing={() => {
              handleSearch;
            }}
            style={{
              width: "90%",
              paddingLeft: 10,
              backgroundColor: "white",
            }}
          />
          {searchValue !== "" && (
            <TouchableOpacity
              onPress={handleClearText}
              style={{ width: 20, height: 20, marginTop: 15 }}
            >
              <Image
                source={require("../../assets/imgClearText.png")} // Replace with your image path
                style={{
                  width: 15,
                  height: 15,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              />
            </TouchableOpacity>
          )}
        </View>
        <View
          style={{ flexDirection: "row", marginHorizontal: 10, height: 50 }}
        >
          <TouchableOpacity
            style={{
              flexDirection: "row",
              borderRadius: 10,
              borderColor: "lightgray",
              borderWidth: 1,
              backgroundColor: "white",
              flex: 1,
              alignItems: "center",
            }}
            onPress={() => setDateTouched()}
          >
            <Text style={{ flex: 1, marginLeft: 5 }}>
              {selectDate !== "" ? selectDate.toDateString() : "Date"}
            </Text>
            <Image
              source={require("../../assets/imgDownArrow.png")}
              style={{
                alignItems: "center",
                marginRight: 10,
                width: 18,
                height: 18,
              }}
            />
          </TouchableOpacity>

          <View style={{ flex: 1, marginLeft: 10 }}>
            <DropDownPicker
              style={{
                borderColor: "lightgray",
                height: 50,
                flex: 1,
              }}
              placeholder="Material"
              placeholderStyle={{
                color: "black",
                fontWeight: "400",
              }}
              schema={{
                label: "Name",
                value: "Id",
              }}
              dropDownContainerStyle={{
                borderColor: "lightgray",
                zIndex: -1,
              }}
              textStyle={{ lineHeight: 20 }}
              items={productsListDropdownArr ? productsListDropdownArr : []}
              open={materialDropdownOpen}
              multiple={false}
              setOpen={onOpenMaterialPicker}
              value={materialValue}
              setValue={setMaterialValue}
              onChangeValue={(value) => {
                console.log("value", value);
                materialValChanged(value);
              }}
            />
          </View>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            marginHorizontal: 10,
            marginVertical: 10,
            zIndex: -5,
          }}
        >
          <FlatList
            data={searchListOfAllTickets}
            keyExtractor={(item) => item.Id}
            refreshControl={
              <RefreshControl
                refreshing={isLoading}
                onRefresh={onPullRefresh}
              />
            }
            ListEmptyComponent={
              <View
                style={{
                  flexDirection: "column",
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: windowHeight / 2 - 150,
                }}
              >
                <Text
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    color: "black",
                    flex: 1,
                  }}
                >
                  No Tickets Found
                </Text>
              </View>
            }
            renderItem={({ item, index }) => (
              <View>
                {expandedItem === index ? (
                  <View
                    style={{
                      flexDirection: "column",
                      borderRadius: 10,
                      marginTop: 10,
                      borderWidth: 0.5,
                      borderColor: COLOR.BLUE,
                      backgroundColor: "white",
                      height: 230,
                      flex: 1,
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        height: 50,
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                      onPress={() => toggleItem(index)}
                    >
                      <Image
                        style={{ height: 50, borderTopLeftRadius:10, borderTopRightRadius:10, width: "100%" }}
                        source={item?.productImage}
                      />

                      <View
                        style={{
                          position: "absolute",
                          flexDirection: "row",
                          flex: 1,
                          alignItems: "center",
                          width: "95%",
                        }}
                      >
                        <Text
                          style={{
                            marginLeft: 10,
                            fontSize: 16,
                            color: "white",
                            fontWeight: "500",
                            width: "50%",
                          }}
                          numberOfLines={1}
                        >
                          {item?.product?.Name}
                        </Text>
                        <View
                          style={{
                            marginLeft: 10,
                            backgroundColor: COLOR.WHITE,
                            width: 10,
                            height: 10,
                            borderRadius: 5,
                            alignItems: "center",
                          }}
                        ></View>
                        <Text
                          style={{
                            marginLeft: 5,
                            fontSize: 15,
                            color: "white",
                            fontWeight: "500",
                            alignItems: "center",
                          }}
                        >
                          {item?.Quantities.length}{" "}
                          {/* {item.location?.MaxTrailers} */}
                          {/* {item?.Quantity} */}
                        </Text>

                        <Text
                          style={{
                            marginLeft: 5,
                            fontSize: 15,
                            color: "white",
                            fontWeight: "500",
                            flex: 1,
                            justifyContent: "flex-end",
                          }}
                        >
                          Trailers {/* {item?.units?.Name} */}
                        </Text>
                        <View style={{}}>
                          <TouchableOpacity
                            style={{ alignItems: "flex-end" }}
                            onPress={() => toggleItem(index)}
                          >
                            <Image
                              style={{ width: 20, height: 20 }}
                              source={require("../../assets/imgClose.png")}
                            ></Image>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </TouchableOpacity>

                    <View
                      style={{
                        flexDirection: "row",
                        marginHorizontal: 10,
                        alignItems: "center",
                        marginVertical: 7,
                      }}
                    >
                      <Image
                        style={{ width: 40, height: 40, borderRadius: 20 }}
                        source={require("../../assets/placeholder.png")}
                      />
                      <Text
                        style={{
                          marginLeft: 5,
                          fontSize: 15,
                          color: "black",
                        }}
                      >
                        {item?.user?.FirstName} {item?.user?.Surname}
                      </Text>
                    </View>
                    <View
                      style={{
                        backgroundColor: "lightgray",
                        height: 1,
                        marginHorizontal: 10,
                      }}
                    ></View>
                    <View
                      style={{
                        flexDirection: "row",
                        marginTop: 10,
                        marginHorizontal: 10,
                        alignItems: "center",
                      }}
                    >
                      <Image
                        style={{ width: 20, height: 20 }}
                        source={require("../../assets/imgCalendar.png")}
                      />
                      <Text
                        style={{
                          marginLeft: 5,
                          fontSize: 13,
                          color: "black",
                          flex: 1,
                          alignItems: "flex-end",
                        }}
                      >
                        {moment(item?.Created).format("MM/DD/YY - hh:mm A")}
                      </Text>
                      <Image
                        style={{ width: 20, height: 20 }}
                        source={require("../../assets/imgTicketNo.png")}
                      />

                      <Text
                        style={{
                          marginLeft: 5,
                          fontSize: 13,
                          color: "black",
                        }}
                      >
                        #{item.Id}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        marginTop: 10,
                        marginHorizontal: 10,
                        alignItems: "center",
                      }}
                    >
                      <Image
                        style={{ width: 20, height: 20 }}
                        source={require("../../assets/imgExpandPin.png")}
                      />
                      <Text
                        style={{
                          marginLeft: 5,
                          fontSize: 13,
                          color: "black",
                          flex: 1,
                          alignItems: "flex-end",
                        }}
                      >
                        {item?.location?.SiteName}
                      </Text>
                      <Image
                        style={{ width: 20, height: 20 }}
                        source={require("../../assets/imgTruck.png")}
                      />
                      <Text
                        style={{
                          fontSize: 13,
                          color: "black",
                          textAlign: "right",
                          marginLeft: 5,
                        }}
                      >
                        {item?.TruckNum}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={{
                        flexDirection: "row",
                        borderRadius: 10,
                        marginTop: 10,
                        padding: 10,
                        borderWidth: 0.5,
                        borderColor: "lightgray",
                        backgroundColor: COLOR.BLUE,
                        alignItems: "center",
                        justifyContent: "center",
                        marginHorizontal: 10,
                      }}
                      onPress={() =>
                        // navigation.navigate("Discovery")
                        navigation.navigate("ViewTicketDetailScreen", {
                          ticket: item,
                          ticketIndex: index,
                        })
                      }
                    >
                      <Text
                        style={{
                          color: "white",
                          fontSize: 15,
                          fontWeight: "600",
                          textAlign: "center",
                        }}
                      >
                        VIEW DETAIL
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      borderRadius: 20,
                      marginTop: 10,
                      padding: 10,
                      borderWidth: 0.5,
                      borderColor: "lightgray",
                      backgroundColor: "white",
                      alignItems: "center",
                      height: 70,
                    }}
                    onPress={() => toggleItem(index)}
                  >
                    <Image
                      style={{ width: 40, height: 40, borderRadius: 20 }}
                      source={item?.productImage}
                    />
                    <View
                      style={{
                        flexDirection: "column",
                        flex: 1,
                        marginLeft: 10,
                      }}
                    >
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <Image
                          style={{ width: 20, height: 20 }}
                          source={require("../../assets/imgTicketNo.png")}
                        />

                        <Text
                          style={{
                            marginLeft: 5,
                            fontSize: 15,
                            fontWeight: "500",
                            color: "black",
                          }}
                        >
                          #{item.Id}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginTop: 10,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 12,
                            color: "black",
                            width: "45%",
                          }}
                          numberOfLines={1}
                        >
                          {item?.product?.Name}
                        </Text>

                        <View
                          style={{
                            marginLeft: 5,
                            backgroundColor: COLOR.BLUE,
                            width: 5,
                            height: 5,
                            borderRadius: 2.5,
                          }}
                        ></View>

                        <Text
                          style={{
                            marginLeft: 5,
                            fontSize: 12,
                            color: "black",
                          }}
                        >
                          {item?.Quantities.length}
                          {/* {item?.location.MaxTrailers}  {item?.Quantity} */}
                        </Text>

                        <Text
                          style={{
                            fontSize: 12,
                            color: "black",
                            marginLeft: 5,
                          }}
                        >
                          {item?.Quantities.length == 1
                            ? "Trailer"
                            : "Trailers"}{" "}
                          {/* {item?.units?.Name} */}
                        </Text>
                        <Image
                          style={{ width: 20, height: 20, marginLeft: 10 }}
                          source={require("../../assets/imgTruck.png")}
                        />
                        <Text
                          style={{
                            marginHorizontal: 5,
                            fontSize: 11,
                            color: "black",
                          }}
                        >
                          {item?.TruckNum}
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      style={{
                        alignItems: "flex-end",
                        width: 30,
                        height: 30,
                      }}
                      onPress={() =>
                        navigation.navigate("ViewTicketDetailScreen", {
                          ticket: item,
                          ticketIndex: index,
                        })
                      }
                    >
                      <Image
                        style={{ width: 20, height: 20 }}
                        source={require("../../assets/imgDetailView.png")}
                      />
                    </TouchableOpacity>
                  </TouchableOpacity>
                )}
              </View>
            )}
          />
        </View>
      </>
      {isDateTouched ? (
        <DateTimePicker
          maximumDate={new Date()}
          mode={"date"}
          onChange={onChange}
          value={selectDate !== "" ? selectDate : new Date()}
          display={"spinner"}
          positiveButton={{ label: "OK", textColor: "green" }}
        ></DateTimePicker>
      ) : null}
      <TouchableOpacity
        style={{
          width: 60,
          height: 60,
          borderRadius: 30,
          position: "absolute",
          bottom: 30,
          right: 10,
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={() =>
          navigation.navigate("CreateTicketScreen", { isEdit: false })
        }
      >
        <Image
          style={{ alignItems: "center", justifyContent: "center" }}
          source={require("../../assets/imgCreate.png")}
        />
      </TouchableOpacity>
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
          animating={isLoading}
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
    marginLeft: 20,
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
});

export default TicketListScreen;
