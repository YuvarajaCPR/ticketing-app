/*************************************************
 * AggMaps
 * @exports
 * DashboardScreen.tsx
 * Created by Subashree on 03/10/2023
 * Copyright © 2023 AggMaps. All rights reserved.
 *************************************************/

// imports
import {
  View,
  ScrollView,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  Dimensions,
} from "react-native";
import React, { useEffect, FC, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, store } from "../../Store";
import {
  useLazyGetUserDetailsQuery,
  useLazyGetDashboardQuery,
} from "../../Services/Module/DashboardService";
import DashboardHeader from "../../Components/DashboardHeader";
import { COLOR } from "../../Utils/Constants";
import UserNameIcon from "../../Components/UserNameIcon";
import NetInfo, { fetch } from "@react-native-community/netinfo";
import { updateDashboard } from "../../Store/DashboardSlice";
import moment from "moment";
import { getScaleAxis } from "../../Utils/Utility";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import {
  useLazyGetLocationsQuery,
  useLazyGetCustomersQuery,
  useLazyGetProductsQuery,
  useLazyGetQuantityTypesQuery,
  useLazyGetTruckTypesQuery,
  useLazyGetProjectsQuery,
  useLazyGetTicketsQuery,
} from "../../Services/Module/CreateTicketService";
import {
  setCompanyCustomers,
  setCompanyLocations,
  setCompanyProducts,
  setCompanyProjects,
  setCompanyTickets,
  setCustomers,
  setLocations,
  setProducts,
  setProjects,
  setTickets,
  setProductsListDropDown,
} from "../../Store/CreateTicketSlice";
import {
  setSelectedCompanyFromdashboard,
  setDashboardOfflineTicketCount,
  setLastSyncedDate,
} from "../../Store/DashboardSlice";
import { TICKETS, BASE_URL, COMPANIES, IMAGES } from "../../Utils/URL";
import RNFS, { stat } from "react-native-fs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { navigateAndSimpleReset } from "../../Navigators/utils";
import { decode } from "base64-arraybuffer";
import Utility from "../../Utils/Utility";
import SyncLoading from "../../Components/SyncLoading";

const DashboardScreen: FC = () => {
  const dispatch = useDispatch();
  const navigation: any = useNavigation();
  const isFocused = useIsFocused();

  const windowHeight = Dimensions.get("window").height;
  const windowWidth = Dimensions.get("window").width;

  const [isConnected, setIsConnected] = useState(true);
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [allLocationSelected, setAllLocationSelected] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncLoading, setIsSyncLoading] = useState(false);
  const [expandedItem, setExpandedItem] = useState<number | null>(null);
  const [searchValue, setSearchValue] = useState<string>("");
  const [isLandscape, setIsLandscape] = useState<boolean>(
    Dimensions.get("window").width > Dimensions.get("window").height
  );
  const [open, setOpen] = useState(false);
  const [offlineTicketCount, setOfflineTicketCount] = useState(0);

  const dashboardResponse = useSelector(
    (state: RootState) => state.dashboard.DashboardResponse
  );

  const dashboardCustomerResponse = useSelector(
    (state: RootState) => state.dashboard.DashboardCustomerResponse
  );

  const userResponse = useSelector(
    (state: RootState) => state.dashboard.UserResponse
  );

  const locationsResponse = useSelector(
    (state: RootState) => state.createTicket.LocationsResponse
  );

  const masterLocationsResponse = useSelector(
    (state: RootState) => state.createTicket.MasterLocationsResponse
  );

  const customerListResponse = useSelector(
    (state: RootState) => state.createTicket.CustomersResponse
  );

  const masterCustomerListResponse = useSelector(
    (state: RootState) => state.createTicket.MasterCustomersResponse
  );

  const productsResponse = useSelector(
    (state: RootState) => state.createTicket.ProductsResponse
  );

  const masterProductsResponse = useSelector(
    (state: RootState) => state.createTicket.MasterProductsResponse
  );

  const quantityResponse = useSelector(
    (state: RootState) => state.createTicket.QuantityTypeResponse
  );

  const truckTypeResponse = useSelector(
    (state: RootState) => state.createTicket.TruckTypeResponse
  );

  const projectsResponse = useSelector(
    (state: RootState) => state.createTicket.ProjectResponse
  );

  const masterProjectsResponse = useSelector(
    (state: RootState) => state.createTicket.MasterProjectResponse
  );

  const masterTicketListResponse = useSelector(
    (state: RootState) => state.createTicket.MasterTicketListResponse
  );

  const ticketListResponse = useSelector(
    (state: RootState) => state.createTicket.TicketListResponse
  );

  const accessTokenResponse = useSelector(
    (state: RootState) => state.auth.accessTokenResponse
  );

  const offlineDashboardTicketCount = useSelector(
    (state: RootState) => state.dashboard.offlineTicketCount
  );

  const lastSyncedDate = useSelector(
    (state: RootState) => state.dashboard.lastSyncedDate
  );

  const selectedCompany = useSelector(
    (state: RootState) => state.dashboard.selectedCompany
  );

  let arrLocations: any[] = [];
  let arrCustomers: any[] = [];
  let arrProducts: any[] = [];
  let arrProjects: any[] = [];
  let arrTickets: any[] = [];

  const [getUserDetails, {}] = useLazyGetUserDetailsQuery();
  const [
    getDashboardDetails,
    {
      data: companyDashboardResponse,
      isSuccess: successAllTickets,
      isError: errorAllTickets,
    },
  ] = useLazyGetDashboardQuery();
  const [
    getLocations,
    {
      data: locationsList,
      isSuccess: successLocations,
      isError: errorLocations,
    },
  ] = useLazyGetLocationsQuery();
  const [
    getCustomers,
    {
      data: customerList,
      isSuccess: successCustomers,
      isError: errorCustomers,
    },
  ] = useLazyGetCustomersQuery();

  const [
    getProducts,
    { data: productsList, isSuccess: successProducts, isError: errorProducts },
  ] = useLazyGetProductsQuery();

  const [getQuantityTypes, {}] = useLazyGetQuantityTypesQuery();
  const [getTruckTypes, {}] = useLazyGetTruckTypesQuery();

  const [
    getProjects,
    { data: projectsList, isSuccess: successProjects, isError: errorProjects },
  ] = useLazyGetProjectsQuery();
  const [
    getAllTickets,
    { data: ticketsList, isSuccess: successTickets, isError: errorTickets },
  ] = useLazyGetTicketsQuery();

  let companiesArray: any[] = [];

  const [itemsSearch, setItemsSearch] = useState([]);

  // Component DidMount
  useEffect(() => {
    checkNetworkConnection();
  }, [isConnected]);

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
    console.log("isConnected useeffect", isConnected);

    const fetchData = async () => {
      fetch().then(async (state) => {
        if (state.isConnected) {
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
                              invokeMasterData();
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
                              invokeMasterData();
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
                            AsyncStorage.removeItem("postTicketImageResponse");
                            AsyncStorage.removeItem("postTicketResponse");

                            dispatch(setDashboardOfflineTicketCount(0));
                            dispatch(
                              setLastSyncedDate(
                                moment().format("MM/DD/YY - hh:mm A")
                              )
                            );
                            invokeMasterData();
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
                                invokeMasterData();
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
                              invokeMasterData();
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
                                  invokeMasterData();
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
                                invokeMasterData();
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
                              invokeMasterData();
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
                            invokeMasterData();
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
                            invokeMasterData();
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
            invokeMasterData();
          }
        } else {
          if (!selectedCompany) {
            setLocationModalVisible(true);
            updateCompanies();
          }
          setItemsSearch(dashboardResponse);
        }
      });
    };

    fetchData();
  }, [companyDashboardResponse, isConnected]);

  // Component DidMount
  useEffect(() => {
    updateCompanies();
  }, [customerListResponse]);

  const updateTicketsFromResponse = (
    ticketListArray: any[],
    productsArray: any[] | undefined
  ) => {
    let materialArr: {
      Id: any;
      Name: any;
      ProductCode: any;
      Size: any;
      Description: any;
      Taxable: any;
      Certified: any;
      DotApproved: any;
      CategoryId: any;
      LocationId: any;
      UnitId: any;
    }[] = [];

    if (ticketListArray) {
      let filteredTicketsFromUser = ticketListArray.filter((ticket) => {
        return ticket.UserId == userResponse.Id;
      });

      for (let index = 0; index < filteredTicketsFromUser.length; index++) {
        const element = filteredTicketsFromUser[index];

        let filteredProductsFromTickets = productsArray.filter((product) => {
          return product.Id == element.ProductId;
        });

        if (materialArr.length) {
          if (
            !materialArr.some(
              (el) => el.Id === filteredProductsFromTickets[0].Id
            )
          ) {
            materialArr.push(filteredProductsFromTickets[0]);
          }
        } else {
          materialArr.push(filteredProductsFromTickets[0]);
        }
      }
      dispatch(setProductsListDropDown(materialArr));
    }
  };

  const invokeMasterData = async () => {
    fetch().then(async (state) => {
      console.log("invokeMasterData", state.isConnected);

      if (state.isConnected && accessTokenResponse?.access_token) {
        setIsLoading(true);

        getUserDetails({});
        getDashboardDetails({}).finally(async () => {
          if (companyDashboardResponse?.length) {
            for (
              let index = 0;
              index < companyDashboardResponse.length;
              index++
            ) {
              const element = companyDashboardResponse[index];
              const LocationsPayload = await getLocations({
                id: element.Id,
              });

              if (!LocationsPayload?.error) {
                arrLocations = arrLocations.concat(LocationsPayload?.data);
              }
              const customersPayload = await getCustomers({
                id: element.Id,
              });

              if (!customersPayload?.error) {
                arrCustomers = arrCustomers.concat(customersPayload?.data);
              }

              const productsPayload = await getProducts({ id: element.Id });
              if (!productsPayload?.error) {
                arrProducts = arrProducts.concat(productsPayload?.data);
              }
              const projectsPayload = await getProjects({ id: element.Id });
              if (!projectsPayload?.error) {
                arrProjects = arrProjects.concat(projectsPayload?.data);
              }
              const ticketsPayload = await getAllTickets({
                companyId: element.Id,
              });
              if (!ticketsPayload?.error) {
                arrTickets = arrTickets.concat(ticketsPayload?.data);
              }
            }

            getQuantityTypes({});
            getTruckTypes({});

            dispatch(setLocations(arrLocations));
            dispatch(setCustomers(arrCustomers));
            dispatch(setProducts(arrProducts));
            dispatch(setProjects(arrProjects));
            dispatch(setTickets(arrTickets));

            setIsLoading(false);

            if (companyDashboardResponse?.length > 1) {
              console.log("selectedCompany", selectedCompany);
              setItemsSearch(companyDashboardResponse);
              if (Object.keys(selectedCompany).length === 0) {
                setLocationModalVisible(true);
              }
            } else {
              dispatch(
                setSelectedCompanyFromdashboard(companyDashboardResponse)
              );
              dispatch(setCompanyLocations(masterLocationsResponse));
              dispatch(setCompanyCustomers(masterCustomerListResponse));
              dispatch(setCompanyProducts(masterProductsResponse));
              dispatch(setCompanyProjects(masterProjectsResponse));
              dispatch(setCompanyTickets(masterTicketListResponse));
            }
          }
        });
      } else {
        console.log("selectedCompany", selectedCompany);

        if (Object.keys(selectedCompany).length === 0) {
          setItemsSearch(dashboardResponse);
          setLocationModalVisible(true);
          updateCompanies();
        }
      }
    });
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
          .then((res) => {
            console.log("res ==", res);
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
            imageArray.push(
              `file://${RNFS.DocumentDirectoryPath}/${ticketId}${imageObj?.Id}.jpg`
            );
          } else {
            console.error(`Image download failed for ${imageUrl}`);
          }
        } catch (error) {
          console.error(`Error downloading image from ${imageUrl}:`, error);
        }
      }

      return imageArray;
    }
  };

  /**
   * Check Network Connection - Definition - it does check the network connectivity status and updates accordingly.
   */
  const checkNetworkConnection = () => {
    NetInfo.addEventListener((state) => {
      console.log("Is Internet connected?", state.isConnected);
      setIsConnected(state.isConnected);
    });
  };

  const toggleItem = (index: number) => {
    if (expandedItem === index) {
      setExpandedItem(null);
    } else {
      setExpandedItem(index);
    }
  };

  const updateCompanies = async () => {
    let totalCount = 0;
    let othersCount = 0;
    for (let index = 0; index < customerListResponse.length; index++) {
      const element = customerListResponse[index];
      let ticketObj = {};
      totalCount += element.DayTicketCount;

      if (index <= 4) {
        ticketObj = {
          ...element,
          Raised: element.MaxTicketNum > element.DayTicketCount ? false : true,
        };
        companiesArray.push(ticketObj);
      } else {
        othersCount += element.DayTicketCount;
      }
    }
    let OthersArray = [
      {
        Name: "Others",
        DayTicketCount: othersCount,
        Phone: null,
        PhoneIso: null,
        Email: null,
        MaxTicketNum: null,
        Permissions: [],
      },
      {
        Name: "Total",
        DayTicketCount: isNaN(totalCount) ? 0 : totalCount,
        Phone: null,
        PhoneIso: null,
        Email: null,
        MaxTicketNum: null,
        Permissions: [],
      },
    ];

    companiesArray = companiesArray.concat(OthersArray);
    dispatch(updateDashboard(companiesArray));

    try {
      let createTicketInput = await AsyncStorage.getItem("createTicket");
      let createTicketArray: [] = JSON.parse(createTicketInput);
      if (createTicketArray) {
        setOfflineTicketCount(createTicketArray.length);
      } else {
        setOfflineTicketCount(0);
      }
    } catch (err) {
      console.log("Error occured when fetching books");
      setOfflineTicketCount(0);
      setIsLoading(false);
    }
  };

  const openModal = () => {
    setLocationModalVisible(true);
    setAllLocationSelected(true);
    setSearchValue("");
  };

  const closeModal = () => {
    setLocationModalVisible(false);
  };

  const onPullRefresh = async (onEndReached = false) => {
    fetch().then(async (state) => {
      if (state.isConnected) {
        setIsLoading(true);

        getUserDetails({});
        const locationsPayload = await getLocations({ id: selectedCompany.Id });
        const customersPayload = await getCustomers({ id: selectedCompany.Id });
        const productssPayload = await getProducts({ id: selectedCompany.Id });
        const projectsPayload = await getProjects({ id: selectedCompany.Id });
        const ticketsPayload = await getAllTickets({
          companyId: selectedCompany.Id,
        });
        if (!locationsPayload?.error) {
          dispatch(setCompanyLocations(locationsPayload?.data));
        }

        if (!customersPayload?.error) {
          dispatch(setCompanyCustomers(customersPayload?.data));
        }

        if (!productssPayload?.error) {
          dispatch(setCompanyProducts(productssPayload?.data));
        }

        if (!projectsPayload?.error) {
          dispatch(setCompanyProjects(projectsPayload?.data));
        }

        if (!ticketsPayload?.error) {
          dispatch(setCompanyTickets(ticketsPayload?.data));
        }

        setIsLoading(false);
      } else {
        let filteredLocationFromCompany = masterLocationsResponse.filter(
          (location) => {
            return location.CompanyId == company.Id;
          }
        );

        let filteredCustomersFromCompany = masterCustomerListResponse.filter(
          (customer) => {
            return customer.CompanyId == company.Id;
          }
        );

        let filteredProjectsFromCompany = masterProjectsResponse.filter(
          (project) => {
            return project.CompanyId == company.Id;
          }
        );

        let filteredTicketsFromCompany = masterTicketListResponse.filter(
          (ticket) => {
            return ticket.CompanyId == company.Id;
          }
        );

        dispatch(setCompanyLocations(filteredLocationFromCompany));
        dispatch(setCompanyCustomers(filteredCustomersFromCompany));
        dispatch(setCompanyProjects(filteredProjectsFromCompany));
        dispatch(setCompanyTickets(filteredTicketsFromCompany));
        dispatch(setCompanyProducts(masterProductsResponse));
      }
    });
  };

  const onSearchCompanies = (search: string = "") => {
    setSearchValue(search);
    const filtered = companyDashboardResponse.filter((item) =>
      item.Name.toLowerCase().includes(search.toLowerCase())
    );
    setItemsSearch(filtered);
  };

  const handleSearch = (text: string) => {
    if (text !== "") {
      onSearchCompanies(text);
    } else {
      setItemsSearch(companyDashboardResponse);
    }
    setSearchValue(text);
  };

  const onCompanySelected = async (company) => {
    setLocationModalVisible(false);
    dispatch(setSelectedCompanyFromdashboard(company));

    fetch().then(async (state) => {
      if (state.isConnected) {
        setIsLoading(true);

        const locationsPayload = await getLocations({ id: company.Id });
        const customersPayload = await getCustomers({ id: company.Id });
        const productssPayload = await getProducts({ id: company.Id });
        const projectsPayload = await getProjects({ id: company.Id });
        const ticketsPayload = await getAllTickets({ companyId: company.Id });

        if (!locationsPayload?.error) {
          dispatch(setCompanyLocations(locationsPayload?.data));
        } else {
          dispatch(setCompanyLocations([]));
        }

        if (!customersPayload?.error) {
          dispatch(setCompanyCustomers(customersPayload?.data));
        } else {
          dispatch(setCompanyCustomers([]));
        }

        if (!productssPayload?.error) {
          dispatch(setCompanyProducts(productssPayload?.data));
        } else {
          dispatch(setCompanyProducts([]));
        }

        if (!projectsPayload?.error) {
          dispatch(setCompanyProjects(projectsPayload?.data));
        } else {
          dispatch(setCompanyProjects([]));
        }

        if (!ticketsPayload?.error) {
          dispatch(setCompanyTickets(ticketsPayload?.data));
        } else {
          dispatch(setCompanyTickets([]));
        }

        updateTicketsFromResponse(ticketsPayload?.data, productssPayload?.data);

        setIsLoading(false);
      } else {
        let filteredLocationFromCompany = masterLocationsResponse.filter(
          (location) => {
            return location.CompanyId == company.Id;
          }
        );

        let filteredCustomersFromCompany = masterCustomerListResponse.filter(
          (customer) => {
            return customer.CompanyId == company.Id;
          }
        );

        let filteredProjectsFromCompany = masterProjectsResponse.filter(
          (project) => {
            return project.CompanyId == company.Id;
          }
        );

        let filteredTicketsFromCompany = masterTicketListResponse.filter(
          (ticket) => {
            return ticket.CompanyId == company.Id;
          }
        );

        dispatch(setCompanyLocations(filteredLocationFromCompany));
        dispatch(setCompanyCustomers(filteredCustomersFromCompany));
        dispatch(setCompanyProjects(filteredProjectsFromCompany));
        dispatch(setCompanyTickets(filteredTicketsFromCompany));
        dispatch(setCompanyProducts(masterProductsResponse));

        updateTicketsFromResponse(
          filteredTicketsFromCompany,
          masterProductsResponse
        );
      }
    });
  };

  const handleClearText = () => {
    setSearchValue("");
    setItemsSearch(companyDashboardResponse);
  };

  const renderItem = ({ item, index }: { item: any; index: number }) => (
    <TouchableOpacity
      style={{
        flex: 1,
        margin: 5,
        height: expandedItem == index ? locationsResponse.length * 60 : 50,
        flexDirection: "column",
        padding: 5,
      }}
      // onPress={() => toggleItem(index)}
      disabled={item?.Name == "Total" || item?.Name == "Others"}
    >
      <View style={{ flexDirection: "row" }}>
        {item?.Name == "Others" ? (
          <Image
            style={{ width: 42, height: 42 }}
            source={require("../../assets/Others.png")}
          />
        ) : item?.Name !== "Total" ? (
          <UserNameIcon name={item?.Name} />
        ) : null}
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: expandedItem == index ? "flex-start" : "center",
            marginTop: expandedItem == index ? 10 : 0,
          }}
        >
          <Text
            style={{
              fontSize: item?.Name == "Total" ? 17 : 14,
              color: "black",
              fontWeight: item?.Name !== "Others" && "Total" ? "400" : "bold",
              marginLeft: 10,
            }}
            numberOfLines={1}
          >
            {item?.Name}
          </Text>

          {/* {item?.Name == "Total" || item?.Name == "Others" ? null : (
            <Image
              style={{
                width: 15,
                height: 15,
                marginLeft: 5,
                marginTop: expandedItem == index ? 2 : 0,
              }}
              source={
                expandedItem == index
                  ? require("../../assets/imgDownArrow.png")
                  : require("../../assets/imgUpArrow.png")
              }
            />
          )} */}
        </View>
        <View
          style={{
            justifyContent: "flex-end",
            flexDirection: "row",
            marginTop: 10,
          }}
        >
          {/* {item?.Raised == undefined ? null : item?.Raised ? (
            <Image
              style={{ width: 13, height: 13, marginTop: 3 }}
              source={require("../../assets/imgGreenUp.png")}
            />
          ) : (
            <Image
              style={{ width: 13, height: 13, marginTop: 3 }}
              source={require("../../assets/imgRedDown.png")}
            />
          )} */}

          <Text
            style={{
              fontSize: item?.Name == "Total" ? 17 : 16,
              color: "black",
              fontWeight: item?.Name !== "Others" && "Total" ? "400" : "bold",
              textAlign: "right",
              marginLeft: 5,
              marginRight: 5,
            }}
          >
            {item?.DayTicketCount}
          </Text>
        </View>
      </View>
      {expandedItem === index && locationsResponse.length ? (
        <FlatList
          data={locationsResponse}
          keyExtractor={(item) => item.Name}
          renderItem={({ item }) => (
            <View
              style={{
                flexDirection: "row",
                borderRadius: 20,
                marginTop: 10,
                padding: 10,
                borderWidth: 0.5,
                borderColor: "lightgray",
                alignItems: "center",
              }}
            >
              <Image
                style={{ width: 20, height: 20 }}
                source={require("../../assets/imgExpandPin.png")}
              />
              <Text
                style={{ flex: 1, marginLeft: 5, fontSize: 13, color: "black" }}
              >
                {item.SiteName}
              </Text>
              <Text
                style={{ alignItems: "flex-end", fontSize: 13, color: "black" }}
              >
                {item.DayTicketCount}
              </Text>
            </View>
          )}
        />
      ) : null}
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: COLOR.VIEW_BG }}>
      <ScrollView
        style={{ flex: 1, backgroundColor: COLOR.VIEW_BG }}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={onPullRefresh} />
        }
      >
        <DashboardHeader
          profileName={`${userResponse?.FirstName} ${userResponse?.Surname}`}
          profileImage={userResponse?.ProfileImage}
        ></DashboardHeader>

        {isLoading ? (
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
        ) : (
          <View style={{ flex: 1, marginHorizontal: 20, marginTop: 5 }}>
            <View style={{ flexDirection: "row", flex: 1 }}>
              {dashboardResponse.length > 1 ? (
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    flex: 1,
                  }}
                  onPress={() => openModal()}
                >
                  <View style={{ alignItems: "flex-end", flex: 1 }}>
                    <UserNameIcon
                      name={selectedCompany?.Name}
                      size={25}
                      font={10}
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: "column",
                      alignItems: "flex-end",
                      marginLeft: 5,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 13,
                        color: COLOR.BLACK,
                        textAlign: "right",
                        fontWeight: "600",
                      }}
                      numberOfLines={2}
                    >
                      {selectedCompany?.Name}
                    </Text>

                    <View
                      style={{
                        flexDirection: "row",
                        marginTop: 5,
                        marginLeft: 5,
                      }}
                    >
                      <Text
                        style={{
                          color: COLOR.BLUE,
                          fontSize: 14,
                          textAlign: "right",
                        }}
                      >
                        Change
                      </Text>
                      <Image
                        style={{
                          width: 20,
                          height: 20,
                          marginLeft: 5,
                        }}
                        source={require("../../assets/imgDashboardRight.png")}
                      />
                    </View>
                  </View>
                  <View style={{ flexDirection: "row" }}></View>
                </TouchableOpacity>
              ) : (
                <View
                  style={{
                    flexDirection: "row",
                    flex: 1,
                  }}
                >
                  <View style={{ alignItems: "flex-end", flex: 1 }}>
                    <UserNameIcon
                      name={selectedCompany?.Name}
                      size={25}
                      font={10}
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: "column",
                      alignItems: "flex-end",
                      marginLeft: 5,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 13,
                        color: COLOR.BLACK,
                        textAlign: "right",
                        fontWeight: "600",
                        marginTop: 2,
                      }}
                      numberOfLines={2}
                    >
                      {selectedCompany?.Name}
                    </Text>
                  </View>
                </View>
              )}
            </View>

            <Text
              style={{
                flex: 1,
                fontSize: 16,
                color: "#9FABB9",
                fontWeight: "600",
              }}
            >
              Today's Tickets
            </Text>

            {dashboardCustomerResponse ? (
              <FlatList
                style={{
                  backgroundColor: "white",
                  borderRadius: 15,
                  marginTop: 20,
                }}
                data={dashboardCustomerResponse}
                onEndReachedThreshold={0.5}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                renderItem={renderItem}
                ItemSeparatorComponent={() => (
                  <View style={{ height: 0.5, backgroundColor: "#9FABB9" }} />
                )}
                keyExtractor={(item) => item.Name}
              />
            ) : null}

            <View style={{ flexDirection: "row", marginTop: 20 }}>
              <View style={{ flex: 1, flexDirection: "row" }}>
                <Image
                  style={{}}
                  source={require("../../assets/lastSyncIcon.png")}
                />
                <Text
                  style={{
                    flex: 1,
                    marginLeft: 5,
                    fontSize: 13,
                    fontWeight: "500",
                    color: "#55B85C",
                  }}
                >
                  Last Synced on
                </Text>
              </View>
              <View style={{ flex: 1, flexDirection: "row" }}>
                <Text style={{ flex: 1, color: "black", textAlign: "right" }}>
                  {lastSyncedDate ? lastSyncedDate : "Not synced"}
                </Text>
              </View>
            </View>

            {isConnected ? (
              <View
                style={{
                  flexDirection: "row",
                  marginTop: 15,
                  backgroundColor: "white",
                  height: 60,
                  borderColor: "#9FABB9",
                  borderWidth: 0.5,
                  borderRadius: 10,
                }}
              >
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      marginLeft: 20,
                      fontSize: 15,
                      fontWeight: "500",
                      color: "black",
                    }}
                  >
                    Status
                  </Text>
                </View>
                <Text
                  style={{
                    color: "#55B85C",
                    fontSize: 18,
                    marginRight: 20,
                    textAlign: "center",
                    paddingVertical: 18,
                  }}
                >
                  Online
                </Text>
              </View>
            ) : (
              <View
                style={{
                  flexDirection: "row",
                  marginTop: 15,
                  backgroundColor: "white",
                  height: 60,
                  borderColor: "#9FABB9",
                  borderWidth: 0.5,
                  borderRadius: 10,
                }}
              >
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      marginLeft: 20,
                      fontSize: 15,
                      fontWeight: "500",
                      color: "#EB4E62",
                    }}
                  >
                    Offline
                  </Text>
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      marginLeft: 10,
                      alignItems: "center",
                      backgroundColor: "#ECEFF3",
                      width: 80,
                      height: 30,
                      borderRadius: 20,
                    }}
                    onPress={() => console.log("refresh pressed")}
                  >
                    <Image
                      style={{ width: 12, height: 12, marginLeft: 10 }}
                      source={require("../../assets/imgRefresh.png")}
                    />
                    <Text
                      style={{
                        flex: 1,
                        color: "black",
                        fontSize: 12,
                        marginLeft: 5,
                      }}
                    >
                      Refresh
                    </Text>
                  </TouchableOpacity>
                </View>
                <Text
                  style={{
                    color: "black",
                    fontSize: 18,
                    marginRight: 20,
                    textAlign: "center",
                    paddingVertical: 18,
                  }}
                >
                  {offlineDashboardTicketCount
                    ? offlineDashboardTicketCount
                    : 0}
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
      <TouchableOpacity
        style={{
          width: 60,
          height: 60,
          borderRadius: 30,
          position: "absolute",
          bottom: 20,
          right: 20,
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

      {locationModalVisible && (
        <View style={styles.modalContainer}>
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 10,
              marginHorizontal: 40,
              height:
                itemsSearch.length > 4
                  ? isLandscape
                    ? windowHeight - 100
                    : 360
                  : isLandscape
                  ? windowHeight - 100
                  : 300,
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <Text
                style={{
                  textAlign: "left",
                  marginLeft: 15,
                  fontSize: 16,
                  marginTop: 15,
                  flex: 1,
                  fontWeight: "bold",
                }}
              >
                Select Company
              </Text>

              {Object.keys(selectedCompany).length !== 0 ? (
                <TouchableOpacity
                  style={{
                    width: 30,
                    height: 30,
                    marginTop: 15,
                    marginRight: 10,
                    alignItems: "flex-end",
                  }}
                  onPress={() => closeModal()}
                >
                  <Image
                    style={{ width: 20, height: 20 }}
                    source={require("../../assets/imgModalClose.png")}
                  />
                </TouchableOpacity>
              ) : null}
            </View>

            <View>
              <View style={styles.serachBox}>
                <Image
                  source={require("../../assets/imgSearch.png")}
                  style={{ alignSelf: "center", width: 20, height: 20 }}
                />
                <TextInput
                  placeholder="Search Company"
                  onChangeText={handleSearch}
                  returnKeyType="search"
                  value={searchValue}
                  onSubmitEditing={() => {
                    handleSearch(searchValue);
                  }}
                  style={{
                    width: "90%",
                    paddingLeft: 10,
                    backgroundColor: "#F3F5F8",
                  }}
                />
                {searchValue !== "" && (
                  <TouchableOpacity
                    onPress={handleClearText}
                    style={{
                      width: 20,
                      height: 20,
                      marginTop: 15,
                      marginLeft: -5,
                    }}
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
            </View>
            <FlatList
              style={{
                marginHorizontal: 20,
                borderColor: "lightgray",
                borderWidth: 1,
                borderRadius: 10,
                marginBottom: 15,
              }}
              data={itemsSearch}
              keyExtractor={(item) => item.Id}
              ItemSeparatorComponent={() => (
                <View style={{ height: 0.5, backgroundColor: "#9FABB9" }} />
              )}
              ListEmptyComponent={
                <View
                  style={{
                    alignItems: "center",
                    flexDirection: "column",
                    flex: 1,
                    justifyContent: "space-evenly",
                  }}
                >
                  <Text
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      color: "black",
                      marginTop: 70,
                    }}
                  >
                    No Companies Found
                  </Text>
                </View>
              }
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  onPress={() => onCompanySelected(item)}
                  style={{
                    flex: 1,
                    flexDirection: "column",
                    marginLeft: 15,
                    height: 50,
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <UserNameIcon name={item?.Name} size={40} font={13} />
                    <Text
                      style={{
                        color: "black",
                        marginLeft: 10,
                        flex: 1,
                      }}
                      numberOfLines={1}
                    >
                      {item.Name}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      )}
      {isSyncLoading ? <SyncLoading isSyncLoading={isSyncLoading} /> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "blue",
    borderRadius: 5,
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
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    marginHorizontal: 40,
    height: 360,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  closeButtonText: {
    color: COLOR.BLUE,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    color: "black",
  },
  dropdownContainer: {
    width: "100%",
    marginBottom: 10,
  },
  dropdown: {
    backgroundColor: "#fafafa",
  },
  dropdownItem: {
    justifyContent: "flex-start",
  },
  serachBox: {
    borderColor: "#BDC1C7",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
    height: 50,
    flexDirection: "row",
    marginHorizontal: 20,
    marginVertical: getScaleAxis(10),
    backgroundColor: "#F3F5F8",
    marginTop: 20,
  },
});
export default DashboardScreen;
