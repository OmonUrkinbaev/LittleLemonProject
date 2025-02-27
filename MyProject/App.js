import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from './SplashScreen';
import OnboardingScreen from './OnboardingScreen';
import ProfileScreen from './ProfileScreen';

const Stack = createStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(false);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      const status = await AsyncStorage.getItem('isOnboardingCompleted');
      setIsOnboardingCompleted(status === 'true');
      setIsLoading(false);
    };

    checkOnboardingStatus();
  }, []);

  if (isLoading) {
    // Show Splash Screen while loading
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isOnboardingCompleted ? (
          // Onboarding completed, show Profile screen
          <Stack.Screen name="Profile" component={ProfileScreen} />
        ) : (
          // Onboarding not completed, show Onboarding screen
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}