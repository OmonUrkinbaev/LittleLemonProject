// import React, { useState } from 'react';
// import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';


// const OnboardingScreen = () => {
//   const [firstName, setFirstName] = useState('');
//   const [email, setEmail] = useState('');

//   // Validation functions
//   const isValidFirstName = (name) => {
//     return name.trim().length > 0 && /^[A-Za-z\s]+$/.test(name);
//   };

//   const isValidEmail = (email) => {
//     return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
//   };

//   // Check if both inputs are valid
//   const isFormValid = isValidFirstName(firstName) && isValidEmail(email);

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <Text style={styles.header}>Welcome to Onboarding</Text>
//       {/* First Name Input */}
//       <TextInput
//         style={styles.input}
//         placeholder="Enter your first name"
//         value={firstName}
//         onChangeText={setFirstName}
//       />
//       {!isValidFirstName(firstName) && firstName.length > 0 && (
//         <Text style={styles.errorText}>First name must contain only letters and cannot be empty.</Text>
//       )}

//       {/* Email Input */}
//       <TextInput
//         style={styles.input}
//         placeholder="Enter your email"
//         value={email}
//         onChangeText={setEmail}
//         keyboardType="email-address"
//       />
//       {!isValidEmail(email) && email.length > 0 && (
//         <Text style={styles.errorText}>Please enter a valid email address.</Text>
//       )}

//       {/* Next Button */}
//       <View style={styles.buttonContainer}>
//         <Button
//           title="Next"
//           onPress={() => {
//             // No action for now
//           }}
//           disabled={!isFormValid}
//         />
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     padding: 16,
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 24,
//   },
//   input: {
//     height: 40,
//     borderColor: 'gray',
//     borderWidth: 1,
//     marginBottom: 16,
//     paddingHorizontal: 8,
//   },
//   errorText: {
//     color: 'red',
//     marginBottom: 16,
//   },
//   buttonContainer: {
//     marginTop: 24,
//   },
// });

// export default OnboardingScreen;





//====================================================Previous code on top============================================================================





import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OnboardingScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');

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
    try {
      await AsyncStorage.setItem('@onboarding_complete', 'true');
      navigation.navigate('Profile'); // Navigate to Profile screen
    } catch (error) {
      Alert.alert('Error', 'Failed to save onboarding status.');      
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Welcome to Onboarding</Text>

      {/* First Name Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter your first name"
        value={firstName}
        onChangeText={setFirstName}
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
      />
      {!isValidEmail(email) && email.length > 0 && (
        <Text style={styles.errorText}>Please enter a valid email address.</Text>
      )}

      {/* Next Button */}
      <View style={styles.buttonContainer}>
        <Button
          title="Next"
          onPress={completeOnboarding}
          disabled={!isFormValid}
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
});

export default OnboardingScreen;