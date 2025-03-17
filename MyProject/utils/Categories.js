import React from 'react';
import { ScrollView, Text, Pressable, StyleSheet } from 'react-native';



const Categories = ({ categories, selectedCategories, onToggleCategory }) => {
    return (
        <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesContainer}
        >
            {categories.map((category) => (
                <Pressable
                    key={category}
                    style={[
                        styles.categoryButton,
                        selectedCategories.includes(category) && styles.selectedCategory
                    ]}
                    onPress={() => onToggleCategory(category)}
                >
                    <Text style={[
                        styles.categoryText,
                        selectedCategories.includes(category) && styles.selectedCategoryText
                    ]}>
                        {category}
                    </Text>
                </Pressable>
            ))}
        </ScrollView>
    );
    
};

const styles = StyleSheet.create({
    categoriesContainer: {
        paddingVertical: 16,
        paddingHorizontal: 8,
        backgroundColor: '#fff',
    },
    categoryButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginHorizontal: 4,
        borderRadius: 16,
        backgroundColor: '#EDEFEE',
    },
    selectedCategory: {
        backgroundColor: '#495E57',
    },
    categoryText: {
        fontSize: 16,
        color: '#495E57',
    },
    selectedCategoryText: {
        color: '#EDEFEE',
    },
});
export default Categories;