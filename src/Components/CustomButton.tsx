/*************************************************
 * GOBOX
 * @exports
 * @component CustomButton.ts
 * Created by Deepak B on 01/07/2022
 * Copyright © 2022 GOBOX. All rights reserved.
 *************************************************/

import React, {FC} from 'react';
import {
  Text,
  StyleSheet,
  Pressable,
  GestureResponderEvent,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {COLOR, FONT_SIZE} from '../Utils/Constants';
interface Params {
  onPress: (event: GestureResponderEvent) => void;
  text: string;
  type?: string;
  bgColor?: any;
  fgColor?: any;
  btnLoading?: boolean;
  disabled?: boolean;
}

const CustomButton: FC<Params> = ({
  onPress,
  text,
  type = 'PRIMARY',
  bgColor,
  fgColor,
  btnLoading,
  disabled,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.container,
        styles[`container_${type}`],
        bgColor ? {backgroundColor: bgColor} : {},
        disabled && {backgroundColor: COLOR.CHECKBOX_OUTLINE},
      ]}>
      {btnLoading ? (
        <ActivityIndicator
          style={{alignSelf: 'center'}}
          size={21}
          color={'white'}
        />
      ) : (
        <Text
          style={[
            styles.text,
            styles[`text_${type}`],
            fgColor ? {color: fgColor} : {},
          ]}>
          {text}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 17,
    marginVertical: 5,
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  container_PRIMARY: {
    backgroundColor: '#ED1822',
  },
  container_SECONDARY: {
    borderColor: '#ED1822',
    borderWidth: 2,
  },
  container_TERTIARY: {},
  text: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: FONT_SIZE.S,
  },
  text_SECONDARY: {
    color: '#ED1822',
  },
  text_TERTIARY: {
    color: 'gray',
  },
});

export default CustomButton;
