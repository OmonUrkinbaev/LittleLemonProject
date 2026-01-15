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
  accent: '#EE9972',
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
    marginBottom: spacing.md,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  heroContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
    gap: spacing.lg,
  },
  textContainer: {
    flex: 1,
    maxWidth: '55%',
  },
  heroTitle: {
    color: colors.secondary,
    fontSize: isSmallScreen ? 36 : 52,
    fontWeight: '700',
    fontFamily: 'MarkaziText-Regular',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  heroSubtitle: {
    color: colors.textLight,
    fontSize: isSmallScreen ? 26 : 36,
    fontFamily: 'MarkaziText-Regular',
    marginBottom: spacing.md,
  },
  heroDescription: {
    color: colors.textLight,
    fontSize: isSmallScreen ? 14 : 16,
    lineHeight: isSmallScreen ? 22 : 26,
    fontFamily: 'Karla-Regular',
    marginBottom: spacing.lg,
    opacity: 0.95,
  },
  imageContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    aspectRatio: 0.85,
    width: isSmallScreen ? 130 : 180,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
});

export default HeroBanner;