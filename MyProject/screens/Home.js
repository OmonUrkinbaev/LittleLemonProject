import React, { useState, useEffect, useMemo } from 'react';
import { View, Image, StyleSheet, Pressable, FlatList, Text, SafeAreaView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { initDatabase, saveMenuItems, getMenuItems, filterByQueryAndCategories } from '../database/database';
import SearchBar from '../utils/SearchBar';
import CategoryFilter from '../utils/CategoryFilter';
import HeroBanner from '../utils/HeroBanner';

const HomeScreen = ({ route }) => {
    const navigation = useNavigation();
    const [avatar, setAvatar] = useState(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [menuItems, setMenuItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [availableCategories, setAvailableCategories] = useState([]);
    const [dbInitialized, setDbInitialized] = useState(false);

    // Initialize database first
    useEffect(() => {
        const initDb = async () => {
            try {
                await initDatabase();
                setDbInitialized(true);
            } catch (error) {
                console.error('Database initialization error:', error);
                Alert.alert('Error', 'Failed to initialize database');
            }
        };

        initDb();
    }, []);

    // Add this useEffect to handle filtering with debounce - ONLY after DB is ready
    useEffect(() => {
        if (!dbInitialized) return;

        const timer = setTimeout(() => {
            const filterItems = async () => {
                try {
                    const filtered = await filterByQueryAndCategories(searchQuery, selectedCategories);
                    setMenuItems(filtered);
                } catch (error) {
                    console.error('Filter error:', error);
                    Alert.alert('Error', 'Failed to filter items');
                }
            };
    
            filterItems();
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery, selectedCategories, dbInitialized]);


    useEffect(() => {
        if (route.params?.updatedAvatar) {
            setAvatar(route.params.updatedAvatar);
        }
    }, [route.params]);

    useEffect(() => {
        const loadProfileImage = async () => {
            try {
                const profileData = await AsyncStorage.getItem('profileData');
                if (profileData) {
                    const parsedData = JSON.parse(profileData);
                    if (parsedData.avatar) {
                        setAvatar(parsedData.avatar);
                    }
                    if (parsedData.firstName) {
                        setFirstName(parsedData.firstName);
                    }
                    if (parsedData.lastName) {
                        setLastName(parsedData.lastName);
                    }
                }
            } catch (error) {
                console.error('Error loading profile image:', error);
            }
        };

        loadProfileImage();
    }, []);

    // Update this useEffect to skip initDatabase since it's already done
    useEffect(() => {
        const fetchMenuData = async () => {
            try {
                const storedMenuItems = await getMenuItems();
                
                if (storedMenuItems.length === 0) {
                    const response = await fetch(
                        'https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json'
                    );
                    const json = await response.json();
                    const menuData = json.menu.map(item => ({
                        ...item,
                        image: `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${item.image}?raw=true`
                    }));
                    await saveMenuItems(menuData);
                    setMenuItems(menuData);
                    
                    const categories = [...new Set(menuData.map(item => item.category))];
                    setAvailableCategories(categories);
                } else {
                    setMenuItems(storedMenuItems);
                    
                    const categories = [...new Set(storedMenuItems.map(item => item.category))];
                    setAvailableCategories(categories);
                }
            } catch (error) {
                console.error('Error fetching menu data:', error);
                Alert.alert('Error', 'Failed to load menu items');
            }
        };

        if (dbInitialized) {
            fetchMenuData();
        }
    }, [dbInitialized]);

    const handleCategorySelect = (category) => {
        setSelectedCategories(prev => {
            if (prev.includes(category)) {
                return prev.filter(c => c !== category);
            }
            return [...prev, category];
        });
    };


    const renderMenuItem = ({ item }) => (
    <Pressable style={styles.menuItemContainer}>
        <View style={styles.menuItem}>
            <Image source={{ uri: item.image }} style={styles.menuImage} />
            <View style={styles.menuInfo}>
                <Text style={styles.menuTitle}>{item.name}</Text>
                <Text style={styles.menuDescription} numberOfLines={2}>{item.description}</Text>
                <Text style={styles.menuPrice}>${item.price.toFixed(2)}</Text>
            </View>
        </View>
    </Pressable>
);

    const renderHeader = () => (
        <View>
            <View style={styles.header}>
                <Image
                    source={require('../assets/Logo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
                <Pressable
                    onPress={() => navigation.navigate('Profile')}
                    style={styles.avatarContainer}
                    accessibilityLabel="Profile picture"
                    accessibilityRole="button"
                >
                    {avatar ? (
                        <Image source={{ uri: avatar }} style={styles.avatar} />
                    ) : (
                        <View style={styles.avatarPlaceholder}>
                            <Text style={styles.avatarText}>
                                {firstName.charAt(0)}
                                {lastName.charAt(0)}
                            </Text>
                        </View>
                    )}
                </Pressable>
            </View>
            <HeroBanner />
            <View style={styles.body}>
                <SearchBar onSearch={setSearchQuery} />
                <CategoryFilter
                    categories={availableCategories}
                    selectedCategories={selectedCategories}
                    onSelect={handleCategorySelect}
                />
            </View>
        </View>
    );

    const memoizedHeader = useMemo(() => renderHeader(), [avatar, firstName, lastName, availableCategories, selectedCategories]);

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={menuItems}
                renderItem={renderMenuItem}
                keyExtractor={item => item.id.toString()}
                ListHeaderComponent={memoizedHeader}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No items found matching your criteria</Text>
                }
            />
        </SafeAreaView>
    );
};

HomeScreen.defaultProps = {
    route: {
        params: {}
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 15,
        paddingBottom: 15,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    body:{
        backgroundColor: '#fff',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 16,
        marginBottom: 8,
    },
    logo: {
        height: 50,
        width: 150,
    },
    avatarContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        overflow: 'hidden',
        borderColor: '#495E57',
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatar: { width: 50, height: 50, borderRadius: 25 },
    avatarPlaceholder: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#495E57',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
    menuItemContainer: {
        marginHorizontal: 12,
        marginVertical: 6,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    menuItem: {
        flexDirection: 'row',
        padding: 12,
    },
    menuImage: {
        width: 90,
        height: 90,
        borderRadius: 8,
    },
    menuInfo: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'space-between',
    },
    menuTitle: {
        fontSize: 17,
        fontWeight: '600',
        marginBottom: 4,
        color: '#333',
    },
    menuDescription: {
        fontSize: 13,
        color: '#777',
        marginBottom: 6,
        lineHeight: 18,
    },
    menuPrice: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#495E57',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 40,
        fontSize: 16,
        color: '#999',
    },
});

export default HomeScreen;