import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const LoadingSpinner = ({ 
  size = 40, 
  color = '#447788' 
}) => {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View style={{ transform: [{ rotate: spin }] }}>
        <Ionicons name="sync" size={size} color={color} />
      </Animated.View>
    </View>
  );
};
