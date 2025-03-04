import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

const FavoritesScreen = () => {
    const [favorites, setFavorites] = useState([]);

    useFocusEffect(
        React.useCallback(() => {
            const fetchFavorites = async () => {
                try {
                    const token = await AsyncStorage.getItem('token');
                    if (!token) return;

                    const response = await axios.get('http://localhost:3001/favorites', {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });

                    if (response.data) {
                        setFavorites(response.data);
                    }
                } catch (error) {
                    console.error('Erreur lors de la récupération des favoris:', error);
                }
            };

            fetchFavorites();
        }, [])
    );

    const handleRemoveFromFavorites = async (productId) => {
        try {
            const token = await AsyncStorage.getItem('token');

            if (!token) {
                Alert.alert('Erreur', 'Vous devez être connecté pour retirer des favoris.');
                return;
            }

            const response = await axios.delete(
                'http://localhost:3001/favorites',
                {
                    data: { productId },
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.data) {
                setFavorites(prevFavorites => prevFavorites.filter(favorite => favorite.id !== productId));
            } else {
                Alert.alert('Erreur', 'Impossible de retirer des favoris.');
            }
        } catch (error) {
            Alert.alert('Erreur', 'Une erreur s\'est produite lors de la suppression des favoris.');
            console.error(error);
        }
    };

    const handleAddToCart = async (productId) => {
        try {
            const token = await AsyncStorage.getItem('token');

            if (!token) {
                Alert.alert('Erreur', 'Vous devez être connecté pour ajouter au panier.');
                return;
            }

            const response = await axios.post(
                'http://localhost:3001/cart',
                { productId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.data) {
                Alert.alert('Succès', 'Produit ajouté au panier.');
                console.log('Produit ajouté au panier.')
            } else {
                Alert.alert('Erreur', response.data.message || 'Impossible d\'ajouter au panier.');
            }
        } catch (error) {
            Alert.alert('Erreur', 'Une erreur s\'est produite lors de l\'ajout au panier.');
            console.error(error);
        }
    };
    return (
        <View style={styles.container}>
            <FlatList
                data={favorites}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ backgroundColor: '#F1F5F9', paddingVertical: 10, paddingHorizontal: 10, flex: 1 }}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <View style={styles.itemContainer}>

                            <TouchableOpacity
                                onPress={() => handleRemoveFromFavorites(item.id)}
                                style={styles.iconButton}
                            >
                                <Ionicons
                                    name="heart"
                                    size={24}
                                    color={"red"}
                                />
                            </TouchableOpacity>
                            <View style={styles.imageContainer}>
                                <Image source={{ uri: item.image }} style={styles.image} />
                            </View>
                            <TouchableOpacity
                                onPress={() => handleAddToCart(item.id)}
                                style={styles.CartButton}
                            >
                                <FontAwesome name="cart-plus" size={24} color="white" />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.itemName}>{item.name}</Text>
                        <Text style={styles.itemMinQuantity}>Référence: {item.reference}</Text>
                        <Text style={styles.itemPrice}>€ {item.price}</Text>
                    </View>

                )
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    item: {
        margin: 4,
        backgroundColor: 'white',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#C1C2C1',
        width: 175,
        justifyContent: 'space-between',
        elevation: 2,

    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 10,
    },
    imageContainer: {
        alignItems: 'center',
        width: "100%"
    },
    itemContainer: {
        width: '100%',
        justifyContent: "space-between",
        alignItems: 'flex-end',
        borderBottomWidth: 1,
        borderColor: "#C1C2C1",

    },
    itemName: {
        paddingHorizontal: 10,
        marginTop: 10,
        marginBottom: 5,
        fontSize: 13,
        fontFamily: 'InterSemiBold',
        textAlign: 'left',
    },
    itemPrice: {
        paddingHorizontal: 10,
        marginTop: 5,
        fontSize: 14,
        fontFamily: 'InterSemiBold',
        color: 'black',
        marginBottom: 4,
    },
    itemMinQuantity: {
        paddingHorizontal: 10,
        marginBottom: 7,
        width: '100%',
        fontSize: 11,
        color: '#666',
        fontFamily: 'InterRegular',
        textAlign: 'left',

    },
    iconButton: {
        padding: 8,
        backgroundColor: '#F2F2F2',
        width: "auto",
        marginTop: 10
    },
    CartButton: {
        padding: 7,
        backgroundColor: '#01A96E',
    },
});

export default FavoritesScreen;
