import { View, Text } from "react-native";
import React from "react";

const UserNameIcon = ({
  name = "",
  size = 42,
  font = 15,
}: {
  name: string;
  size?: number;
  font?: number;
}) => {
  return (
    <View
      style={{
        width: size,
        justifyContent: "center",
        alignItems: "center",
        height: size,
        backgroundColor:'#EFE0E0',
        borderRadius: size / 2,
      }}
    >
      <Text style={{ fontSize: font, color: "black" }}>
        {name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()}
      </Text>
    </View>
  );
};

export default UserNameIcon;
