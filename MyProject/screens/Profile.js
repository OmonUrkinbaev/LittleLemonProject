import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, TouchableOpacity } from 'react-native';
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

  // route.params: Used to access data passed from the OnboardingScreen (e.g., firstName and email)
  // State Variables:
  // firstName, lastName, email, phoneNumber: Store user input for profile fields.
  // avatar: Stores the URI of the user's profile picture.
  // notifications: Stores the state of email notification preferences (e.g., promotions and updates).


  const isValidPhoneNumber = (phone) => /^\(\d{3}\) \d{3}-\d{4}$/.test(phone);
  // This function uses a regular expression to validate USA phone numbers in the format (123) 456-7890.


  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['image'],  // Updated from MediaTypeOptions.Images to array format
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
  
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setAvatar(result.assets[0].uri);
    }
  };
  // ImagePicker.launchImageLibraryAsync: Opens the device's image library for the user to select a profile picture.
  // The selected image is stored in the avatar state variable.
  // The aspect ratio is set to 1:1 (square) and the image quality is set to 100%.
  // The image is not saved if the user cancels the selection.
  // The selected image is stored in the avatar state variable if the user selects an image.
  // The avatar state variable is updated with the URI of the selected image.
  // The setAvatar function is used to update the avatar state variable with the selected image URI.


  const saveChanges = async () => {
    const profileData = {
      firstName,
      lastName,
      email,
      phoneNumber,
      avatar,
      notifications,
    };
    await AsyncStorage.setItem('profileData', JSON.stringify(profileData));
    alert('Changes saved successfully!');
  };
// The saveChanges function creates a profileData object containing the user's profile information.
// The profileData object is saved to AsyncStorage using the key 'profileData'.
// The profileData object is saved as a JSON string using JSON.stringify.
// An alert is displayed to confirm that the changes were saved successfully.


  const logout = async () => {
    await AsyncStorage.clear();
    navigation.navigate('Onboarding');
  };
// The logout function clears all data stored in AsyncStorage.
// The user is then navigated to the OnboardingScreen.

useEffect(() => {
  const loadProfileData = async () => {
    const data = await AsyncStorage.getItem('profileData');
    if (data) {
      const parsedData = JSON.parse(data);
      setFirstName(parsedData.firstName);
      setLastName(parsedData.lastName);
      setEmail(parsedData.email);
      setPhoneNumber(parsedData.phoneNumber);
      setAvatar(parsedData.avatar);
      setNotifications(parsedData.notifications);
    }
  };
  loadProfileData();
}, []);
// The useEffect hook is used to load the user's profile data from AsyncStorage when the ProfileScreen is rendered.
// The loadProfileData function retrieves the profile data from AsyncStorage using the key 'profileData'.
// If profile data exists, it is parsed from a JSON string to an object.
// The parsed profile data is used to set the initial state values for firstName, lastName, email, phoneNumber, avatar, and notifications.


return (
  <View style={styles.container}>
    <Text style={styles.header}>Profile</Text>

    <TouchableOpacity onPress={pickImage}>
      {avatar ? (
        <Image source={{ uri: avatar }} style={styles.avatar} />
      ) : (
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>
            {firstName.charAt(0)}
            {lastName.charAt(0)}
          </Text>
        </View>
      )}
    </TouchableOpacity>

    <TextInput
      style={styles.input}
      placeholder="First Name"
      value={firstName}
      onChangeText={setFirstName}
    />
    <TextInput
      style={styles.input}
      placeholder="Last Name"
      value={lastName}
      onChangeText={setLastName}
    />
    <TextInput
      style={styles.input}
      placeholder="Email"
      value={email}
      onChangeText={setEmail}
      keyboardType="email-address"
    />
    <MaskedTextInput
      style={styles.input}
      placeholder="Phone Number"
      value={phoneNumber}
      onChangeText={setPhoneNumber}
      mask="(999) 999-9999"
      keyboardType="phone-pad"
    />
    {!isValidPhoneNumber(phoneNumber) && phoneNumber.length > 0 && (
      <Text style={styles.errorText}>Please enter a valid USA phone number.</Text>
    )}

    <View style={styles.checkboxContainer}>
      <Text>Receive promotional emails</Text>
      <Button
        title={notifications.promotions ? 'On' : 'Off'}
        onPress={() => setNotifications({ ...notifications, promotions: !notifications.promotions })}
      />
    </View>
    <View style={styles.checkboxContainer}>
      <Text>Receive updates</Text>
      <Button
        title={notifications.updates ? 'On' : 'Off'}
        onPress={() => setNotifications({ ...notifications, updates: !notifications.updates })}
      />
    </View>

    <Button title="Save Changes" onPress={saveChanges} />
    <Button title="Logout" onPress={logout} color="red" />
  </View>
);



}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 24 },
  input: { height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 16, paddingHorizontal: 8 },
  avatar: { width: 100, height: 100, borderRadius: 50, alignSelf: 'center', marginBottom: 16 },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },
  avatarText: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  checkboxContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  errorText: { color: 'red', marginBottom: 16 },
});

export default ProfileScreen;