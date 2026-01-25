import React from 'react';
import { View, Text, Pressable, Modal, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export const CustomAlert = ({
  visible,
  title,
  message,
  buttons = [{ text: 'OK', style: 'default' }],
  onDismiss,
}) => {
  const handleButtonPress = (button) => {
    if (button.onPress) {
      button.onPress();
    }
    if (onDismiss) {
      onDismiss();
    }
  };

  // Determine icon based on title
  const getIcon = () => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('success') || lowerTitle.includes('welcome')) {
      return { name: 'checkmark-circle', color: '#10b981', bgColor: '#d1fae5' };
    }
    if (lowerTitle.includes('error') || lowerTitle.includes('failed') || lowerTitle.includes('incorrect')) {
      return { name: 'close-circle', color: '#ef4444', bgColor: '#fee2e2' };
    }
    if (lowerTitle.includes('warning') || lowerTitle.includes('required') || lowerTitle.includes('review')) {
      return { name: 'alert-circle', color: '#f59e0b', bgColor: '#fef3c7' };
    }
    return { name: 'information-circle', color: '#3b82f6', bgColor: '#dbeafe' };
  };

  const icon = getIcon();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View style={styles.overlay}>
        <View style={[styles.alertCard, { maxHeight: SCREEN_HEIGHT * 0.8 }]}>
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Icon Header */}
            <View style={styles.iconContainer}>
              <View style={[styles.iconCircle, { backgroundColor: icon.bgColor }]}>
                <Ionicons name={icon.name} size={48} color={icon.color} />
              </View>

              {/* Title */}
              <Text style={styles.title}>{title}</Text>
            </View>

            {/* Message */}
            <View style={styles.messageContainer}>
              <Text style={styles.message}>{message}</Text>
            </View>
          </ScrollView>

          {/* Buttons - Fixed at bottom */}
          <View style={styles.buttonsContainer}>
            <View style={buttons.length > 1 ? styles.buttonRowMultiple : styles.buttonRowSingle}>
              {buttons.map((button, index) => {
                const isCancel = button.style === 'cancel';
                const isDestructive = button.style === 'destructive';

                return (
                  <Pressable
                    key={index}
                    onPress={() => handleButtonPress(button)}
                    style={({ pressed }) => [
                      isCancel ? styles.cancelButton : styles.primaryButton,
                      isDestructive && styles.destructiveButton,
                      buttons.length > 1 && styles.buttonFlex,
                      pressed && styles.buttonPressed,
                    ]}
                  >
                    <Text style={isCancel ? styles.cancelButtonText : styles.primaryButtonText}>
                      {button.text}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  alertCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '100%',
    maxWidth: 400,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  scrollContent: {
    flexGrow: 1,
  },
  iconContainer: {
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 16,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  messageContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  message: {
    color: '#64748b',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  buttonRowSingle: {
    flexDirection: 'column',
    gap: 12,
  },
  buttonRowMultiple: {
    flexDirection: 'row',
    gap: 12,
  },
  buttonFlex: {
    flex: 1,
  },
  primaryButton: {
    backgroundColor: '#1e293b',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#1e293b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  destructiveButton: {
    backgroundColor: '#ef4444',
    shadowColor: '#ef4444',
  },
  cancelButton: {
    backgroundColor: '#f1f5f9',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  buttonPressed: {
    opacity: 0.7,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  cancelButtonText: {
    color: '#475569',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

// Helper function to show alerts (works on both web and mobile)
export const showAlert = (title, message, buttons, setAlertState) => {
  if (setAlertState) {
    setAlertState({
      visible: true,
      title,
      message,
      buttons: buttons || [{ text: 'OK', style: 'default' }],
    });
  }
};

