import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnboardingScreen from './screens/Onboarding';
import React, { useState } from 'react';



function HomeScreen() {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Home Screen</Text>
        </View>
    );
}

const Stack = createNativeStackNavigator();

function App() {
    if (state.isLoading) {
        // We haven't finished reading from AsyncStorage yet
        return <SplashScreen />;
    }

    return (
        <Stack.Navigator>
            {state.isOnboardingCompleted ? (
                // Onboarding completed, user is signed in
                <Stack.Screen name="Profile" component={ProfileScreen} />
            ) : (
                // User is NOT signed in
                <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            )}
        </Stack.Navigator>
    );
}

export default App;