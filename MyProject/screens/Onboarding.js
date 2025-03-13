import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OnboardingScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Validation functions
  const isValidFirstName = (name) => {
    return name.trim().length > 0 && /^[A-Za-z\s]+$/.test(name);
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Check if both inputs are valid
  const isFormValid = isValidFirstName(firstName) && isValidEmail(email);

  // Save onboarding status and navigate to Profile
  const completeOnboarding = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      // Save onboarding status
      await AsyncStorage.setItem('isOnboardingCompleted', 'true');
      
      // Save user data
      const userData = {
        firstName: firstName.trim(),
        email: email.trim().toLowerCase()
      };
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      
      // Navigate to Profile screen with user data
      navigation.navigate('Profile', userData);
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to save your information. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Welcome to Onboarding</Text>

      {/* First Name Input */}
      <TextInput
        style={[
          styles.input,
          firstName.length > 0 && !isValidFirstName(firstName) && styles.inputError
        ]}
        placeholder="Enter your first name"
        value={firstName}
        onChangeText={setFirstName}
        onBlur={() => {
          if (firstName.length > 0 && !isValidFirstName(firstName)) {
            Alert.alert('Invalid Name', 'Please enter a valid first name.');
          }
        }}
      />
      {!isValidFirstName(firstName) && firstName.length > 0 && (
        <Text style={styles.errorText}>First name must contain only letters and cannot be empty.</Text>
      )}

      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        defaultValue='(email@gmail.com'
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />
      {!isValidEmail(email) && email.length > 0 && (
        <Text style={styles.errorText}>Please enter a valid email address.</Text>
      )}

      {/* Next Button */}
      <View style={styles.buttonContainer}>
        <Button
          title={isLoading ? "Saving..." : "Next"}
          onPress={completeOnboarding}
          disabled={!isFormValid || isLoading}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
  },
  buttonContainer: {
    marginTop: 24,
  },
  inputError: {
    borderColor: 'red',
  },
  disabledButton: {
    opacity: 0.5,
  }
});

export default OnboardingScreen;