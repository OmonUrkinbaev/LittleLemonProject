import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';

const HeroBanner = ({ onSearch }) => {
  return (
    <View style={styles.heroContainer}>
      <View style={styles.heroContent}>
        <View style={styles.heroText}>
          <View style={styles.headerContainer}>
            <Text style={styles.heroTitle}>Little Lemon</Text>  
          </View>
          <Text style={styles.heroSubtitle}>Chicago</Text>
          <Text style={styles.heroDescription}>
            We are a family-owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.
          </Text>
        </View>
        <View style={styles.imageContainer}>
          <Image
            source={require('../assets/hero-image.png')}
            style={styles.heroImage}
            resizeMode="cover"
            accessibilityLabel="Little Lemon restaurant interior"
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  heroContainer: {
    backgroundColor: '#495E57',
    paddingVertical: 32,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#374B45',
  },
  heroContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: Dimensions.get('window').width * 0.9,
    alignSelf: 'center',
  },
  heroText: {
    flex: 1,
    marginRight: 24,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
    gap: 8,
  },
  heroTitle: {
    color: '#F4CE14',
    fontSize: 40,
    fontWeight: 'bold',
    fontFamily: 'Markazi',
  },
  heroSubtitle: {
    color: '#EDEFEE',
    fontSize: 28,
    fontFamily: 'Markazi',
  },
  heroDescription: {
    color: '#EDEFEE',
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Karla',
    maxWidth: '90%',
  },
  imageContainer: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  heroImage: {
    width: 140,
    height: 160,
    borderRadius: 16,
  },
});

export default HeroBanner;