/*************************************************
 * AggMaps
 * Container
 * Created by Subashree on 03/10/2023
 * Copyright © 2023 AGGmaps. All rights reserved.
 *************************************************/

import React, { Fragment } from "react";
import { SafeAreaView, StatusBar } from "react-native";
import { COLOR } from "../Utils/Constants";

const Container = (props: any) => {
  return (
    <Fragment>
      <StatusBar barStyle={props.barStyle} />
      <SafeAreaView style={{ flex: 0, backgroundColor: props.topColor }} />
      <SafeAreaView style={{ flex: 1, backgroundColor: props.backgroundColor }}>
        {props.children}
      </SafeAreaView>
      <SafeAreaView style={{ flex: 0, backgroundColor: props.bottomColor }} />
    </Fragment>
  );
};

Container.defaultProps = {
  barStyle: "light-content",
  topColor: COLOR.VIEW_BG,
  backgroundColor: COLOR.VIEW_BG,
  bottomColor: COLOR.VIEW_BG,
};

export default Container;
