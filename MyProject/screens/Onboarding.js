import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert, SafeAreaView, Image, ScrollView, ActivityIndicator } from 'react-native';
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

  const isFormValid = isValidFirstName(firstName) && isValidEmail(email);

  const completeOnboarding = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      await AsyncStorage.setItem('isOnboardingCompleted', 'true');
      
      const userData = {
        firstName: firstName.trim(),
        email: email.trim().toLowerCase()
      };
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      
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
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Image
            source={require('../assets/Logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.welcomeTitle}>Welcome to</Text>
          <Text style={styles.brandName}>Little Lemon</Text>
          <Text style={styles.tagline}>Mediterranean Cuisine</Text>
        </View>

        {/* Description */}
        <View style={styles.descriptionSection}>
          <Text style={styles.descriptionText}>
            Join us for an authentic dining experience. Create your account to get personalized recommendations and exclusive offers.
          </Text>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          
          {/* First Name Input */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={[
                styles.input,
                firstName.length > 0 && !isValidFirstName(firstName) && styles.inputError
              ]}
              placeholder="John"
              placeholderTextColor="#BFBFBF"
              value={firstName}
              onChangeText={setFirstName}
              editable={!isLoading}
            />
            {!isValidFirstName(firstName) && firstName.length > 0 && (
              <Text style={styles.errorText}>
                <Text>⚠️ </Text>
                First name must contain only letters.
              </Text>
            )}
          </View>

          {/* Email Input */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={[
                styles.input,
                email.length > 0 && !isValidEmail(email) && styles.inputError
              ]}
              placeholder="your@email.com"
              placeholderTextColor="#BFBFBF"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />
            {!isValidEmail(email) && email.length > 0 && (
              <Text style={styles.errorText}>
                <Text>⚠️ </Text>
                Please enter a valid email address.
              </Text>
            )}
          </View>

        </View>

        {/* CTA Button */}
        <Pressable 
          style={[
            styles.nextButton,
            (!isFormValid || isLoading) && styles.nextButtonDisabled
          ]}
          onPress={completeOnboarding}
          disabled={!isFormValid || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.nextButtonText}>Get Started</Text>
          )}
        </Pressable>

        {/* Footer Text */}
        <Text style={styles.footerText}>
          We respect your privacy. Your information is secure.
        </Text>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  logo: {
    height: 60,
    width: 180,
    marginBottom: 24,
  },
  welcomeTitle: {
    fontSize: 16,
    color: '#495E57',
    fontWeight: '500',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  brandName: {
    fontSize: 48,
    fontWeight: '700',
    color: '#F4CE14',
    fontFamily: 'MarkaziText-Regular',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: '#EE9972',
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  descriptionSection: {
    marginBottom: 36,
    backgroundColor: '#F9F9F9',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#F4CE14',
  },
  descriptionText: {
    fontSize: 15,
    color: '#495E57',
    lineHeight: 24,
    textAlign: 'center',
  },
  formSection: {
    marginBottom: 32,
  },
  inputWrapper: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495E57',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    height: 50,
    borderColor: '#E0E0E0',
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#FAFAFA',
    fontFamily: 'Karla-Regular',
  },
  inputError: {
    borderColor: '#EE9972',
    backgroundColor: '#FFF5F0',
  },
  errorText: {
    color: '#EE9972',
    fontSize: 13,
    marginTop: 6,
    fontWeight: '500',
  },
  nextButton: {
    height: 56,
    backgroundColor: '#495E57',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  nextButtonDisabled: {
    backgroundColor: '#BFBFBF',
    opacity: 0.6,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  footerText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
});

export default OnboardingScreen;