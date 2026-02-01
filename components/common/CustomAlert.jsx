import React from 'react';
import { View, Text, Pressable, Modal, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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

  // Determine icon based on title - remove emoji from title
  const getIcon = () => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('success') || lowerTitle.includes('welcome')) {
      return { name: 'checkmark-circle', color: '#10b981' };
    }
    if (lowerTitle.includes('error') || lowerTitle.includes('failed') || lowerTitle.includes('incorrect')) {
      return { name: 'close-circle', color: '#ef4444' };
    }
    if (lowerTitle.includes('warning') || lowerTitle.includes('required') || lowerTitle.includes('review')) {
      return { name: 'alert-circle', color: '#f59e0b' };
    }
    return { name: 'information-circle', color: '#3b82f6' };
  };

  const icon = getIcon();
  
  // Remove emoji from title
  const cleanTitle = title.replace(/[\u{1F300}-\u{1F9FF}]/gu, '').trim();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
      statusBarTranslucent
    >
      <ScrollView 
        contentContainerStyle={styles.overlay}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.alertCard}>
          {/* Icon */}
          <Ionicons name={icon.name} size={48} color={icon.color} style={styles.icon} />

          {/* Title */}
          <Text style={styles.title}>{cleanTitle}</Text>

          {/* Message */}
          <Text style={styles.message}>{message}</Text>

          {/* Buttons */}
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
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 20,
    paddingVertical: 40,
    minHeight: '100%',
  },
  alertCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 40,
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  icon: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  buttonRowSingle: {
    width: '100%',
  },
  buttonRowMultiple: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  buttonFlex: {
    flex: 1,
  },
  primaryButton: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 60,
    paddingVertical: 16,
    borderRadius: 50,
    alignItems: 'center',
    shadowColor: '#5b8fa3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  destructiveButton: {
    backgroundColor: '#ef4444',
  },
  cancelButton: {
    backgroundColor: '#f1f5f9',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 50,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  buttonPressed: {
    opacity: 0.7,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  cancelButtonText: {
    color: '#475569',
    fontSize: 16,
    fontWeight: '600',
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

