import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  TextInput,
  Image as RNImage,
  Platform,
  Modal,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { API_CONFIG } from '../config/api.config';
import { CustomAlert } from '../common/CustomAlert';

export default function BookingFormPage({ worker, onBack, onSubmit }) {
  const [formData, setFormData] = useState({
    jobTitle: worker?.title || '',
    jobDescription: '',
    startDate: new Date(),
    endDate: null,
    workDuration: '',
    agreedRate: worker?.rate || '',
    rateType: worker?.rateType || 'Daily',
    totalAmount: '',
    area: worker?.area || '',
    district: worker?.district || '',
    notes: '',
    paymentMethod: 'cash', // Default to cash
  });

  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [tempStartDate, setTempStartDate] = useState(new Date());
  const [tempEndDate, setTempEndDate] = useState(new Date());

  const [customAlert, setCustomAlert] = useState({ 
    visible: false, 
    type: '', 
    title: '', 
    message: '' 
  });

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const calculateDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return '';
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return '1 day';
    if (diffDays === 1) return '1 day';
    if (diffDays < 7) return `${diffDays} days`;
    if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      const remainingDays = diffDays % 7;
      if (remainingDays === 0) return weeks === 1 ? '1 week' : `${weeks} weeks`;
      return `${weeks} week${weeks > 1 ? 's' : ''} ${remainingDays} day${remainingDays > 1 ? 's' : ''}`;
    }
    const months = Math.floor(diffDays / 30);
    const remainingDays = diffDays % 30;
    if (remainingDays === 0) return months === 1 ? '1 month' : `${months} months`;
    return `${months} month${months > 1 ? 's' : ''} ${remainingDays} day${remainingDays > 1 ? 's' : ''}`;
  };

  const onStartDateChange = (event, selectedDate) => {
    if (selectedDate) {
      setTempStartDate(selectedDate);
    }
  };

  const onEndDateChange = (event, selectedDate) => {
    if (selectedDate) {
      setTempEndDate(selectedDate);
    }
  };

  const confirmStartDate = () => {
    setFormData({ ...formData, startDate: tempStartDate });
    setShowStartDatePicker(false);
  };

  const confirmEndDate = () => {
    setFormData({ ...formData, endDate: tempEndDate });
    setShowEndDatePicker(false);
    
    // Calculate work duration automatically
    if (formData.startDate && tempEndDate) {
      const duration = calculateDuration(formData.startDate, tempEndDate);
      setFormData(prev => ({ ...prev, endDate: tempEndDate, workDuration: duration }));
    }
  };

  const cancelStartDate = () => {
    setTempStartDate(formData.startDate || new Date());
    setShowStartDatePicker(false);
  };

  const cancelEndDate = () => {
    setTempEndDate(formData.endDate || new Date());
    setShowEndDatePicker(false);
  };

  const handleSubmit = () => {
    // Validation
    if (!formData.jobTitle || !formData.startDate || !formData.agreedRate) {
      setCustomAlert({
        visible: true,
        type: 'warning',
        title: 'Missing Information',
        message: 'Please fill in all required fields (Job Title, Start Date, and Rate).',
      });
      return;
    }

    if (onSubmit) {
      // Format dates as ISO strings for backend
      const submitData = {
        ...formData,
        startDate: formData.startDate.toISOString(),
        endDate: formData.endDate ? formData.endDate.toISOString() : null,
      };
      onSubmit(submitData);
    }
  };

  const hideAlert = () => {
    setCustomAlert({ visible: false, type: '', title: '', message: '' });
  };

  if (!worker) return null;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book Worker</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Worker Info Card */}
        <View style={styles.workerCard}>
          <View style={styles.workerHeader}>
            <View style={styles.workerImageContainer}>
              {worker.workerProfile?.profilePhoto ? (
                <RNImage 
                  source={{ uri: `${API_CONFIG.BASE_URL}${worker.workerProfile.profilePhoto}` }} 
                  style={styles.workerImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.workerImagePlaceholder}>
                  <Ionicons name="person" size={32} color="#94a3b8" />
                </View>
              )}
            </View>
            <View style={styles.workerInfo}>
              <Text style={styles.workerName}>{worker.workerName}</Text>
              <Text style={styles.workerTitle}>{worker.title}</Text>
            </View>
          </View>
        </View>

        {/* Form */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Job Details</Text>

          {/* Job Title */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Job Title *</Text>
            <View style={styles.disabledInput}>
              <Text style={styles.disabledInputText}>{formData.jobTitle}</Text>
            </View>
            <Text style={styles.helperText}>Service offered by worker</Text>
          </View>

          {/* Job Description */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Job Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe the work to be done"
              placeholderTextColor="#94a3b8"
              multiline
              numberOfLines={4}
              value={formData.jobDescription}
              onChangeText={(text) => setFormData({ ...formData, jobDescription: text })}
              textAlignVertical="top"
            />
          </View>

          {/* Start Date */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Start Date *</Text>
            <TouchableOpacity
              style={styles.dateInput}
              onPress={() => {
                setTempStartDate(formData.startDate || new Date());
                setShowStartDatePicker(true);
              }}
            >
              <Ionicons name="calendar-outline" size={20} color="#64748b" />
              <Text style={styles.dateText}>
                {formatDate(formData.startDate) || 'Select start date'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* End Date */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>End Date (Optional)</Text>
            <View style={styles.dateInputContainer}>
              <TouchableOpacity
                style={[styles.dateInput, formData.endDate && styles.dateInputWithClear]}
                onPress={() => {
                  setTempEndDate(formData.endDate || new Date());
                  setShowEndDatePicker(true);
                }}
              >
                <Ionicons name="calendar-outline" size={20} color="#64748b" />
                <Text style={[styles.dateText, !formData.endDate && styles.datePlaceholder]}>
                  {formData.endDate ? formatDate(formData.endDate) : 'Select end date'}
                </Text>
              </TouchableOpacity>
              {formData.endDate && (
                <TouchableOpacity
                  style={styles.clearDateButton}
                  onPress={() => setFormData({ ...formData, endDate: null, workDuration: '' })}
                >
                  <Ionicons name="close-circle" size={20} color="#ef4444" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Work Duration */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Work Duration</Text>
            {formData.endDate ? (
              <>
                <View style={styles.disabledInput}>
                  <Text style={styles.disabledInputText}>{formData.workDuration}</Text>
                </View>
                <Text style={styles.helperText}>Calculated from start and end dates</Text>
              </>
            ) : (
              <TextInput
                style={styles.input}
                placeholder="e.g., 1 week, 2 months"
                placeholderTextColor="#94a3b8"
                value={formData.workDuration}
                onChangeText={(text) => setFormData({ ...formData, workDuration: text })}
              />
            )}
          </View>

          <Text style={styles.sectionTitle}>Payment Details</Text>

          {/* Agreed Rate */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Agreed Rate *</Text>
            <View style={styles.disabledInput}>
              <Text style={styles.disabledInputText}>NPR {formData.agreedRate}</Text>
            </View>
            <Text style={styles.helperText}>Rate set by worker</Text>
          </View>

          {/* Rate Type */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Rate Type</Text>
            <View style={styles.disabledInput}>
              <Text style={styles.disabledInputText}>{formData.rateType}</Text>
            </View>
            <Text style={styles.helperText}>Payment frequency set by worker</Text>
          </View>

          {/* Total Amount */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Total Amount (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter total amount"
              placeholderTextColor="#94a3b8"
              keyboardType="numeric"
              value={formData.totalAmount}
              onChangeText={(text) => setFormData({ ...formData, totalAmount: text })}
            />
          </View>

          <Text style={styles.sectionTitle}>Payment Method</Text>

          {/* Payment Method Selection */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Select Payment Method *</Text>
            <View style={styles.paymentMethodContainer}>
              <TouchableOpacity
                style={[
                  styles.paymentMethodButton,
                  formData.paymentMethod === 'cash' && styles.paymentMethodButtonActive
                ]}
                onPress={() => setFormData({ ...formData, paymentMethod: 'cash' })}
              >
                <Ionicons 
                  name="cash-outline" 
                  size={24} 
                  color={formData.paymentMethod === 'cash' ? '#fff' : '#64748b'} 
                />
                <Text style={[
                  styles.paymentMethodText,
                  formData.paymentMethod === 'cash' && styles.paymentMethodTextActive
                ]}>
                  Cash on Delivery
                </Text>
                <Text style={[
                  styles.paymentMethodSubtext,
                  formData.paymentMethod === 'cash' && styles.paymentMethodSubtextActive
                ]}>
                  Pay after work completion
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.paymentMethodButton,
                  formData.paymentMethod === 'esewa' && styles.paymentMethodButtonActive
                ]}
                onPress={() => setFormData({ ...formData, paymentMethod: 'esewa' })}
              >
                <Ionicons 
                  name="card-outline" 
                  size={24} 
                  color={formData.paymentMethod === 'esewa' ? '#fff' : '#64748b'} 
                />
                <Text style={[
                  styles.paymentMethodText,
                  formData.paymentMethod === 'esewa' && styles.paymentMethodTextActive
                ]}>
                  eSewa
                </Text>
                <Text style={[
                  styles.paymentMethodSubtext,
                  formData.paymentMethod === 'esewa' && styles.paymentMethodSubtextActive
                ]}>
                  Pay online securely
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.helperText}>
              {formData.paymentMethod === 'cash' 
                ? 'You will pay the worker directly after work is completed' 
                : 'Payment will be processed through eSewa when worker accepts'}
            </Text>
          </View>

          <Text style={styles.sectionTitle}>Location</Text>

          {/* Area */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Area</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter area"
              placeholderTextColor="#94a3b8"
              value={formData.area}
              onChangeText={(text) => setFormData({ ...formData, area: text })}
            />
          </View>

          {/* District */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>District</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter district"
              placeholderTextColor="#94a3b8"
              value={formData.district}
              onChangeText={(text) => setFormData({ ...formData, district: text })}
            />
          </View>

          {/* Notes */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Additional Notes</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Any special requirements or notes"
              placeholderTextColor="#94a3b8"
              multiline
              numberOfLines={3}
              value={formData.notes}
              onChangeText={(text) => setFormData({ ...formData, notes: text })}
              textAlignVertical="top"
            />
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Submit Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Ionicons name="checkmark-circle" size={20} color="#fff" />
          <Text style={styles.submitButtonText}>Send Booking Request</Text>
        </TouchableOpacity>
      </View>

      {/* Start Date Picker Modal */}
      <Modal
        visible={showStartDatePicker}
        transparent={true}
        animationType="fade"
        onRequestClose={cancelStartDate}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.datePickerModal}>
            <Text style={styles.modalTitle}>Select Start Date</Text>
            <DateTimePicker
              value={tempStartDate}
              mode="date"
              display="spinner"
              onChange={onStartDateChange}
              minimumDate={new Date()}
              style={styles.datePicker}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalCancelButton} onPress={cancelStartDate}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalConfirmButton} onPress={confirmStartDate}>
                <Text style={styles.modalConfirmText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* End Date Picker Modal */}
      <Modal
        visible={showEndDatePicker}
        transparent={true}
        animationType="fade"
        onRequestClose={cancelEndDate}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.datePickerModal}>
            <Text style={styles.modalTitle}>Select End Date</Text>
            <DateTimePicker
              value={tempEndDate}
              mode="date"
              display="spinner"
              onChange={onEndDateChange}
              minimumDate={formData.startDate || new Date()}
              style={styles.datePicker}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalCancelButton} onPress={cancelEndDate}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalConfirmButton} onPress={confirmEndDate}>
                <Text style={styles.modalConfirmText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Custom Alert */}
      {customAlert.visible && customAlert.type && (
        <CustomAlert
          visible={customAlert.visible}
          title={customAlert.title}
          message={customAlert.message}
          buttons={[
            {
              text: 'OK',
              style: 'default',
              onPress: hideAlert,
            },
          ]}
          onDismiss={hideAlert}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
  },
  workerCard: {
    backgroundColor: '#fff',
    marginTop: 12,
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  workerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  workerImageContainer: {
    marginRight: 12,
  },
  workerImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  workerImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  workerInfo: {
    flex: 1,
  },
  workerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },
  workerTitle: {
    fontSize: 14,
    color: '#64748b',
  },
  formSection: {
    backgroundColor: '#fff',
    marginTop: 12,
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
    marginTop: 8,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#475569',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: '#1e293b',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  dateInput: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: '#1e293b',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateInputWithClear: {
    flex: 1,
  },
  clearDateButton: {
    padding: 8,
  },
  dateText: {
    fontSize: 15,
    color: '#1e293b',
    flex: 1,
  },
  datePlaceholder: {
    color: '#94a3b8',
  },
  disabledInput: {
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  disabledInputText: {
    fontSize: 15,
    color: '#64748b',
    fontWeight: '500',
  },
  helperText: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
    fontStyle: 'italic',
  },
  textArea: {
    minHeight: 100,
    paddingTop: 14,
  },
  paymentMethodContainer: {
    gap: 12,
  },
  paymentMethodButton: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    alignItems: 'center',
  },
  paymentMethodButtonActive: {
    backgroundColor: '#1e293b',
    borderColor: '#1e293b',
  },
  paymentMethodText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginTop: 8,
  },
  paymentMethodTextActive: {
    color: '#fff',
  },
  paymentMethodSubtext: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  paymentMethodSubtextActive: {
    color: '#cbd5e1',
  },
  textArea: {
    minHeight: 100,
    paddingTop: 14,
  },
  rateTypeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  rateTypeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#f8fafc',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    alignItems: 'center',
  },
  rateTypeButtonActive: {
    backgroundColor: '#1e293b',
    borderColor: '#1e293b',
  },
  rateTypeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  rateTypeTextActive: {
    color: '#fff',
  },
  bottomContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 8,
  },
  submitButton: {
    backgroundColor: '#1e293b',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#1e293b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  datePickerModal: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
    textAlign: 'center',
  },
  datePicker: {
    width: '100%',
    height: 200,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#475569',
  },
  modalConfirmButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#1e293b',
    alignItems: 'center',
  },
  modalConfirmText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
});
