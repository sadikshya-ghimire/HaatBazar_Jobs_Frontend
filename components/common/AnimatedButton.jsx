import React, { useRef } from 'react';
import { Pressable, Animated, PressableProps } from 'react-native';

interface AnimatedButtonProps extends PressableProps {
  children: React.ReactNode;
  scale?: number;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({ 
  children, 
  scale = 0.95,
  onPress,
  ...props 
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: scale,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      {...props}
    >
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        {children}
      </Animated.View>
    </Pressable>
  );
};
