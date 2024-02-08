import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';

const Snackbar = ({ message, duration = 3000, onDismiss, isError = false }) => {
  const [visible, setVisible] = useState(false);
  const translateY = new Animated.Value(0);

  useEffect(() => {
    if (visible) {
      Animated.timing(translateY, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();

      const timer = setTimeout(() => {
        hideSnackbar();
        if (typeof onDismiss === 'function') {
          onDismiss();
        }
      }, duration);

      return () => clearTimeout(timer);
    } else {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [visible]);

  const hideSnackbar = () => {
    setVisible(false);
  };

  return (
    <Animated.View
      style={{
        transform: [{ translateY: translateY.interpolate({ inputRange: [0, 1], outputRange: [100, 0] }) }],
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ color: 'white' }}>{message}</Text>
      <TouchableOpacity onPress={hideSnackbar} style={{ marginTop: 8 }}>
        <Text style={{ color: 'white', textDecorationLine: 'underline' }}>Dismiss</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default Snackbar;
