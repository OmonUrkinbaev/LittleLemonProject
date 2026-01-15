# Little Lemon

A modern, full-featured restaurant mobile application built with React Native, demonstrating professional UI/UX design, navigation patterns, and user interaction flows.

> Part of the Meta Professional Certificate in Mobile App Development

## Overview

Little Lemon is a Mediterranean restaurant application that showcases a complete user journey from onboarding through menu browsing and profile management. The application emphasizes clean, intuitive design and smooth user interactions.

### Key Screens
- **Onboarding** - User registration and welcome flow
- **Home** - Menu browsing with search and filtering capabilities
- **Profile** - User account management and preferences
- **Reservations** - Booking system (future implementation)

## Features

### User Management
- User registration and onboarding flow
- Profile management with avatar support
- Notification preferences
- Secure logout functionality

### Menu System
- Dynamic menu browsing with category filtering
- Real-time search functionality with debouncing
- High-quality menu item displays with descriptions and pricing
- Database persistence with SQLite

### UI/UX
- Custom-styled alert dialogs
- Responsive design for multiple screen sizes
- Brand-consistent color palette and typography
- Smooth animations and transitions
- Accessibility considerations

## Tech Stack

### Frontend
- **React Native** - Cross-platform mobile framework
- **React Navigation** - Navigation and routing
- **Expo** - Development and deployment platform

### Database & Storage
- **SQLite** - Local data persistence
- **AsyncStorage** - User preferences and session management

### UI Libraries
- **React Native Vector Icons** - Icon system
- **Expo Image Picker** - Avatar/photo selection
- **React Native Mask Text** - Phone number formatting

### Development
- **JavaScript ES6+** - Modern syntax and features
- **Expo CLI** - Development server and build tools

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)

### Setup Steps

1. Clone the repository
```bash
git clone https://github.com/yourusername/LittleLemonProject.git
cd LittleLemonProject
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Install Expo fonts (optional but recommended)
```bash
npx react-native-asset
```

4. Start the development server
```bash
expo start
# or
npm start
```

5. Run on device or emulator
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on physical device

## Design System

### Color Palette
- **Primary**: `#495E57` (Dark Green)
- **Secondary**: `#F4CE14` (Golden Yellow)
- **Accent**: `#EE9972` (Warm Orange)
- **Light**: `#EDEFEE` (Off White)

### Typography
- **Headers**: Playfair Display (Bold)
- **Body**: Inter / Karla (Regular)
- **Accent**: Markazi Text (Traditional)

### Spacing Scale
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px

## Project Structure

```
LittleLemonProject/
├── MyProject/
│   ├── screens/
│   │   ├── Home.js           # Menu browsing screen
│   │   ├── Onboarding.js     # User registration
│   │   ├── Profile.js        # User account management
│   │   └── Reservations.js   # Booking system
│   ├── utils/
│   │   ├── HeroBanner.js     # Hero component
│   │   ├── database.js       # SQLite configuration
│   │   └── validation.js     # Form validation utilities
│   ├── assets/
│   │   ├── images/           # Restaurant photos
│   │   ├── icons/            # Icon assets
│   │   └── fonts/            # Custom fonts
│   ├── navigation/
│   │   └── Navigation.js     # Route configuration
│   ├── App.js                # Main application entry
│   └── app.json              # Expo configuration
└── README.md
```

## Usage

### Running the Application

**Development Mode:**
```bash
npm start
```

**Production Build:**
```bash
eas build --platform ios
# or
eas build --platform android
```

### Key User Flows

#### First-Time User (Onboarding)
1. User launches app → Onboarding screen
2. Enters first name and email
3. Profile created and saved
4. Navigates to Home screen

#### Browse Menu
1. User views hero banner with restaurant info
2. Browses menu items in scrollable list
3. Filters by category or searches by name
4. Views item details (description, price)

#### Manage Profile
1. User navigates to Profile
2. Updates personal information and photo
3. Adjusts notification preferences
4. Saves changes or logs out

## Testing

### UI Testing Scenarios
- Onboarding form validation
- Menu search and filter functionality
- Profile update and persistence
- Avatar upload and display
- Custom alert interactions
- Navigation between screens
- Responsive layout on different devices

### Test Cases
See `TESTING.md` for detailed test scenarios and expected results.

## Security & Best Practices

- User data stored securely with AsyncStorage
- Form validation before submission
- Error handling with user-friendly messages
- Proper logout and session clearing
- Input sanitization

## Performance Considerations

- Debounced search queries (500ms)
- Optimized list rendering with FlatList
- Lazy-loaded images
- Efficient state management
- Minimal re-renders with proper hooks usage

## Known Issues & Roadmap

### Current Limitations
- Reservations system not yet implemented
- No backend API integration
- Offline-only functionality

### Future Features
- Reservations/Booking system
- Order management
- Payment integration
- Customer reviews and ratings
- Push notifications
- Multi-language support

## Resources & Documentation

- [React Native Documentation](https://reactnative.dev/)
- [React Navigation Documentation](https://reactnavigation.org/)
- [Expo Documentation](https://docs.expo.dev/)
- [Meta Mobile Developer Certificate](https://www.coursera.org/professional-certificates/meta-android-developer)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

**Your Name**
- GitHub: [@OmonUrkinbaev](https://github.com/OmonUrkinbaev)
- LinkedIn: [@OmonUrkinbaev](https://www.linkedin.com/in/omonurkinbaev/)

## Support

Have questions or found a bug? Please open an issue on GitHub or contact me directly.

---

**Last Updated:** January 15, 2026
