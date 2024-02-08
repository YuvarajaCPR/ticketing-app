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
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Platform,
  Alert,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import React, { useEffect, FC, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../Store";
import { COLOR } from "../../Utils/Constants";
import NetInfo from "@react-native-community/netinfo";
import DropDownPicker from "react-native-dropdown-picker";
import CreateTicketHeader from "../../Components/CreateTicketHeader";
import CustomButton from "../../Components/CustomButton";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  setProductsFromLocations,
  setProjectsFromCustomers,
  updateTicketImage,
  updateTicketDetail,
  updateTicketInOffline,
  updateViewTicketResponse,
} from "../../Store/CreateTicketSlice";

import {
  setDashboardOfflineTicketCount,
  setLastSyncedDate,
} from "../../Store/DashboardSlice";

import {
  useCreateTicketMutation,
  useUpdateTicketMutation,
  useDeleteTicketImageMutation,
  useGetTicketDetailMutation,
  useGetTicketImageMutation,
} from "../../Services/Module/CreateTicketService";
import uuid from "react-native-uuid";
import { useIsFocused, useNavigation } from "@react-navigation/native";
// import ImagePicker from "react-native-image-crop-picker";
import axios from "axios";
import { TICKETS, IMAGES, BASE_URL, COMPANIES } from "../../Utils/URL";
import ImagePicker, {
  launchCamera,
  launchImageLibrary,
} from "react-native-image-picker";
import moment from "moment";
import Utility from "../../Utils/Utility";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  setTicketsListArrayForOffline,
  updateDashboardCustomersInOffline,
  updateMasterCustomersInOffline,
} from "../../Store/CreateTicketSlice";
import fs from "react-native-fs";
import { decode } from "base64-arraybuffer";
import RNFS from "react-native-fs";
import { store } from "../../Store";
import { navigateAndSimpleReset } from "../../Navigators/utils";
import SyncLoading from "../../Components/SyncLoading";

const CreateTicketScreen: FC = ({ route }) => {
  const isEdit = route.params.isEdit;
  const ticketIndex = route.params.ticketIndex;

  const [
    createTicket,
    {
      isSuccess: createTicketSuccess,
      isLoading: createTicketLoading,
      data: createTicketResponse,
    },
  ] = useCreateTicketMutation();

  const [
    updateTicket,
    {
      isSuccess: updateTicketSuccess,
      isLoading: updateTicketLoading,
      data: updateTicketResponse,
    },
  ] = useUpdateTicketMutation();

  const [
    deleteTicketImage,
    {
      isSuccess: deleteTicketImageSucess,
      isLoading: deleteTicketImageLoading,
      data: deleteTicketImageResponse,
    },
  ] = useDeleteTicketImageMutation();

  const [
    getTicketDetails,
    {
      isSuccess: getTicketSuccess,
      isLoading: getTicketLoading,
      data: getTicketResponse,
    },
  ] = useGetTicketDetailMutation();

  const [
    getTicketDetailsImage,
    {
      isSuccess: getTicketImageSuccess,
      isLoading: getTicketImageLoading,
      data: getTicketImageResponse,
    },
  ] = useGetTicketImageMutation();

  const companyResponse = useSelector(
    (state: RootState) => state.dashboard.DashboardResponse
  );

  const ticketsListResponse = useSelector(
    (state: RootState) => state.createTicket.TicketListResponse
  );

  const customerResponse = useSelector(
    (state: RootState) => state.createTicket.CustomersResponse
  );

  const accessTokenResponse = useSelector(
    (state: RootState) => state.auth.accessTokenResponse
  );

  const locationsResponse = useSelector(
    (state: RootState) => state.createTicket.LocationsResponse
  );

  const customersResponse = useSelector(
    (state: RootState) => state.createTicket.CustomersResponse
  );

  const masterCustomersResponse = useSelector(
    (state: RootState) => state.createTicket.MasterCustomersResponse
  );

  const productsResponse = useSelector(
    (state: RootState) => state.createTicket.ProductsResponse
  );

  const searchProductsResponse = useSelector(
    (state: RootState) => state.createTicket.SearchProductsResponse
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

  const searchProjectsResponse = useSelector(
    (state: RootState) => state.createTicket.SearchProjectResponse
  );

  const ticketImages = useSelector(
    (state: RootState) => state.createTicket.TicketImage
  );

  const ticketDetails = useSelector(
    (state: RootState) => state.createTicket.TicketDetail
  );

  const userResponse = useSelector(
    (state: RootState) => state.dashboard.UserResponse
  );

  const selectedCompany = useSelector(
    (state: RootState) => state.dashboard.selectedCompany
  );

  const offlineTicketCount = useSelector(
    (state: RootState) => state.dashboard.offlineTicketCount
  );

  const [companyDropdownOpen, setCompanyDropdownOpen] = useState(false);
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [customerDropdownOpen, setCustomerDropdownOpen] = useState(false);
  const [productsDropdownOpen, setLProductsDropdownOpen] = useState(false);
  const [quantityTypeDropdownOpen, setQuantityTypeDropdownOpen] =
    useState(false);
  const [truckTypeDropdownOpen, setTruckTypeDropdownOpen] = useState(false);
  const [projectsDropdownOpen, setProjectsDropdownOpen] = useState(false);

  const [companyValue, setCompanyValue] = useState(selectedCompany?.Id);

  const [locationValue, setLocationValue] = useState(
    isEdit ? ticketDetails?.LocationId : null
  );
  const [customerValue, setCustomerValue] = useState(
    isEdit ? ticketDetails?.CustomerId : null
  );
  const [productValue, setProductValue] = useState(
    isEdit ? ticketDetails?.ProductId : null
  );
  const [quantityTypeValue, setQuantityTypeValue] = useState(
    isEdit ? ticketDetails?.units?.Id : null
  );

  const [quantityTypeName, setQuantityTypeName] = useState(
    isEdit ? ticketDetails?.UnitId : null
  );

  const [truckTypeValue, setTruckTypeValue] = useState(
    isEdit ? ticketDetails?.TruckTypeId : null
  );
  const [projectsValue, setProjectsValue] = useState(
    isEdit ? ticketDetails?.ProjectId : null
  );

  const [quantityValue, setQuantityValue] = useState(
    isEdit ? ticketDetails?.Quantity : ""
  );
  const [truckNumValue, setTruckNumValue] = useState(
    isEdit ? ticketDetails?.TruckNum : ""
  );
  const [poValue, setPoValue] = useState(isEdit ? ticketDetails?.PONum : "");

  const [coordinates, setCoordinates] = useState(Object);
  const [isConnected, setIsConnected] = useState(false);
  const [isImageUploadLoading, setIsImageUploadLoading] = useState(false);
  const [ismaterialValChangedCalled, setIsmaterialValChangedCalled] =
    useState(false);

  const [images, setImages] = useState([]);
  const [ticketNum, setTicketNum] = useState("");
  const [trailerQty, setTrailerQty] = useState(
    isEdit ? ticketDetails?.location?.MaxTrailers : 0
  );
  const [inputValues, setInputValues] = useState(isEdit ? [] : [""]);

  const dispatch = useDispatch();
  const navigation: any = useNavigation();
  const isFocused = useIsFocused();
  const windowHeight = Dimensions.get("window").height;
  const windowWidth = Dimensions.get("window").width;
  const [isSyncLoading, setIsSyncLoading] = useState(false);

  // Component DidMount
  useEffect(() => {
    checkNetworkConnection();

    console.log("", ticketDetails);

    if (ticketsListResponse) {
      if (ticketsListResponse.length) {
        let filteredTicketsFromUser = ticketsListResponse.filter((ticket) => {
          return ticket.UserId == userResponse.Id;
        });

        if (filteredTicketsFromUser.length) {
          let lastTicketObj =
            filteredTicketsFromUser[filteredTicketsFromUser.length - 1];
          console.log("lastTicketObj ==", lastTicketObj);
          let lastTicketId = lastTicketObj?.Id + 1;
          setTicketNum(`${lastTicketId}${uuid.v4().substring(0, 2)}`);
        } else {
          let lastTicketId = 1;
          setTicketNum(`${lastTicketId}${uuid.v4().substring(0, 2)}`);
        }
      } else {
        let lastTicketId = 1;
        setTicketNum(`${lastTicketId}${uuid.v4().substring(0, 2)}`);
      }
    } else {
      let lastTicketId = 1;
      setTicketNum(`${lastTicketId}${uuid.v4().substring(0, 2)}`);
    }
  }, [ticketsListResponse]);

  // Component DidMount
  useEffect(() => {
    if (isEdit) {
      let filteredLocation = locationsResponse.filter((loc) => {
        return loc.Id == ticketDetails?.LocationId;
      });
      let locationObj = filteredLocation[0];
      setCoordinates(locationObj);

      let filteredProductsFromLocation = productsResponse.filter((product) => {
        return product.LocationId == ticketDetails?.LocationId;
      });
      dispatch(setProductsFromLocations(filteredProductsFromLocation));

      let filteredProjectsFromCustomers = projectsResponse.filter((product) => {
        return product.CustomerId == ticketDetails?.CustomerId;
      });
      dispatch(setProjectsFromCustomers(filteredProjectsFromCustomers));
      setImages(ticketImages);
      let QunatityInputValues = [];
      for (let index = 0; index < ticketDetails?.Quantities.length; index++) {
        const element = ticketDetails?.Quantities[index];
        const quantity = `${
          element.includes(".") ? element.replace(/\.?0+$/, "") : element
        }`;
        QunatityInputValues.push(quantity);
      }
      setInputValues(QunatityInputValues);

      // if (ticketDetails?.Images) {
      //   for (let index = 0; index < ticketDetails?.Images.length; index++) {
      //     const imageElement = ticketDetails?.Images[index];
      //     let imageString = `file://${RNFS.DocumentDirectoryPath}/${ticketDetails?.Id}${imageElement?.Id}.jpg`;
      //     images.push({ Id: imageElement?.Id, uri: imageString });
      //   }
      // } else {
      //   for (let index = 0; index < ticketDetails?.images.length; index++) {
      //     const imageElement = ticketDetails?.images[index];
      //     images.push({ Id: 0, uri: imageElement });
      //   }
      // }
    }
  }, [ticketDetails]);

  // Component DidMount
  useEffect(() => {
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
                            AsyncStorage.removeItem("postTicketImageResponse");
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
                            AsyncStorage.removeItem("postTicketImageResponse");
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
                          await AsyncStorage.getItem("postTicketImageResponse");
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
                            postTicketImageResponseArray.concat([postImageRes]);

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

                    let filterpostTicketResArr = postTicketResponseArray.filter(
                      (res) => {
                        return res.TicketNum == offlineTicketId;
                      }
                    );

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
                            AsyncStorage.removeItem("postTicketImageResponse");
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
                              Utility.showAlert("Error", response.data.Message);
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
                        } else if (
                          response.status == 200 ||
                          response.status == 204
                        ) {
                          if (
                            element?.method == "POST" &&
                            element.apiName != "support"
                          ) {
                            let postTicketResponse = await AsyncStorage.getItem(
                              "postTicketResponse"
                            );
                            if (postTicketResponse !== null) {
                              let postTicketResponseArray: [Object] =
                                JSON.parse(postTicketResponse);

                              postTicketResponseArray =
                                postTicketResponseArray.concat([response.data]);

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
                            AsyncStorage.removeItem("postTicketImageResponse");
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
  }, [isConnected]);

  // Component DidMount
  useEffect(() => {
    if (createTicketSuccess) {
      const createTicketResponseFormat = {
        ...createTicketResponse,
        Id:
          createTicketResponse.Id && createTicketResponse.Id !== null
            ? Number(createTicketResponse.Id)
            : 0, // Convert Id to number
      };

      //Update Ticket list array in Online
      dispatch(
        setTicketsListArrayForOffline({
          ...createTicketResponseFormat,
          images: images,
        })
      );

      //Update Dashboard company list in Online
      customersResponse.map((item, index) => {
        if (item.Id === createTicketResponseFormat.CustomerId) {
          let updatedObject = {
            ...item,
            DayTicketCount: item?.DayTicketCount + 1,
          }; // Create a new object with the updated age
          dispatch(
            updateDashboardCustomersInOffline({
              updatedObject: updatedObject,
              index: index,
            })
          );
        }
      });

      //Update master company list in Online
      masterCustomersResponse.map((item, index) => {
        if (item.Id === createTicketResponseFormat.CustomerId) {
          let updatedObject = {
            ...item,
            DayTicketCount: item?.DayTicketCount + 1,
          }; // Create a new object with the updated age
          dispatch(
            updateMasterCustomersInOffline({
              updatedObject: updatedObject,
              index: index,
            })
          );
        }
      });
      if (images.length) {
        setIsImageUploadLoading(true);
        convertToBinary(createTicketResponse);
      } else {
        Alert.alert(
          "",
          "Ticket created successfully",
          [{ text: "OK", onPress: () => navigation.goBack() }],
          { cancelable: false }
        );
      }
    }
  }, [createTicketSuccess]);

  // Component DidMount
  useEffect(() => {
    if (deleteTicketImageSucess) {
      async function fetchData() {
        try {
          let inputObj = {
            Id: ticketDetails?.Id,
            CompanyId: ticketDetails?.CompanyId,
          };
          await getTicketDetails(inputObj);
        } catch (e) {
          console.error(e);
        }
      }
      fetchData();
    }
  }, [deleteTicketImageSucess]);

  // Component DidMount
  useEffect(() => {
    if (getTicketSuccess) {
      console.log("getTicketSuccess ==", getTicketSuccess);
      console.log("getTicketResponse ==", getTicketResponse);

      dispatch(updateTicketDetail(getTicketResponse));
      formTicketForDisplayTextAndImages(getTicketResponse);

      if (getTicketResponse?.Images.length > 0) {
        setImages([]);
        let ticketImages = [];
        for (let index = 0; index < getTicketResponse?.Images.length; index++) {
          const imageObj = getTicketResponse?.Images[index];
          const imageUrl = `file://${RNFS.DocumentDirectoryPath}/${ticketDetails?.Id}${imageObj?.Id}.jpg`;
          ticketImages.push({ Id: imageObj?.Id, uri: imageUrl });
        }
        console.log("ticketImages ==", ticketImages);

        setImages(ticketImages);
        dispatch(updateTicketImage(ticketImages));
      } else {
        setImages([]);
        dispatch(updateTicketImage([]));
      }
      Utility.showAlert("", "Image Deleted Successfully");
    }
  }, [getTicketSuccess]);

  // Component DidMount
  useEffect(() => {
    if (updateTicketSuccess) {
      console.log("updateTicketResponse?.id", updateTicketResponse);
      let index = ticketsListResponse.indexOf((ticket) => {
        return ticket.UserId == updateTicketResponse?.Id;
      });
      if (images.length) {
        setIsImageUploadLoading(true);
        convertToBinary(updateTicketResponse);
      } else {
        Alert.alert(
          "",
          "Ticket updated successfully",
          [
            {
              text: "OK",
              onPress: () => {
                if (updateTicketResponse) {
                  let ticketObj = {
                    updatedObject: updateTicketResponse,
                    index: index,
                  };
                  dispatch(updateTicketInOffline(ticketObj));
                  formTicketForDisplayTextAndImages(updateTicketResponse);
                }
                navigation.goBack();
                //navigation.navigate("TicketListScreen", { isRefresh: true }),
              },
            },
          ],
          { cancelable: false }
        );
      }
    }
  }, [updateTicketSuccess]);

  const formTicketForDisplayTextAndImages = (ticketDetailResponse) => {
    let filteredProductsFromTickets = productsResponse.filter((product) => {
      return product.Id == ticketDetailResponse.ProductId;
    });

    let filteredLocationFromTickets = locationsResponse.filter((location) => {
      return location.Id == ticketDetailResponse.LocationId;
    });

    let filteredUnitsFromTickets = quantityResponse.filter((quantity) => {
      return quantity.Id == ticketDetailResponse.UnitId;
    });

    let filteredTruckTypeFromTickets = truckTypeResponse.filter((truckType) => {
      return truckType.Id == ticketDetailResponse.TruckTypeId;
    });

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
    if (ticketDetailResponse?.Image) {
      ticketsObj = {
        ...ticketDetailResponse,
        product: filteredProductsFromTickets[0],
        productImage: productImage,
        location: filteredLocationFromTickets[0],
        units: filteredUnitsFromTickets[0],
        truckTypes: filteredTruckTypeFromTickets[0],
        user: userResponse,
      };
    } else {
      ticketsObj = {
        ...ticketDetailResponse,
        product: filteredProductsFromTickets[0],
        productImage: productImage,
        location: filteredLocationFromTickets[0],
        units: filteredUnitsFromTickets[0],
        truckTypes: filteredTruckTypeFromTickets[0],
        user: userResponse,
        images: ticketDetailResponse.images ? ticketDetailResponse.images : [],
      };
    }
    if (isEdit) {
      dispatch(updateViewTicketResponse(ticketsObj));
    }
    dispatch(updateTicketDetail(ticketsObj));
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

  const onOpenCompanyPicker = () => {
    if (companyDropdownOpen) {
      setCompanyDropdownOpen(false);
    } else {
      setCompanyDropdownOpen(true);
    }
  };

  const onOpenLocationPicker = () => {
    if (locationDropdownOpen) {
      setLocationDropdownOpen(false);
    } else {
      setLocationDropdownOpen(true);
      setCustomerDropdownOpen(false);
      setLProductsDropdownOpen(false);
      setQuantityTypeDropdownOpen(false);
      setTruckTypeDropdownOpen(false);
      setProjectsDropdownOpen(false);
    }
  };

  const onOpenCustomerPicker = () => {
    if (customerDropdownOpen) {
      setCustomerDropdownOpen(false);
    } else {
      setCustomerDropdownOpen(true);
      setLocationDropdownOpen(false);
      setLProductsDropdownOpen(false);
      setQuantityTypeDropdownOpen(false);
      setTruckTypeDropdownOpen(false);
      setProjectsDropdownOpen(false);
    }
  };

  const onOpenProductsPicker = () => {
    if (productsDropdownOpen) {
      setLProductsDropdownOpen(false);
    } else {
      setLProductsDropdownOpen(true);
      setLocationDropdownOpen(false);
      setCustomerDropdownOpen(false);
      setQuantityTypeDropdownOpen(false);
      setTruckTypeDropdownOpen(false);
      setProjectsDropdownOpen(false);
    }
  };

  const onOpenQuantityTypePicker = () => {
    if (quantityTypeDropdownOpen) {
      setQuantityTypeDropdownOpen(false);
    } else {
      setQuantityTypeDropdownOpen(true);
      setLocationDropdownOpen(false);
      setCustomerDropdownOpen(false);
      setTruckTypeDropdownOpen(false);
      setLProductsDropdownOpen(false);
      setProjectsDropdownOpen(false);
    }
  };

  const onOpenTruckTypePicker = () => {
    if (truckTypeDropdownOpen) {
      setTruckTypeDropdownOpen(false);
    } else {
      setTruckTypeDropdownOpen(true);
      setLocationDropdownOpen(false);
      setCustomerDropdownOpen(false);
      setQuantityTypeDropdownOpen(false);
      setProjectsDropdownOpen(false);
      setLProductsDropdownOpen(false);
    }
  };

  const onOpenProjectsPicker = () => {
    if (projectsDropdownOpen) {
      setProjectsDropdownOpen(false);
    } else {
      setProjectsDropdownOpen(true);
      setLocationDropdownOpen(false);
      setCustomerDropdownOpen(false);
      setQuantityTypeDropdownOpen(false);
      setTruckTypeDropdownOpen(false);
      setLProductsDropdownOpen(false);
    }
  };

  const locationValChanged = (locationId) => {
    let filteredLocation = locationsResponse.filter((loc) => {
      return loc.Id == locationId;
    });
    let locationObj = filteredLocation[0];
    setCoordinates(locationObj);
    setTrailerQty(locationObj?.MaxTrailers);

    let filteredProductsFromLocation = productsResponse.filter((product) => {
      return product.LocationId == locationId;
    });
    dispatch(setProductsFromLocations(filteredProductsFromLocation));
  };

  const customerValChanged = (CustomerId) => {
    setProjectsValue(null);

    let filteredProjectsFromCustomers = projectsResponse.filter((product) => {
      return product.CustomerId == CustomerId;
    });
    dispatch(setProjectsFromCustomers(filteredProjectsFromCustomers));
  };

  const materialvalChanged = (materialId) => {
    if (ismaterialValChangedCalled) {
      let filteredMaterial = productsResponse.filter((loc) => {
        return loc.Id == materialId;
      });
      let materialObj = filteredMaterial[0];

      if (materialObj) {
        setQuantityTypeValue(materialObj?.UnitId);
        console.log("materialObj", materialObj);

        if (materialObj?.UnitId == 2) {
          setInputValues(["1"]);
        } else {
          setInputValues([""]);
        }

        let filteredUnitsFromTickets = quantityResponse.filter((quantity) => {
          return quantity.Id == materialObj.UnitId;
        });

        if (filteredUnitsFromTickets?.length) {
          setQuantityTypeName(filteredUnitsFromTickets?.[0].Name);
        }
      }
    }
    setIsmaterialValChangedCalled(true);
  };

  const onAddTrailerQtyPressed = () => {
    if (trailerQty > inputValues.length) {
      if (quantityTypeValue == 2) {
        setInputValues([...inputValues, "1"]); // Add an empty value to the array
      } else if (quantityTypeValue == 3) {
        setInputValues([...inputValues, ""]); // Add an empty value to the array
      } else {
        setInputValues([...inputValues, ""]); // Add an empty value to the array
      }
      console.log("onAddTrailerQtyPressed", inputValues);
    }
  };

  const onRemoveTrailerQtyPressed = (index) => {
    const newInputValues = [...inputValues];
    newInputValues.splice(index, 1); // Remove the input at the specified index
    setInputValues(newInputValues);

    console.log("onRemoveTrailerQtyPressed", newInputValues);
  };

  const handleInputChange = (value, index) => {
    let allowIntAndDecimals = value.replace(/[^0-9, .]/g, "");
    console.log("allowIntAndDecimals", allowIntAndDecimals);
    console.log("quantityTypeValue", quantityTypeValue);

    const newInputValues = [...inputValues];
    if (allowIntAndDecimals !== "") {
      newInputValues[index] = allowIntAndDecimals;
      setInputValues(newInputValues);
    } else {
      if (quantityTypeValue == 3) {
        newInputValues[index] = "";
      } else {
        newInputValues[index] = "";
      }
      setInputValues(newInputValues);
    }
    console.log("handleInputChange ==", inputValues);
  };

  const onPressGallery = async () => {
    setProjectsDropdownOpen(false);
    setLocationDropdownOpen(false);
    setCustomerDropdownOpen(false);
    setQuantityTypeDropdownOpen(false);
    setTruckTypeDropdownOpen(false);
    setLProductsDropdownOpen(false);

    const options = {
      storageOptions: {
        path: "images",
        mediaType: "photo",
      },
    };
    // await launchImageLibrary(options, handleImageCapture);
    await launchCamera(options, handleImageCapture);
  };

  const handleImageCapture = (response) => {
    if (response.didCancel) {
      console.log("User cancelled image picker");
    } else if (response.errorCode) {
      console.log(response.errorMessage);
    } else {
      const source = response.assets![0]; //Unwrap the response assets and grab the first item (the captured image)
      setImages([...images, { Id: 0, uri: source.uri }]);
    }
  };

  const convertToBinary = async (ticket: any) => {
    await uploadImage(ticket, images);
  };

  const uploadImage = async (tickeRes: any, images: any) => {
    let ticketId = tickeRes?.Id;
    let ticketIndex = ticketsListResponse.indexOf((ticket) => {
      return ticket.UserId == tickeRes?.Id;
    });
    for (let index = 0; index < images.length; index++) {
      const image = images[index];

      if (image?.Id == 0) {
        const base64 = await fs.readFile(image.uri, "base64");

        await axios
          .post(
            `${BASE_URL}/${TICKETS}/${ticketId}/${IMAGES}`,
            decode(base64),
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${accessTokenResponse?.access_token}`,
                Cookie:
                  "rgisanonymous=true; rguserid=51d7049d-1c39-440e-aeae-b24569142b49; rguuid=true",
              },
            }
          )
          .then((response) => {
            console.log("image upload response", response);
            if (response.status == 201) {
              if (index == images.length - 1) {
                setIsImageUploadLoading(false);
                if (isEdit) {
                  Alert.alert(
                    "",
                    "Ticket updated successfully",
                    [
                      {
                        text: "OK",
                        onPress: () => {
                          if (tickeRes) {
                            let ticketObj = {
                              updatedObject: tickeRes,
                              index: ticketIndex,
                            };
                            dispatch(updateTicketInOffline(ticketObj));
                            formTicketForDisplayTextAndImages(tickeRes);
                          }
                          navigation.goBack();
                          // navigation.navigate("TicketListScreen", {
                          //   isRefresh: true,
                          // }),
                        },
                      },
                    ],
                    { cancelable: false }
                  );
                } else {
                  Alert.alert(
                    "",
                    "Ticket created successfully",
                    [{ text: "OK", onPress: () => navigation.goBack() }],
                    { cancelable: false }
                  );
                }
              }
            } else if (response.status == 401) {
              store.dispatch({ type: "RESET_ALL" });
              navigateAndSimpleReset("Splash");
            } else {
              Utility.showAlert("Error", response.data.Message);
            }
          })
          .catch((e) => {
            console.log("------>", e);
          });
      } else {
        if (index == images.length - 1) {
          setIsImageUploadLoading(false);
          if (isEdit) {
            Alert.alert(
              "",
              "Ticket updated successfully",
              [
                {
                  text: "OK",
                  onPress: () => {
                    if (tickeRes) {
                      let ticketObj = {
                        updatedObject: tickeRes,
                        index: ticketIndex,
                      };
                      dispatch(updateTicketInOffline(ticketObj));
                      formTicketForDisplayTextAndImages(tickeRes);
                    }
                    navigation.goBack();
                    // navigation.navigate("TicketListScreen", {
                    //   isRefresh: true,
                    // }),
                  },
                },
              ],
              { cancelable: false }
            );
          } else {
            Alert.alert(
              "",
              "Ticket created successfully",
              [{ text: "OK", onPress: () => navigation.goBack() }],
              { cancelable: false }
            );
          }
        }
      }
    }
  };

  const showAlertToRemoveImage = (index, item) => {
    Alert.alert(
      "",
      "Are you sure you want to delete the image?",
      [
        { text: "Cancel", onPress: () => console.log("Cancel Pressed!") },
        { text: "OK", onPress: () => removeTicketImage(index, item) },
      ],
      { cancelable: false }
    );
  };

  const removeTicketImage = async (index, item) => {
    if (isConnected) {
      if (item?.Id === 0) {
        const newImageArray = [...images];
        newImageArray.splice(index, 1); // Remove the input at the specified index
        setImages(newImageArray);
      } else {
        //Call delete image  API
        let inputObj = {
          Id: ticketDetails?.Id,
          CompanyId: ticketDetails?.CompanyId,
          ImageId: item?.Id,
        };
        await deleteTicketImage(inputObj);
      }
    } else {
      const newImageArray = [...images];
      newImageArray.splice(index, 1); // Remove the input at the specified index
      setImages(newImageArray);
      dispatch(updateTicketImage(newImageArray));

      const updatedObject = { ...ticketDetails };
      updatedObject["Images"] = newImageArray;
      updatedObject["images"] = newImageArray;

      let ticketObj = { updatedObject: updatedObject, index: index };
      dispatch(updateTicketInOffline(ticketObj));

      //Save API params in Async storage for sync
      let deleteTicketInput = await AsyncStorage.getItem("offlineSync");
      if (deleteTicketInput !== null) {
        let deleteTicketArray: [] = JSON.parse(deleteTicketInput);

        let offlineInput = {
          apiName: `${COMPANIES}/${selectedCompany?.Id}/${TICKETS}/${ticket?.Id}/${IMAGES}/${item?.Id}`,
          method: "DELETE",
        };

        deleteTicketArray = deleteTicketArray.concat(offlineInput);

        await AsyncStorage.setItem(
          "offlineSync",
          JSON.stringify(deleteTicketArray)
        );
      } else {
        let deleteTicketArray = [];
        let offlineInput = {
          apiName: `${COMPANIES}/${selectedCompany?.Id}/${TICKETS}/${ticket?.Id}/${IMAGES}/${item?.Id}`,
          inputParams: {},
          method: "DELETE",
        };

        deleteTicketArray.push(offlineInput);

        await AsyncStorage.setItem(
          "offlineSync",
          JSON.stringify(deleteTicketArray)
        );
      }

      Utility.showAlert("", "Image Deleted Successfully in offline");
    }
  };

  const validation = () => {
    for (let index = 0; index < inputValues.length; index++) {
      const element = inputValues[index];
      if (element == 0 || element == "") {
        Utility.showAlert("", "Quantity is Required");
        return false;
      }else if (element >= 60) {
        Utility.showAlert("", "Quantity should not be greater than 60");
        return false;
      }
    }
    if (locationValue == null) {
      Utility.showAlert("", "Location is Required");
      return false;
    } else if (customerValue == null) {
      Utility.showAlert("", "Customer is Required");

      return false;
    } else if (productValue == null) {
      Utility.showAlert("", "Material is Required");

      return false;
    } else if (quantityTypeValue == null) {
      Utility.showAlert("", "Quantity type is Required");

      return false;
    } else if (truckNumValue == "") {
      Utility.showAlert("", "Truck Number is Required");

      return false;
    } else if (truckTypeValue == null) {
      Utility.showAlert("", "Truck Type is Required");

      return false;
    } else if (poValue == "") {
      Utility.showAlert("", "PO Number is Required");

      return false;
    } else if (projectsValue == null) {
      Utility.showAlert("", "Project is Required");

      return false;
    } else if (images.length == 0) {
      Utility.showAlert("", "Ticket Images is Required");

      return false;
    } else {
      return true;
    }
  };

  const createTicketPressed = async () => {
    if (validation()) {
      if (isEdit) {
        if (isConnected) {
          let inputDic = {
            Id: ticketDetails?.Id,
            InvoiceId: ticketDetails?.InvoiceId,
            UserId: userResponse.Id,
            CompanyId: companyValue,
            LocationId: locationValue,
            CustomerId: customerValue,
            ProjectId: projectsValue,
            ProductId: productValue,
            TruckTypeId: truckTypeValue,
            Date: ticketDetails?.Date, //"2023-10-17",
            UnitId: quantityTypeValue,
            TruckNum: truckNumValue,
            TicketNum: ticketDetails?.TicketNum,
            PONum: poValue,
            Quantities: inputValues,
            Rate: ticketDetails?.Rate,
            Latitude: coordinates.Latitude,
            Longitude: coordinates.Longitude,
            Deleted: false,
            Api: true,
            Images: ticketDetails?.Images,
          };

          console.log("inputDic", inputDic);
          await updateTicket(inputDic);
        } else {
          updateTicketInfoInOffline();
        }
      } else {
        if (isConnected) {
          let inputDic = {
            Id: 0,
            InvoiceId: 0,
            UserId: userResponse.Id,
            CompanyId: companyValue,
            LocationId: locationValue,
            CustomerId: customerValue,
            ProjectId: projectsValue,
            ProductId: productValue,
            TruckTypeId: truckTypeValue,
            Date: moment().format("YYYY-MM-DD"), //"2023-10-17",
            UnitId: quantityTypeValue,
            TruckNum: truckNumValue,
            TicketNum: ticketNum,
            PONum: poValue,
            Quantities: inputValues,
            Rate: 0,
            Latitude: coordinates.Latitude,
            Longitude: coordinates.Longitude,
            Deleted: false,
            Api: true,
            Images: [],
          };

          console.log("inputDic", inputDic);
          await createTicket(inputDic);
        } else {
          addTicketInfoInOffline();
        }
      }
    }
  };

  const updateTicketInfoInOffline = async () => {
    setIsImageUploadLoading(true);

    let inputDic = {
      Id: ticketDetails?.Id,
      InvoiceId: ticketDetails?.InvoiceId,
      UserId: userResponse.Id,
      CompanyId: companyValue,
      LocationId: locationValue,
      CustomerId: customerValue,
      ProjectId: projectsValue,
      ProductId: productValue,
      TruckTypeId: truckTypeValue,
      Date: ticketDetails?.Date, //"2023-10-17",
      UnitId: quantityTypeValue,
      TruckNum: truckNumValue,
      TicketNum: ticketDetails?.TicketNum,
      PONum: poValue,
      Quantities: inputValues,
      Rate: ticketDetails?.Rate,
      Latitude: coordinates.Latitude,
      Longitude: coordinates.Longitude,
      Deleted: false,
      Api: true,
      Images: [],
      images: images,
      index: ticketIndex,
      units: quantityTypeValue,
    };

    //Save API params in Async storage for sync
    let createTicketInput = await AsyncStorage.getItem("offlineSync");
    if (createTicketInput !== null) {
      let createTicketArray: [] = JSON.parse(createTicketInput);

      let offlineInput = {
        apiName: `${COMPANIES}/${inputDic.CompanyId}/${TICKETS}/${inputDic?.Id}`,
        inputParams: JSON.stringify(inputDic),
        method: "PATCH",
      };

      createTicketArray = createTicketArray.concat([offlineInput]);

      await AsyncStorage.setItem(
        "offlineSync",
        JSON.stringify(createTicketArray)
      );
    } else {
      let createTicketArray = [];
      let offlineInput = {
        apiName: `${COMPANIES}/${inputDic.CompanyId}/${TICKETS}/${inputDic?.Id}`,
        inputParams: JSON.stringify(inputDic),
        method: "PATCH",
      };

      createTicketArray.push(offlineInput);

      await AsyncStorage.setItem(
        "offlineSync",
        JSON.stringify(createTicketArray)
      );
    }

    //Save ticket image for sync
    console.log("images =====", images);
    if (images.length) {
      let createTicketInputImage = await AsyncStorage.getItem("offlineSync");
      if (createTicketInputImage !== null) {
        let createTicketImageArray: [] = JSON.parse(createTicketInputImage);

        let inputTicketImage = [];
        for (let index = 0; index < images.length; index++) {
          try {
            const image = images[index];

            const base64 = await fs.readFile(image.uri, "base64");
            if (base64 != null) {
              let offlineInput = {
                apiName: `${TICKETS}/${inputDic?.Id}/${IMAGES}`,
                inputParams: base64,
                method: "PATCH",
              };

              inputTicketImage.push(offlineInput);
            }
          } catch (e) {
            console.log("Error Image not found : " + e);
          }
        }
        createTicketImageArray =
          createTicketImageArray.concat(inputTicketImage);
        if (
          createTicketImageArray != null &&
          createTicketImageArray.length > 0
        ) {
          await AsyncStorage.setItem(
            "offlineSync",
            JSON.stringify(createTicketImageArray)
          );
        }
      } else {
        let inputTicketImage = [];

        for (let index = 0; index < images.length; index++) {
          try {
            const image = images[index];

            const base64 = await fs.readFile(image.uri, "base64");
            if (base64 != null) {
              let offlineInput = {
                apiName: `${TICKETS}/${inputDic?.Id}/${IMAGES}`,
                inputParams: base64,
                method: "PATCH",
              };

              inputTicketImage.push(offlineInput);
            }
          } catch (e) {
            console.log("Error Image not found : " + e);
          }
        }
        if (inputTicketImage != null && inputTicketImage.length > 0) {
          await AsyncStorage.setItem(
            "offlineSync",
            JSON.stringify(inputTicketImage)
          );
        }
      }
    }

    //Update the ticket object in ticket list array
    console.log("ticketIndex ", ticketIndex);
    console.log("inputDic ", inputDic);

    let ticketObj = { updatedObject: inputDic, index: ticketIndex };
    dispatch(updateTicketInOffline(ticketObj));
    setIsImageUploadLoading(false);

    Alert.alert(
      "",
      "Ticket updated successfully in Offline",
      [
        {
          text: "OK",
          onPress: () => {
            if (inputDic) {
              formTicketForDisplayTextAndImages(inputDic);
            }
            navigation.goBack();
          },
          //navigation.navigate("TicketListScreen", { isRefresh: true }),
        },
      ],
      { cancelable: false }
    );
  };

  const addTicketInfoInOffline = async () => {
    setIsImageUploadLoading(true);

    let inputDic = {
      Id: ticketNum,
      InvoiceId: 0,
      UserId: userResponse.Id,
      CompanyId: companyValue,
      LocationId: locationValue,
      CustomerId: customerValue,
      ProjectId: projectsValue,
      ProductId: productValue,
      TruckTypeId: truckTypeValue,
      Date: moment().format("YYYY-MM-DD"), //"2023-10-17",
      UnitId: quantityTypeValue,
      TruckNum: truckNumValue,
      TicketNum: ticketNum,
      PONum: poValue,
      Quantities: inputValues,
      Rate: 0,
      Latitude: coordinates.Latitude,
      Longitude: coordinates.Longitude,
      Deleted: false,
      Api: false,
      Images: ticketDetails?.Images,
    };

    //Save API params in Async storage for sync
    let createTicketInput = await AsyncStorage.getItem("offlineSync");
    if (createTicketInput !== null) {
      let createTicketArray: [] = JSON.parse(createTicketInput);

      let offlineInput = {
        apiName: `${COMPANIES}/${inputDic.CompanyId}/${TICKETS}`,
        inputParams: JSON.stringify(inputDic),
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
        apiName: `${COMPANIES}/${inputDic.CompanyId}/${TICKETS}`,
        inputParams: JSON.stringify(inputDic),
        method: "POST",
      };

      createTicketArray.push(offlineInput);

      await AsyncStorage.setItem(
        "offlineSync",
        JSON.stringify(createTicketArray)
      );
    }

    //Save ticket image for sync

    if (images.length) {
      let createTicketInputImage = await AsyncStorage.getItem("offlineSync");
      if (createTicketInputImage !== null) {
        let createTicketImageArray: [] = JSON.parse(createTicketInputImage);

        let inputTicketImage = [];
        for (let index = 0; index < images.length; index++) {
          const image = images[index];
          const base64 = await fs.readFile(image.uri, "base64");
          let offlineInput = {
            apiName: `${TICKETS}/${inputDic?.Id}/${IMAGES}`,
            inputParams: base64,
            method: "POST",
            ticketNum: inputDic?.Id,
          };

          inputTicketImage.push(offlineInput);
        }
        createTicketImageArray =
          createTicketImageArray.concat(inputTicketImage);
        console.log("createTicketImageArray", createTicketImageArray);

        await AsyncStorage.setItem(
          "offlineSync",
          JSON.stringify(createTicketImageArray)
        );
      } else {
        let inputTicketImage = [];

        for (let index = 0; index < images.length; index++) {
          const image = images[index];

          const base64 = await fs.readFile(image.uri, "base64");

          let offlineInput = {
            apiName: `${TICKETS}/${inputDic?.Id}/${IMAGES}`,
            inputParams: base64,
            method: "POST",
            ticketNum: inputDic?.Id,
          };

          inputTicketImage.push(offlineInput);
        }

        await AsyncStorage.setItem(
          "offlineSync",
          JSON.stringify(inputTicketImage)
        );
      }
    }

    setIsImageUploadLoading(false);

    Alert.alert(
      "",
      "Ticket created successfully in Offline",
      [{ text: "OK", onPress: () => navigation.goBack() }],
      { cancelable: false }
    );

    //Update Ticket list array in offline
    dispatch(setTicketsListArrayForOffline({ ...inputDic, images: images }));

    const offlineDashboardTicketCount =
      store.getState().dashboard.offlineTicketCount;

    //Update dashboard ticket count in offline
    console.log("offlineDashboardTicketCount", offlineDashboardTicketCount);

    let offlineTicketCount = offlineDashboardTicketCount + 1;
    dispatch(setDashboardOfflineTicketCount(offlineTicketCount));

    //Update Dashboard company list in offline
    customersResponse.map((item, index) => {
      if (item.Id === inputDic.CustomerId) {
        let updatedObject = {
          ...item,
          DayTicketCount: item?.DayTicketCount + 1,
        }; // Create a new object with the updated age
        dispatch(
          updateDashboardCustomersInOffline({
            updatedObject: updatedObject,
            index: index,
          })
        );
      }
    });

    //Update master company list in offline
    masterCustomersResponse.map((item, index) => {
      if (item.Id === inputDic.CustomerId) {
        let updatedObject = {
          ...item,
          DayTicketCount: item?.DayTicketCount + 1,
        }; // Create a new object with the updated age
        dispatch(
          updateMasterCustomersInOffline({
            updatedObject: updatedObject,
            index: index,
          })
        );
      }
    });
  };

  const renderItem = ({ item, index }) => {
    console.log("item===", item);
    return (
      <View
        style={{
          width: 80,
          height: 80,
          marginVertical: 10,
          marginHorizontal: 5,
          borderRadius: 5,
        }}
      >
        <Image
          style={{
            width: 80,
            height: 80,
            borderRadius: 5,
          }}
          source={{ uri: item.uri }}
        />
        <TouchableOpacity onPress={() => showAlertToRemoveImage(index, item)}>
          <Text style={{ color: "red", textAlign: "center" }}>Remove</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const handleTextFieldFocus = () => {
    if (companyDropdownOpen) {
      setCompanyDropdownOpen(false);
    }
    if (customerDropdownOpen) {
      setCustomerDropdownOpen(false);
    }
    if (locationDropdownOpen) {
      setLocationDropdownOpen(false);
    }
    if (productsDropdownOpen) {
      setLProductsDropdownOpen(false);
    }
    if (projectsDropdownOpen) {
      setProjectsDropdownOpen(false);
    }
    if (quantityTypeDropdownOpen) {
      setQuantityTypeDropdownOpen(false);
    }
    if (truckTypeDropdownOpen) {
      setTruckTypeDropdownOpen(false);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLOR.VIEW_BG,
        flexDirection: "column",
      }}
    >
      <CreateTicketHeader
        isEdit={isEdit}
        isOnline={isConnected}
      ></CreateTicketHeader>

      {Platform.OS == "macos" || Platform.OS === "windows" ? (
        <>
          <View
            style={{
              marginVertical: 20,
              backgroundColor: COLOR.VIEW_BG,
              flexDirection: "row",
              marginHorizontal: 20,
            }}
          >
            {/* <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#EAF0FB",
                borderColor: "lightgray",
                borderWidth: 1,
                borderTopLeftRadius: 10,
                borderBottomLeftRadius: 10,
                flex: 0.11,
                height: 50,
              }}
            >
              <Image
                style={{ width: 25, height: 25 }}
                source={require("../../assets/imgCompany.png")}
              />
            </View>
            <View style={styles.pickerContainer}>
              <DropDownPicker
                style={{
                  backgroundColor: COLOR.WHITE,
                  borderColor: "lightgray",
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0,
                  flex: 1,
                }}
                placeholder="Company"
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
                items={companyResponse ? companyResponse : []}
                open={companyDropdownOpen}
                setOpen={onOpenCompanyPicker}
                value={companyValue}
                setValue={setCompanyValue}
                onChangeValue={(value) => {
                  console.log("value", value);
                  // locationValChanged(value);
                }}
              />
            </View> */}

            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#EAF0FB",
                borderColor: "lightgray",
                borderWidth: 1,
                borderTopLeftRadius: 10,
                borderBottomLeftRadius: 10,
                // flex: 0.1,
                width: 50,
                height: 50,
                // marginLeft: 20,
              }}
            >
              <Image
                style={{ width: 25, height: 25 }}
                source={require("../../assets/imgLocation.png")}
              />
            </View>
            <View style={styles.pickerContainer}>
              <DropDownPicker
                style={{
                  backgroundColor: COLOR.WHITE,
                  borderColor: "lightgray",
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0,
                  flex: 1,
                }}
                containerStyle={{ flex: 1.9 }}
                placeholder="Location"
                placeholderStyle={{
                  color: "grey",
                  fontWeight: "400",
                }}
                schema={{
                  label: "SiteName",
                  value: "Id",
                }}
                dropDownContainerStyle={{
                  borderColor: "lightgray",
                  zIndex: -1,
                }}
                items={locationsResponse ? locationsResponse : []}
                open={locationDropdownOpen}
                setOpen={onOpenLocationPicker}
                value={locationValue}
                setValue={setLocationValue}
                onChangeValue={(value) => {
                  console.log("value", value);
                  locationValChanged(value);
                }}
                min={2}
              />
            </View>
          </View>

          <View
            style={{
              backgroundColor: COLOR.VIEW_BG,
              flexDirection: "row",
              marginVertical: 20,
              zIndex: -1,
              marginHorizontal: 20,
            }}
          >
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#EAF0FB",
                borderColor: "lightgray",
                borderWidth: 1,
                borderTopLeftRadius: 10,
                borderBottomLeftRadius: 10,
                flex: 0.11,
                height: 50,
              }}
            >
              <Image
                style={{ width: 25, height: 25 }}
                source={require("../../assets/imgCustomer.png")}
              />
            </View>
            <View style={styles.pickerContainer}>
              <DropDownPicker
                style={{
                  backgroundColor: COLOR.WHITE,
                  borderColor: "lightgray",
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0,
                  flex: 1,
                }}
                placeholder="Customer"
                placeholderStyle={{
                  color: "grey",
                  fontWeight: "400",
                }}
                schema={{
                  label: "Name",
                  value: "Id",
                }}
                dropDownContainerStyle={{ borderColor: "lightgray" }}
                items={customersResponse ? customersResponse : []}
                open={customerDropdownOpen}
                setOpen={setCustomerDropdownOpen}
                value={customerValue}
                setValue={setCustomerValue}
                onChangeValue={(value) => {
                  console.log("value", value);
                  customerValChanged(value);
                }}
              />
            </View>

            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#EAF0FB",
                borderColor: "lightgray",
                borderWidth: 1,
                borderTopLeftRadius: 10,
                borderBottomLeftRadius: 10,
                flex: 0.11,
                height: 50,
                zIndex: -1,
                marginLeft: 20,
              }}
            >
              <Image
                style={{ width: 25, height: 25 }}
                source={require("../../assets/imgMaterial.png")}
              />
            </View>
            <View style={styles.pickerContainer}>
              <DropDownPicker
                style={{
                  backgroundColor: COLOR.WHITE,
                  borderColor: "lightgray",
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0,
                  flex: 1,
                }}
                containerStyle={{ flex: 1.9 }}
                placeholder="Material"
                placeholderStyle={{
                  color: "grey",
                  fontWeight: "400",
                }}
                schema={{
                  label: "Name",
                  value: "Id",
                }}
                dropDownContainerStyle={{ borderColor: "lightgray" }}
                items={productsResponse ? productsResponse : []}
                open={productsDropdownOpen}
                setOpen={onOpenProductsPicker}
                value={productValue}
                disabled={!locationValue}
                setValue={setProductValue}
                //
              />
            </View>
          </View>

          <View
            style={{
              backgroundColor: COLOR.VIEW_BG,
              flexDirection: "row",
              marginVertical: 20,
              zIndex: -5,
              marginHorizontal: 20,
            }}
          >
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#EAF0FB",
                borderColor: "lightgray",
                borderWidth: 1,
                borderTopLeftRadius: 10,
                borderBottomLeftRadius: 10,
                height: 50,
                width: 50,
              }}
            >
              <Image
                style={{ width: 25, height: 25 }}
                source={require("../../assets/imgQuantity.png")}
              />
            </View>

            <View style={{ flex: 1, flexDirection: "row" }}>
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
                  flex: 0.3,
                }}
                placeholder="Enter Quantity #"
                placeholderTextColor={"grey"}
                value={quantityValue}
                maxLength={5}
                onFocus={handleTextFieldFocus}
                onChangeText={(value) => {
                  setQuantityValue(value.replace(/[^0-9, .]/g, ""));
                }}
              ></TextInput>
              <View style={{ flex: 0.6 }}>
                <DropDownPicker
                  style={{
                    backgroundColor: COLOR.WHITE,
                    borderColor: "lightgray",
                    marginLeft: 5,
                  }}
                  containerStyle={{}}
                  placeholder="Quantity Type"
                  placeholderStyle={{
                    color: "grey",
                    fontWeight: "400",
                  }}
                  schema={{
                    label: "Name",
                    value: "Id",
                  }}
                  dropDownContainerStyle={{ borderColor: "lightgray" }}
                  items={quantityResponse ? quantityResponse : []}
                  open={quantityTypeDropdownOpen}
                  setOpen={onOpenQuantityTypePicker}
                  value={quantityTypeValue}
                  setValue={setQuantityTypeValue}
                  onChangeValue={(value) => {
                    console.log("quantityTypeValue ==", value);
                  }}
                />
              </View>

              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#EAF0FB",
                  borderColor: "lightgray",
                  borderWidth: 1,
                  borderTopLeftRadius: 10,
                  borderBottomLeftRadius: 10,
                  height: 50,
                  width: 50,
                  marginLeft: 30,
                }}
              >
                <Image
                  style={{ width: 25, height: 25 }}
                  source={require("../../assets/imgTruck.png")}
                />
              </View>
              <View style={{ flex: 1, flexDirection: "row" }}>
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
                    flex: 0.3,
                  }}
                  maxLength={10}
                  value={truckNumValue}
                  onFocus={handleTextFieldFocus}
                  onChangeText={(value) => {
                    setTruckNumValue(value);
                  }}
                  placeholder="Enter Truck #"
                  placeholderTextColor={"grey"}
                ></TextInput>

                <View style={{ flex: 0.69 }}>
                  <DropDownPicker
                    style={{
                      backgroundColor: COLOR.WHITE,
                      borderColor: "lightgray",
                      marginLeft: 5,
                      // borderTopLeftRadius: 0,
                      // borderBottomLeftRadius: 0,
                    }}
                    placeholder="Truck Type"
                    placeholderStyle={{
                      color: "grey",
                      fontWeight: "400",
                    }}
                    schema={{
                      label: "Name",
                      value: "Id",
                    }}
                    dropDownContainerStyle={{ borderColor: "lightgray" }}
                    items={truckTypeResponse}
                    open={truckTypeDropdownOpen}
                    setOpen={setTruckTypeDropdownOpen}
                    value={truckTypeValue}
                    setValue={setTruckTypeValue}
                    //
                  />
                </View>
              </View>
            </View>
          </View>

          <View
            style={{
              marginVertical: 20,
              backgroundColor: COLOR.VIEW_BG,
              flexDirection: "row",
              zIndex: -10,
            }}
          >
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#EAF0FB",
                borderColor: "lightgray",
                borderWidth: 1,
                borderTopLeftRadius: 10,
                borderBottomLeftRadius: 10,
                flex: 0.1,
                height: 50,
              }}
            >
              <Image
                style={{ width: 25, height: 25 }}
                source={require("../../assets/imgProject.png")}
              />
            </View>
            <View style={styles.pickerContainer}>
              <DropDownPicker
                style={{
                  backgroundColor: COLOR.WHITE,
                  borderColor: "lightgray",
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0,
                }}
                containerStyle={{ flex: 1.9 }}
                placeholder="Project"
                placeholderStyle={{
                  color: "grey",
                  fontWeight: "400",
                }}
                schema={{
                  label: "Name",
                  value: "Id",
                }}
                disabled={!customerValue}
                dropDownContainerStyle={{ borderColor: "lightgray" }}
                items={projectsResponse ? projectsResponse : []}
                open={projectsDropdownOpen}
                setOpen={onOpenProjectsPicker}
                value={projectsValue}
                setValue={setProjectsValue}
                //
              />
            </View>

            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: COLOR.WHITE,
                flexDirection: "row",
                marginLeft: 20,
                borderColor: "gray",
                borderWidth: 1,
                borderRadius: 10,
                alignItems: "center",
                justifyContent: "center",
                height: 50,
                borderStyle: "dashed",
              }}
            >
              <Image
                style={{ width: 25, height: 25 }}
                source={require("../../assets/imgUploadImage.png")}
              />

              <Text
                style={{ textAlign: "center", color: "black", fontSize: 16 }}
              >
                Upload Image
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              marginTop: 20,
              marginHorizontal: 20,
              flexDirection: "row",
              zIndex: -40,
              flex: 1,
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              style={{
                flex: 1,
                marginHorizontal: 10,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: COLOR.VIEW_BG,
                borderRadius: 10,
                borderColor: "black",
                borderWidth: 1,
                height: 50,
              }}
              onPress={() => navigation.goBack()}
            >
              <Text style={{ fontSize: 15, color: "black", fontWeight: "400" }}>
                {" "}
                Cancel{" "}
              </Text>
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <CustomButton
                text={isEdit ? "Save" : "Create"}
                onPress={createTicketPressed}
                bgColor={COLOR.BLUE}
                btnLoading={createTicketLoading}
              />
            </View>
          </View>
        </>
      ) : (
        <KeyboardAwareScrollView>
          <View
            style={{
              flex: 1,
              marginTop: 20,
              backgroundColor: COLOR.VIEW_BG,
              flexDirection: "row",
              marginHorizontal: 20,
              marginRight: 20,
              zIndex: -5,
            }}
          >
            <View style={styles.image}>
              <Image
                style={{ width: 25, height: 25 }}
                source={require("../../assets/imgLocation.png")}
              />
            </View>
            <View style={styles.pickerContainer}>
              <DropDownPicker
                style={{
                  backgroundColor: COLOR.WHITE,
                  borderColor: "lightgray",
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0,
                }}
                containerStyle={{ flex: 1.9 }}
                autoScroll={true}
                placeholder={
                  "Location"
                  // <View

                  //   style={{
                  //     flexDirection: "row",
                  //     alignItems: "center",
                  //     marginTop: 5,
                  //   }}
                  // >
                  //   <Text>Location</Text>
                  //   <Text style={{ color: "red" }}>*</Text>
                  // </View>
                }
                placeholderStyle={{
                  color: "grey",
                  fontWeight: "400",
                }}
                schema={{
                  label: "SiteName",
                  value: "Id",
                }}
                dropDownContainerStyle={{ borderColor: "lightgray" }}
                items={locationsResponse}
                open={locationDropdownOpen}
                setOpen={onOpenLocationPicker}
                value={locationValue}
                setValue={setLocationValue}
                onChangeValue={(value) => {
                  console.log("value", value);
                  locationValChanged(value);
                }}
                maxHeight={150}
              />
            </View>
          </View>

          <View
            style={{
              flex: 1,
              marginTop: 20,
              backgroundColor: COLOR.VIEW_BG,
              flexDirection: "row",
              marginHorizontal: 20,
              marginRight: 20,
              zIndex: -10,
            }}
          >
            <View style={styles.image}>
              <Image
                style={{ width: 25, height: 25 }}
                source={require("../../assets/imgCustomer.png")}
              />
            </View>
            <View style={styles.pickerContainer}>
              <DropDownPicker
                style={{
                  backgroundColor: COLOR.WHITE,
                  borderColor: "lightgray",
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0,
                }}
                containerStyle={{ flex: 1.9 }}
                autoScroll={true}
                placeholder={
                  "Customer"
                  // <View
                  //   style={{
                  //     flexDirection: "row",
                  //     alignItems: "center",
                  //     marginTop: 5,
                  //   }}
                  // >
                  //   <Text>Customer</Text>
                  //   <Text style={{ color: "red" }}>*</Text>
                  // </View>
                }
                placeholderStyle={{
                  color: "grey",
                  fontWeight: "400",
                }}
                schema={{
                  label: "Name",
                  value: "Id",
                }}
                dropDownContainerStyle={{ borderColor: "lightgray" }}
                items={customersResponse}
                open={customerDropdownOpen}
                setOpen={onOpenCustomerPicker}
                value={customerValue}
                setValue={setCustomerValue}
                onChangeValue={(value) => {
                  console.log("value customer", value);
                  customerValChanged(value);
                }}
                // searchable={true}
                // searchPlaceholder="Enter Customer name"
                maxHeight={150}
              />
            </View>
          </View>
          <View
            style={{
              flex: 1,
              marginTop: 20,
              backgroundColor: COLOR.VIEW_BG,
              flexDirection: "row",
              marginHorizontal: 20,
              marginRight: 20,
              zIndex: -15,
            }}
          >
            <View style={styles.image}>
              <Image
                style={{ width: 25, height: 25 }}
                source={require("../../assets/imgMaterial.png")}
              />
            </View>
            <View style={styles.pickerContainer}>
              <DropDownPicker
                style={{
                  backgroundColor: COLOR.WHITE,
                  borderColor: "lightgray",
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0,
                  zIndex: -1,
                }}
                containerStyle={{ flex: 1.9 }}
                autoScroll={true}
                // searchable={true}
                // searchPlaceholder="Enter Material name"
                placeholder={
                  "Material"
                  // <View
                  //   style={{
                  //     flexDirection: "row",
                  //     alignItems: "center",
                  //     marginTop: 5,
                  //   }}
                  // >
                  //   <Text>Material</Text>
                  //   <Text style={{ color: "red" }}>*</Text>
                  // </View>
                }
                placeholderStyle={{
                  color: "grey",
                  fontWeight: "400",
                }}
                schema={{
                  label: "Name",
                  value: "Id",
                }}
                // disabled={!locationValue}
                dropDownContainerStyle={{ borderColor: "lightgray" }}
                items={searchProductsResponse}
                value={productValue}
                open={productsDropdownOpen}
                setOpen={onOpenProductsPicker}
                setValue={setProductValue}
                onChangeValue={(value) => {
                  console.log("value material", value);
                  console.log("productValue", productValue);
                  materialvalChanged(value);
                }}
                maxHeight={150}
              />
            </View>
          </View>

          {inputValues.map((value, index) => (
            <View
              style={{
                flex: 1,
                marginTop: 20,
                backgroundColor: COLOR.VIEW_BG,
                flexDirection: "row",
                marginHorizontal: 20,
                marginRight: 20,
                zIndex: -40,
                height: 50,
              }}
            >
              <View style={styles.image}>
                <Image
                  style={{ width: 25, height: 25 }}
                  source={require("../../assets/imgQuantity.png")}
                />
              </View>
              <View
                style={{
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0,
                  borderTopRightRadius: 10,
                  borderBottomRightRadius: 10,
                  borderWidth: 1,
                  borderColor: "lightgray",
                  flex: 1,
                  flexDirection: "row",
                }}
              >
                <TextInput
                  style={{
                    backgroundColor: COLOR.WHITE,
                    paddingLeft: 10,
                    flex: 0.8,
                  }}
                  value={value}
                  onFocus={handleTextFieldFocus}
                  onChangeText={(value) => {
                    handleInputChange(value, index);
                  }}
                  placeholder={
                    quantityTypeName !== null
                      ? `${"Qty"} ${index + 1} / ${quantityTypeName}`
                      : `${"Qty"} ${index + 1}`
                  }
                  maxLength={6}
                  editable={quantityTypeValue !== 2}
                  keyboardType={
                    quantityTypeValue == "3"
                      ? "numbers-and-punctuation"
                      : Platform.OS === "android"
                      ? "numeric"
                      : "number-pad"
                  }
                  placeholderTextColor={"grey"}
                ></TextInput>

                <View
                  style={
                    (styles.pickerContainer,
                    { backgroundColor: COLOR.WHITE, flex: 0.2 })
                  }
                >
                  {index == 0 ? (
                    <TouchableOpacity
                      style={{
                        alignItems: "flex-end",
                        justifyContent: "center",
                        flex: 1,
                      }}
                      onPress={() => onAddTrailerQtyPressed()}
                    >
                      <Image
                        style={{ width: 25, height: 25, marginRight: 10 }}
                        source={require("../../assets/imgTrailerAdd.png")}
                      />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={{
                        alignItems: "flex-end",
                        justifyContent: "center",
                        flex: 1,
                      }}
                      onPress={() => onRemoveTrailerQtyPressed(index)}
                    >
                      <Image
                        style={{ width: 25, height: 25, marginRight: 10 }}
                        source={require("../../assets/imgTrailerRemove.png")}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          ))}

          <View
            style={{
              flex: 1,
              marginTop: 20,
              backgroundColor: COLOR.VIEW_BG,
              flexDirection: "row",
              marginHorizontal: 20,
              marginRight: 20,
              height: 50,
              zIndex: -55,
            }}
          >
            <View style={styles.image}>
              <Image
                style={{ width: 25, height: 25 }}
                source={require("../../assets/imgTruck.png")}
              />
            </View>
            <View style={(styles.pickerContainer, { flex: 0.45 })}>
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
                  height: 50,
                }}
                value={truckNumValue}
                maxLength={10}
                onFocus={handleTextFieldFocus}
                onChangeText={(value) => {
                  setTruckNumValue(value);
                }}
                keyboardType={
                  Platform.OS === "android" ? "numeric" : "number-pad"
                }
                placeholder="Truck #"
                placeholderTextColor={"grey"}
              ></TextInput>
            </View>

            <View
              style={(styles.pickerContainer, { flex: 0.5, marginLeft: 5 })}
            >
              <DropDownPicker
                style={{
                  backgroundColor: COLOR.WHITE,
                  borderColor: "lightgray",
                  // borderTopLeftRadius: 0,
                  // borderBottomLeftRadius: 0,
                }}
                containerStyle={{ flex: 1.9 }}
                autoScroll={true}
                placeholder={
                  "Truck Type"
                  // <View
                  //   style={{
                  //     flexDirection: "row",
                  //     alignItems: "center",
                  //     marginTop: 5,
                  //   }}
                  // >
                  //   <Text>Truck Type</Text>
                  //   <Text style={{ color: "red" }}>*</Text>
                  // </View>
                }
                placeholderStyle={{
                  color: "grey",
                  fontWeight: "400",
                }}
                schema={{
                  label: "Name",
                  value: "Id",
                }}
                dropDownContainerStyle={{ borderColor: "lightgray" }}
                items={truckTypeResponse}
                open={truckTypeDropdownOpen}
                setOpen={onOpenTruckTypePicker}
                value={truckTypeValue}
                setValue={setTruckTypeValue}
                maxHeight={150}
                //
              />
            </View>
          </View>
          <View
            style={{
              flex: 1,
              marginTop: 20,
              backgroundColor: COLOR.VIEW_BG,
              flexDirection: "row",
              marginHorizontal: 20,
              marginRight: 20,
              height: 50,
              zIndex: -60,
            }}
          >
            <View style={styles.image}>
              <Image
                style={{ width: 25, height: 25 }}
                source={require("../../assets/imgPO.png")}
              />
            </View>
            <View style={styles.pickerContainer}>
              <TextInput
                style={{
                  backgroundColor: COLOR.WHITE,
                  borderColor: "lightgray",
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0,
                  borderTopRightRadius: 10,
                  borderBottomRightRadius: 10,
                  flex: 1.9,
                  borderWidth: 1,
                  paddingLeft: 10,
                }}
                value={poValue}
                onFocus={handleTextFieldFocus}
                onChangeText={(value) => {
                  setPoValue(value);
                }}
                keyboardType={
                  Platform.OS === "android" ? "numeric" : "number-pad"
                }
                placeholder="PO #"
                placeholderTextColor={"grey"}
              ></TextInput>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              marginTop: 20,
              backgroundColor: COLOR.VIEW_BG,
              flexDirection: "row",
              marginHorizontal: 20,
              marginRight: 20,
              zIndex: -65,
            }}
          >
            <View style={styles.image}>
              <Image
                style={{ width: 25, height: 25 }}
                source={require("../../assets/imgProject.png")}
              />
            </View>
            <View style={styles.pickerContainer}>
              <DropDownPicker
                style={{
                  backgroundColor: COLOR.WHITE,
                  borderColor: "lightgray",
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0,
                }}
                containerStyle={{ flex: 1.9 }}
                autoScroll={true}
                placeholder={
                  "Project"
                  // <View
                  //   style={{
                  //     flexDirection: "row",
                  //     alignItems: "center",
                  //     marginTop: 5,
                  //   }}
                  // >
                  //   <Text>Project</Text>
                  //   <Text style={{ color: "red" }}>*</Text>
                  // </View>
                }
                placeholderStyle={{
                  color: "grey",
                  fontWeight: "400",
                }}
                schema={{
                  label: "Name",
                  value: "Id",
                }}
                dropDownContainerStyle={{ borderColor: "lightgray" }}
                items={searchProjectsResponse}
                // disabled={!customerValue}
                open={projectsDropdownOpen}
                setOpen={onOpenProjectsPicker}
                value={projectsValue}
                setValue={setProjectsValue}
                maxHeight={120}
              />
            </View>
          </View>
          {images.length < 4 ? (
            <TouchableOpacity
              style={{
                zIndex: -70,
                flex: 1,
                marginTop: 20,
                backgroundColor: COLOR.WHITE,
                flexDirection: "row",
                marginHorizontal: 20,
                marginRight: 20,
                borderColor: "gray",
                borderWidth: 1,
                borderRadius: 10,
                alignItems: "center",
                justifyContent: "center",
                height: 50,
                borderStyle: "dashed",
              }}
              onPress={() => {
                onPressGallery();
              }}
            >
              <Image
                style={{ width: 25, height: 25 }}
                source={require("../../assets/imgUploadImage.png")}
              />

              <Text
                style={{
                  textAlign: "center",
                  color: "black",
                  fontSize: 16,
                  marginLeft: 5,
                }}
              >
                Upload Image
              </Text>
            </TouchableOpacity>
          ) : null}

          {images.length ? (
            <View
              style={{
                height: 120,
                marginTop: 10,
                marginHorizontal: 20,
                zIndex: -70,
              }}
            >
              <FlatList
                style={{ height: 120 }}
                data={images}
                renderItem={renderItem}
                horizontal={true}
              />
            </View>
          ) : null}

          <View
            style={{
              marginHorizontal: 20,
              flexDirection: "row",
              zIndex: -75,
              flex: 1,
              marginTop: 15,
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              style={{
                flex: 1,
                marginHorizontal: 10,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: COLOR.VIEW_BG,
                borderRadius: 10,
                borderColor: "black",
                borderWidth: 1,
                height: 50,
              }}
              onPress={() => navigation.goBack()}
            >
              <Text style={{ fontSize: 15, color: "black", fontWeight: "400" }}>
                Cancel
              </Text>
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <CustomButton
                text={isEdit ? "Save" : "Create"}
                onPress={createTicketPressed}
                bgColor={COLOR.BLUE}
                btnLoading={
                  createTicketLoading ||
                  isImageUploadLoading ||
                  updateTicketLoading
                }
              />
            </View>
          </View>
        </KeyboardAwareScrollView>
      )}

      {isSyncLoading ? <SyncLoading isSyncLoading={isSyncLoading} /> : null}

      {updateTicketLoading ||
      deleteTicketImageLoading ||
      getTicketLoading ||
      getTicketImageLoading ? (
        <ActivityIndicator
          style={{
            flex: 1,
            position: "absolute",
            marginTop: windowHeight / 2,
            marginLeft: windowWidth / 2,
          }}
          animating={true}
          size="small"
          color={COLOR.BLUE}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    flex: 0.15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EAF0FB",
    borderColor: "lightgray",
    borderWidth: 1,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  pickerContainer: {
    flex: 1,
  },
  picker: {
    height: 50,
    width: 200,
  },
});
export default CreateTicketScreen;
