import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, Platform } from 'react-native';

const HeroBanner = () => {
  return (
    <View style={styles.heroContainer}>
      <View style={styles.heroContent}>
        <View style={styles.textContainer}>
          <Text style={styles.heroTitle}>Little Lemon</Text>
          <Text style={styles.heroSubtitle}>Chicago</Text>
          <Text style={styles.heroDescription} numberOfLines={4}>
            We are a family-owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.
          </Text>
        </View>
        
        <View style={styles.imageContainer}>
          <Image
            source={require('../assets/hero-image.png')}
            style={styles.heroImage}
            resizeMode="cover"
            accessibilityLabel="Little Lemon restaurant interior"
            accessibilityRole="image"
          />
        </View>
      </View>
    </View>
  );
};

// Screen dimensions
const { width, height } = Dimensions.get('window');
const isSmallScreen = width < 375;

// Style constants
const colors = {
  primary: '#495E57',
  secondary: '#F4CE14',
  textLight: '#EDEFEE',
};

const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

const styles = StyleSheet.create({
  heroContainer: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.md,
    ...Platform.select({
      ios: {
        paddingTop: spacing.xl + (height > 800 ? spacing.lg : 0),
      },
    }),
  },
  heroContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    maxWidth: 1200, // Maximum content width for large screens
    width: '100%',
    alignSelf: 'center',
  },
  textContainer: {
    flex: 1,
    marginRight: spacing.lg,
    maxWidth: '60%',
  },
  heroTitle: {
    color: colors.secondary,
    fontSize: isSmallScreen ? 32 : 48,
    fontWeight: '700',
    fontFamily: 'MarkaziText-Regular',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  heroSubtitle: {
    color: colors.textLight,
    fontSize: isSmallScreen ? 24 : 32,
    fontFamily: 'MarkaziText-Regular',
    marginBottom: spacing.md,
  },
  heroDescription: {
    color: colors.textLight,
    fontSize: isSmallScreen ? 14 : 16,
    lineHeight: isSmallScreen ? 20 : 24,
    fontFamily: 'Karla-Regular',
    marginBottom: spacing.md,
  },
  imageContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  heroImage: {
    width: isSmallScreen ? 100 : 140,
    height: isSmallScreen ? 120 : 160,
    aspectRatio: 1,
  },
});

export default HeroBanner;