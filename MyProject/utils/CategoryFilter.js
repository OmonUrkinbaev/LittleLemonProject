import React from 'react';
import { View, ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';

const CategoryFilter = ({ categories, selectedCategories, onSelect }) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {categories.map(category => (
          <TouchableOpacity
            key={category}
            onPress={() => onSelect(category)}
            style={[
              styles.categoryButton,
              selectedCategories.includes(category) && styles.selectedCategory
            ]}
          >
            <Text style={[
              styles.categoryText,
              selectedCategories.includes(category) && styles.selectedText
            ]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  scrollContainer: {
    paddingHorizontal: 15,
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#EDEFEE',
    marginRight: 10,
  },
  selectedCategory: {
    backgroundColor: '#495E57',
  },
  categoryText: {
    color: '#495E57',
    fontWeight: '500',
  },
  selectedText: {
    color: 'white',
  },
});

export default CategoryFilter;