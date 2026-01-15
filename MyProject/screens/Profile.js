import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  Image, 
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
  Pressable,
  Switch,
  Modal,
  Animated
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaskedTextInput } from 'react-native-mask-text';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = ({ navigation, route }) => {
  const { firstName: initialFirstName, email: initialEmail } = route.params || {};
  const [firstName, setFirstName] = useState(initialFirstName || '');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState(initialEmail || '');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [notifications, setNotifications] = useState({ promotions: false, updates: false });
  const [isLoading, setIsLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertData, setAlertData] = useState({ type: 'success', title: '', message: '' });

  const isValidPhoneNumber = (phone) => /^\(\d{3}\) \d{3}-\d{4}$/.test(phone);

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Camera roll permission is required to pick images.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
    
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setAvatar(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const showCustomAlert = (type, title, message) => {
    setAlertData({ type, title, message });
    setAlertVisible(true);
    
    // Auto-dismiss after 3 seconds
    setTimeout(() => {
      setAlertVisible(false);
    }, 3000);
  };

  const saveChanges = async () => {
    if (isLoading) return;
    
    // Validate form data
    if (!firstName.trim()) {
      showCustomAlert('error', 'Error', 'First name is required');
      return;
    }
    if (!isValidEmail(email)) {
      showCustomAlert('error', 'Error', 'Please enter a valid email address');
      return;
    }
    if (phoneNumber && !isValidPhoneNumber(phoneNumber)) {
      showCustomAlert('error', 'Error', 'Please enter a valid phone number');
      return;
    }

    setIsLoading(true);
    try {
      const profileData = {
        firstName,
        lastName,
        email,
        phoneNumber,
        avatar,
        notifications,
      };
      await AsyncStorage.setItem('profileData', JSON.stringify(profileData));
      showCustomAlert('success', 'Success', 'Profile updated successfully');
      
      setTimeout(() => {
        navigation.navigate('Home', { updatedAvatar: avatar });
      }, 2000);
    } catch (error) {
      showCustomAlert('error', 'Error', 'Failed to save changes');
      console.error('Error saving profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    showCustomAlert('confirm', 'Confirm Logout', 'Are you sure you want to logout?');
  };

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const data = await AsyncStorage.getItem('profileData');
        if (data) {
          const parsedData = JSON.parse(data);
          setFirstName(parsedData.firstName || '');
          setLastName(parsedData.lastName || '');
          setEmail(parsedData.email || '');
          setPhoneNumber(parsedData.phoneNumber || '');
          setAvatar(parsedData.avatar || null);
          setNotifications(parsedData.notifications || { promotions: false, updates: false });
        }
      } catch (error) {
        console.error('Error loading profile data:', error);
        Alert.alert('Error', 'Failed to load profile data');
      }
    };
    loadProfileData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Header */}
        <View style={styles.headerSection}>
          <Text style={styles.headerTitle}>My Profile</Text>
          <Text style={styles.headerSubtitle}>Manage your account information</Text>
        </View>

        {/* Avatar Section */}
        <TouchableOpacity 
          onPress={pickImage}
          style={styles.avatarSection}
          activeOpacity={0.7}
        >
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {firstName.charAt(0)}{lastName.charAt(0)}
              </Text>
            </View>
          )}
          <View style={styles.editAvatarBadge}>
            <Text style={styles.editAvatarText}>📷</Text>
          </View>
        </TouchableOpacity>
        <Text style={styles.avatarHelperText}>Tap to change photo</Text>

        {/* Personal Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>First Name *</Text>
            <TextInput
              style={[styles.input, !firstName.trim() && styles.inputError]}
              placeholder="Enter first name"
              placeholderTextColor="#BFBFBF"
              value={firstName}
              onChangeText={setFirstName}
              editable={!isLoading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter last name"
              placeholderTextColor="#BFBFBF"
              value={lastName}
              onChangeText={setLastName}
              editable={!isLoading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={[styles.input, !isValidEmail(email) && email.length > 0 && styles.inputError]}
              placeholder="your@email.com"
              placeholderTextColor="#BFBFBF"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isLoading}
            />
            {!isValidEmail(email) && email.length > 0 && (
              <Text style={styles.errorText}>Please enter a valid email address.</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <MaskedTextInput
              style={[styles.input, !isValidPhoneNumber(phoneNumber) && phoneNumber.length > 0 && styles.inputError]}
              placeholder="(123) 456-7890"
              placeholderTextColor="#BFBFBF"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              mask="(999) 999-9999"
              keyboardType="phone-pad"
              editable={!isLoading}
            />
            {!isValidPhoneNumber(phoneNumber) && phoneNumber.length > 0 && (
              <Text style={styles.errorText}>Please enter a valid USA phone number.</Text>
            )}
          </View>
        </View>

        {/* Notification Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notification Preferences</Text>
          
          <View style={styles.notificationItem}>
            <View style={styles.notificationContent}>
              <Text style={styles.notificationTitle}>Promotional Emails</Text>
              <Text style={styles.notificationDescription}>Receive offers and special deals</Text>
            </View>
            <Switch
              value={notifications.promotions}
              onValueChange={(value) => setNotifications({ ...notifications, promotions: value })}
              trackColor={{ false: '#E0E0E0', true: '#F4CE14' }}
              thumbColor={notifications.promotions ? '#495E57' : '#f4f3f4'}
              disabled={isLoading}
            />
          </View>

          <View style={styles.notificationItem}>
            <View style={styles.notificationContent}>
              <Text style={styles.notificationTitle}>Updates</Text>
              <Text style={styles.notificationDescription}>Receive news and updates about our menu</Text>
            </View>
            <Switch
              value={notifications.updates}
              onValueChange={(value) => setNotifications({ ...notifications, updates: value })}
              trackColor={{ false: '#E0E0E0', true: '#F4CE14' }}
              thumbColor={notifications.updates ? '#495E57' : '#f4f3f4'}
              disabled={isLoading}
            />
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Pressable 
            style={[styles.saveButton, isLoading && styles.buttonDisabled]}
            onPress={saveChanges}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.saveButtonText}>Save Changes</Text>
            )}
          </Pressable>

          <Pressable 
            style={styles.logoutButton}
            onPress={logout}
            disabled={isLoading}
          >
            <Text style={styles.logoutButtonText}>Logout</Text>
          </Pressable>
        </View>

      </ScrollView>

      {/* Custom Alert Modal */}
      <Modal
        transparent
        visible={alertVisible}
        animationType="fade"
        onRequestClose={() => setAlertVisible(false)}
      >
        <View style={styles.alertOverlay}>
          <View style={[
            styles.alertContainer,
            alertData.type === 'success' && styles.alertSuccess,
            alertData.type === 'error' && styles.alertError,
            alertData.type === 'confirm' && styles.alertConfirm,
          ]}>
            
            {/* Icon */}
            <View style={styles.alertIconContainer}>
              <Text style={styles.alertIcon}>
                {alertData.type === 'success' && '✓'}
                {alertData.type === 'error' && '✕'}
                {alertData.type === 'confirm' && '?'}
              </Text>
            </View>

            {/* Content */}
            <Text style={styles.alertTitle}>{alertData.title}</Text>
            <Text style={styles.alertMessage}>{alertData.message}</Text>

            {/* Buttons */}
            {alertData.type === 'confirm' ? (
              <View style={styles.alertButtonGroup}>
                <Pressable 
                  style={[styles.alertButton, styles.alertButtonCancel]}
                  onPress={() => setAlertVisible(false)}
                >
                  <Text style={styles.alertButtonTextCancel}>Cancel</Text>
                </Pressable>
                <Pressable 
                  style={[styles.alertButton, styles.alertButtonConfirm]}
                  onPress={async () => {
                    setAlertVisible(false);
                    try {
                      await AsyncStorage.clear();
                      navigation.navigate('Onboarding');
                    } catch (error) {
                      console.error('Error during logout:', error);
                    }
                  }}
                >
                  <Text style={styles.alertButtonTextConfirm}>Logout</Text>
                </Pressable>
              </View>
            ) : (
              <Pressable 
                style={[styles.alertButton, styles.alertButtonDefault]}
                onPress={() => setAlertVisible(false)}
              >
                <Text style={styles.alertButtonText}>OK</Text>
              </Pressable>
            )}

          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  headerSection: {
    marginBottom: 32,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#495E57',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#777',
    fontWeight: '500',
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: '#F4CE14',
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#495E57',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#F4CE14',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#F4CE14',
  },
  editAvatarBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: '#F4CE14',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  editAvatarText: {
    fontSize: 18,
  },
  avatarHelperText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#999',
    marginBottom: 32,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#495E57',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#495E57',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  input: {
    height: 50,
    borderColor: '#E0E0E0',
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
    fontFamily: 'Karla-Regular',
  },
  inputError: {
    borderColor: '#EE9972',
    backgroundColor: '#FFF5F0',
  },
  errorText: {
    color: '#EE9972',
    fontSize: 12,
    marginTop: 6,
    fontWeight: '500',
  },
  notificationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  notificationContent: {
    flex: 1,
    marginRight: 12,
  },
  notificationTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  notificationDescription: {
    fontSize: 13,
    color: '#777',
  },
  buttonContainer: {
    marginBottom: 24,
    gap: 12,
  },
  saveButton: {
    height: 56,
    backgroundColor: '#495E57',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  logoutButton: {
    height: 56,
    backgroundColor: '#fff',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#EE9972',
  },
  logoutButtonText: {
    color: '#EE9972',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  buttonDisabled: {
    opacity: 0.6,
  },

  // Custom Alert Styles
  alertOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  alertContainer: {
    width: '100%',
    maxWidth: 320,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  alertSuccess: {
    backgroundColor: '#E8F5E9',
    borderTopWidth: 4,
    borderTopColor: '#4CAF50',
  },
  alertError: {
    backgroundColor: '#FFF5F0',
    borderTopWidth: 4,
    borderTopColor: '#EE9972',
  },
  alertConfirm: {
    backgroundColor: '#FFF9E6',
    borderTopWidth: 4,
    borderTopColor: '#F4CE14',
  },
  alertIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  alertIcon: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  alertMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  alertButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 100,
  },
  alertButtonDefault: {
    backgroundColor: '#495E57',
    width: '100%',
  },
  alertButtonGroup: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  alertButtonCancel: {
    flex: 1,
    backgroundColor: '#E8E8E8',
  },
  alertButtonConfirm: {
    flex: 1,
    backgroundColor: '#EE9972',
  },
  alertButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  alertButtonTextCancel: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  alertButtonTextConfirm: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileScreen;