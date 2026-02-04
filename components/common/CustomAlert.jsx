import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
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

  // Determine alert type based on title
  const getAlertType = () => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('success') || lowerTitle.includes('welcome') || lowerTitle.includes('sent')) {
      return 'success';
    }
    if (lowerTitle.includes('error') || lowerTitle.includes('failed') || lowerTitle.includes('incorrect')) {
      return 'error';
    }
    if (lowerTitle.includes('warning') || lowerTitle.includes('required') || lowerTitle.includes('review')) {
      return 'warning';
    }
    return 'info';
  };

  const alertType = getAlertType();

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onDismiss}
    >
      <View style={styles.alertOverlay}>
        <View style={styles.alertContainer}>
          <View style={[
            styles.alertIconContainer, 
            alertType === 'success' ? styles.alertSuccessBg : 
            alertType === 'warning' ? styles.alertWarningBg : 
            alertType === 'info' ? styles.alertInfoBg :
            styles.alertErrorBg
          ]}>
            <Ionicons 
              name={
                alertType === 'success' ? 'checkmark-circle' : 
                alertType === 'warning' ? 'alert-circle' : 
                alertType === 'info' ? 'information-circle' :
                'close-circle'
              } 
              size={48} 
              color={
                alertType === 'success' ? '#10b981' : 
                alertType === 'warning' ? '#f59e0b' : 
                alertType === 'info' ? '#3b82f6' :
                '#ef4444'
              }
            />
          </View>
          <Text style={styles.alertTitle}>
            {title}{alertType === 'success' ? ' 🎉' : ''}
          </Text>
          <Text style={styles.alertMessage}>{message}</Text>
          
          {buttons.length > 1 ? (
            <View style={styles.alertButtonsRow}>
              {buttons.map((button, index) => {
                const isCancel = button.style === 'cancel';
                return (
                  <TouchableOpacity 
                    key={index}
                    style={isCancel ? styles.alertCancelButton : styles.alertButton} 
                    onPress={() => handleButtonPress(button)}
                  >
                    <Text style={isCancel ? styles.alertCancelButtonText : styles.alertButtonText}>
                      {button.text || 'OK'}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : (
            <TouchableOpacity style={styles.alertButton} onPress={() => handleButtonPress(buttons[0])}>
              <Text style={styles.alertButtonText}>{buttons[0]?.text || 'Continue'}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  alertOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  alertContainer: {
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
  alertIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  alertSuccessBg: {
    backgroundColor: '#d1fae5',
  },
  alertErrorBg: {
    backgroundColor: '#fee2e2',
  },
  alertWarningBg: {
    backgroundColor: '#fef3c7',
  },
  alertInfoBg: {
    backgroundColor: '#dbeafe',
  },
  alertTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 12,
    textAlign: 'center',
  },
  alertMessage: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  alertButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  alertButton: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 60,
    paddingVertical: 16,
    borderRadius: 50,
    width: '100%',
    shadowColor: '#5b8fa3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  alertButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  alertCancelButton: {
    backgroundColor: '#f1f5f9',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 50,
    flex: 1,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  alertCancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#475569',
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
