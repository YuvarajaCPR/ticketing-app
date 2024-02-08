import React from "react";
import { StyleSheet, TouchableOpacity, View, Animated } from "react-native";
import {
  Route,
  SceneRendererProps,
  NavigationState,
} from "react-native-tab-view";
import { COLOR } from "../Utils/Constants";
import { getScaleAxis } from "../Utils/Utility";

type PropsType = {
  navigationState?: SceneRendererProps & {
    navigationState: NavigationState<Route>;
  };
  index?: number;
  setIndex?: (i: number) => void;
  title: string;
  isMenu?: boolean;
  isBackIcon?: boolean;
  onTabPress?: (value: any) => void;
};

const TabBar = (props: PropsType) => {
  const {
    navigationState,
    index,
    setIndex,
    title,
    isMenu,
    onTabPress,
    isBackIcon,
  } = props || {};

  console.log("propsTab", props);
  const _renderBottomBorder = (tabIndex: number) =>
    tabIndex === index && <View style={styles.tabBottomBorder} />;

  const _renderTabBar = () => {
    const inputRange = navigationState.routes.map((x: any, i: number) => i);

    return (
      <>
        {" "}
        <View style={styles.tabBar}>
          {navigationState.routes.map((route: Route, i: number) => {
            const opacity = props.position.interpolate({
              inputRange,
              outputRange: inputRange.map((inputIndex: number) =>
                inputIndex === i ? 1 : 0.5
              ),
            });

            return (
              <TouchableOpacity
                key={route.key}
                style={styles.tabItem}
                onPress={() => {
                  if (onTabPress) {
                    onTabPress(navigationState.routes[i]);
                  }
                  if (setIndex) {
                    setIndex(i);
                  }
                }}
              >
                <View style={styles.tabInnerView}>
                  <Animated.Text
                    style={[
                      styles.tabTextStyle,
                      { color: COLOR.WHITE },
                      { opacity },
                    ]}
                  >
                    {route.title}
                  </Animated.Text>
                </View>
                {_renderBottomBorder(i)}
              </TouchableOpacity>
            );
          })}
        </View>
      </>
    );
  };

  return _renderTabBar();
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: COLOR.PRIMARY_1,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    height: getScaleAxis(62),
  },
  tabTextStyle: {
    fontStyle: "normal",
    fontWeight: "600",
    fontSize: getScaleAxis(13),
    lineHeight: getScaleAxis(16),
  },
  tabInnerView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tabBottomBorder: {
    width: "100%",
    height: getScaleAxis(5),
    borderTopLeftRadius: getScaleAxis(10),
    borderTopRightRadius: getScaleAxis(10),
    backgroundColor: COLOR.WHITE,
  },
  gap: {
    marginTop: getScaleAxis(20),
    // alignItems: "center",
  },
});

export default TabBar;
