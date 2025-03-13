import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, Pressable, FlatList, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = ({ route }) => {
    const navigation = useNavigation();
    const [avatar, setAvatar] = useState(null);
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
                } else {
                    throw new Error('Invalid menu data format');
                }
            } catch (error) {
                console.error('Error fetching menu data:', error);
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
                    onPress={() => navigation.navigate('ProfileScreen')}
                    style={styles.avatarContainer}
                    accessibilityLabel="Profile picture"
                    accessibilityRole="button"
                >
                    {avatar && (
                        <Image
                        source={avatar ? { uri: avatar } : require('../assets/default-avatar.png')}
                        style={styles.avatar}
                        accessibilityLabel="User avatar"
                    />
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
        width: 40,
        height: 40,
        borderRadius: 20,
        overflow: 'hidden',
    },
    avatar: {
        width: '100%',
        height: '100%',
    },
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