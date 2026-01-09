import React from 'react';
import { View, Text, Pressable, Modal, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

interface CustomAlertProps {
  visible: boolean;
  title: string;
  message: string;
  buttons?: AlertButton[];
  onDismiss?: () => void;
}

export const CustomAlert: React.FC<CustomAlertProps> = ({
  visible,
  title,
  message,
  buttons = [{ text: 'OK' }],
  onDismiss,
}) => {
  const handleButtonPress = (button: AlertButton) => {
    button.onPress?.();
    onDismiss?.();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View className="flex-1 justify-center items-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <View className="bg-white rounded-2xl mx-6 p-6 w-full max-w-sm" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8 }}>
          {/* Title */}
          <Text className="text-xl font-bold text-gray-800 mb-3">{title}</Text>
          
          {/* Message */}
          <Text className="text-gray-600 text-base mb-6 leading-6">{message}</Text>
          
          {/* Buttons */}
          <View className={`flex-${buttons.length > 1 ? 'row' : 'col'} gap-3`}>
            {buttons.map((button, index) => (
              <Pressable
                key={index}
                onPress={() => handleButtonPress(button)}
                className={`py-3 px-6 rounded-xl ${buttons.length > 1 ? 'flex-1' : ''}`}
                style={{
                  backgroundColor: button.style === 'cancel' ? '#f3f4f6' : '#00B8DB',
                }}
              >
                <Text
                  className="text-center font-semibold text-base"
                  style={{
                    color: button.style === 'cancel' ? '#6b7280' : '#ffffff',
                  }}
                >
                  {button.text}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Helper function to show alerts (works on both web and mobile)
export const showAlert = (
  title: string,
  message: string,
  buttons?: AlertButton[],
  setAlertState?: (state: { visible: boolean; title: string; message: string; buttons: AlertButton[] }) => void
) => {
  if (Platform.OS === 'web') {
    // For web, we need to use the custom modal
    if (setAlertState) {
      setAlertState({
        visible: true,
        title,
        message,
        buttons: buttons || [{ text: 'OK' }],
      });
    } else {
      // Fallback to browser alert
      alert(`${title}\n\n${message}`);
    }
  } else {
    // For mobile, use native Alert
    const { Alert } = require('react-native');
    Alert.alert(title, message, buttons);
  }
};
