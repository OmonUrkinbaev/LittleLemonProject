import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, Pressable, FlatList, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { initDatabase, saveMenuItems, getMenuItems, clearMenuItems } from '../database/database';


const HomeScreen = ({ route }) => {
    const navigation = useNavigation();
    const [avatar, setAvatar] = useState(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [menuItems, setMenuItems] = useState([]);

    useEffect(() => {
        if (route.params?.updatedAvatar) {
            setAvatar(route.params.updatedAvatar);
        }
    }, [route.params]);
    //before it was [route.params?.updatedAvatar]

    // useEffect(() => {
    //     let isMounted = true;
    //     const loadProfileImage = async () => {
    //         try {
    //             const profileData = await AsyncStorage.getItem('profileData');
    //             if (profileData && isMounted) {
    //                 const { avatar } = JSON.parse(profileData);
    //                 setAvatar(avatar);
    //             }
    //         } catch (error) {
    //             console.error('Error loading profile image:', error);
    //         }
    //     };

    //     loadProfileImage();
    //     return () => {
    //         isMounted = false;
    //     };

    // }, []);

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

    useEffect(() => {
        const fetchMenuData = async () => {
            try {
                await initDatabase();

                // Try to load menu items from database first
                const storedMenuItems = await getMenuItems();
                if (storedMenuItems.length === 0) {
                    const response = await fetch(
                        'https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json'
                    );
                    if (!response.ok) {
                        throw new Error('Failed to fetch menu data');
                    }
                    const json = await response.json();
                    if (json.menu && Array.isArray(json.menu)) {
                        const menuData = json.menu.map(item => ({
                            ...item,
                            image: `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${item.image}?raw=true`
                        }));
                        setMenuItems(menuData);
                        await saveMenuItems(menuData);
                    } else {
                        throw new Error('Invalid menu data format');
                    }
                }
                else{
                    //use the data from the database
                    setMenuItems(storedMenuItems);
                }
                // const response = await fetch(
                //     'https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json'
                // );
                // if (!response.ok) {
                //     throw new Error('Failed to fetch menu data');
                // }
                // const json = await response.json();
                // if (json.menu && Array.isArray(json.menu)) {
                //     const menuData = json.menu.map(item => ({
                //         ...item,
                //         image: `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${item.image}?raw=true`
                //     }));
                //     setMenuItems(menuData);
                // } else {
                //     throw new Error('Invalid menu data format');
                // }
            } catch (error) {
                console.error('Error fetching menu data:', error);
                Alert.alert('Error', 'Failed to load menu items');
                // Optionally, set an error state and display a message to the user
            }
        };

        fetchMenuData();
    }, []);

    const renderMenuItem = ({ item }) => (
        <View style={styles.menuItem}>
            <Image source={{ uri: item.image }} style={styles.menuImage} />
            <View style={styles.menuInfo}>
                <Text style={styles.menuTitle}>{item.name}</Text>
                <Text style={styles.menuDescription}>{item.description}</Text>
                <Text style={styles.menuPrice}>${item.price}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
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
                    {/* {avatar && (
                        <Image
                        source={avatar ? { uri: avatar } : require('../assets/scaryMan.png')}
                        style={styles.avatar}
                        accessibilityLabel="User avatar"
                    />
                    )} */}
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

            <FlatList
                data={menuItems}
                renderItem={renderMenuItem}
                keyExtractor={item => item.name}
                style={styles.menuList}
            />
        </View>
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
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 40,
        paddingBottom: 10,
        backgroundColor: '#fff',
    },
    logo: {
        height: 50,
        width: 150,
    },
    avatarContainer: {
        width: 70,
        height: 70,
        borderRadius: 50,
        overflow: 'hidden',
        borderColor: '#495E57',
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatar: { width: 100, height: 100, borderRadius: 50, alignSelf: 'center', marginBottom: 16 },
    avatarPlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: 16,
    },
    avatarText: { fontSize: 17, fontWeight: 'bold', color: '#fff' },
    menuList: {
        flex: 1,
    },
    menuItem: {
        flexDirection: 'row',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#cccccc',
    },
    menuImage: {
        width: 100,
        height: 100,
        borderRadius: 8,
    },
    menuInfo: {
        flex: 1,
        marginLeft: 16,
    },
    menuTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    menuDescription: {
        fontSize: 14,
        color: '#666666',
        marginBottom: 4,
    },
    menuPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#495E57',
    },
});

export default HomeScreen;