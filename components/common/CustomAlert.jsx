import React from 'react';
import { View, Text, Pressable, Modal, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

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

  // Determine icon based on title
  const getIcon = () => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('success') || lowerTitle.includes('welcome')) {
      return { name: 'checkmark-circle' as const, color: '#10b981' };
    } else if (lowerTitle.includes('error') || lowerTitle.includes('failed') || lowerTitle.includes('incorrect')) {
      return { name: 'close-circle' as const, color: '#ef4444' };
    } else if (lowerTitle.includes('warning') || lowerTitle.includes('required')) {
      return { name: 'warning' as const, color: '#f59e0b' };
    } else {
      return { name: 'information-circle' as const, color: '#447788' };
    }
  };

  const icon = getIcon();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View className="flex-1 justify-center items-center px-6" style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
        <View 
          className="bg-white rounded-3xl w-full max-w-sm overflow-hidden"
          style={{ 
            shadowColor: '#000', 
            shadowOffset: { width: 0, height: 8 }, 
            shadowOpacity: 0.3, 
            shadowRadius: 16, 
            elevation: 12 
          }}
        >
          {/* Icon Header */}
          <View className="items-center pt-8 pb-4">
            <View 
              className="w-20 h-20 rounded-full items-center justify-center mb-4"
              style={{ backgroundColor: `${icon.color}15` }}
            >
              <Ionicons name={icon.name} size={48} color={icon.color} />
            </View>
            
            {/* Title */}
            <Text className="text-2xl font-bold text-gray-900 text-center px-6">
              {title}
            </Text>
          </View>
          
          {/* Message */}
          <View className="px-6 pb-6">
            <Text className="text-gray-600 text-base text-center leading-6">
              {message}
            </Text>
          </View>
          
          {/* Buttons */}
          <View className="px-4 pb-4">
            <View className={`${buttons.length > 1 ? 'flex-row' : 'flex-col'} gap-3`}>
              {buttons.map((button, index) => {
                const isCancel = button.style === 'cancel';
                const isDestructive = button.style === 'destructive';
                
                return isCancel ? (
                  <Pressable
                    key={index}
                    onPress={() => handleButtonPress(button)}
                    className={`py-4 px-6 rounded-2xl ${buttons.length > 1 ? 'flex-1' : ''} active:opacity-70`}
                    style={{
                      backgroundColor: '#f3f4f6',
                      borderWidth: 1,
                      borderColor: '#e5e7eb',
                    }}
                  >
                    <Text className="text-center font-bold text-base text-gray-700">
                      {button.text}
                    </Text>
                  </Pressable>
                ) : (
                  <LinearGradient
                    key={index}
                    colors={isDestructive ? ['#ef4444', '#dc2626'] : ['#447788', '#628BB5']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className={`py-4 px-6 rounded-2xl ${buttons.length > 1 ? 'flex-1' : ''}`}
                    style={{
                      shadowColor: isDestructive ? '#ef4444' : '#447788',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.3,
                      shadowRadius: 8,
                      elevation: 6,
                    }}
                  >
                    <Pressable
                      onPress={() => handleButtonPress(button)}
                      className="active:opacity-70"
                    >
                      <Text className="text-center font-bold text-base text-white">
                        {button.text}
                      </Text>
                    </Pressable>
                  </LinearGradient>
                );
              })}
            </View>
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
