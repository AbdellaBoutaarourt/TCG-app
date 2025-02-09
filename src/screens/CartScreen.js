import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native';
import cartImage from '../images/cart.png';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Cartscreen = () => {
    const navigation = useNavigation();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                if (!token) return;

                const response = await axios.get('http://localhost:3001/cart', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.data) {
                    setCartItems(response.data);
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des produits du panier:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCartItems();
    }, []);

    const handleSearchButtonPress = () => {
        navigation.navigate('Recherche');
    };

    const renderItem = ({ item }) => (
        <View style={styles.item}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemPrice}>€ {item.price}</Text>
            <Text style={styles.itemQuantity}>Quantité: {item.quantity}</Text>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Chargement...</Text>
            </View>
        );
    }

    if (cartItems.length === 0) {
        return (
            <View style={styles.container}>
                <Image source={cartImage} style={styles.cartImage} />
                <Text style={styles.emptyCartText}>Votre panier est vide</Text>
                <Text style={styles.searchPromptText}>À la recherche de produits ?</Text>
                <TouchableOpacity style={styles.searchButton} onPress={handleSearchButtonPress}>
                    <Text style={styles.searchButtonText}>Rechercher des produits</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={cartItems}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.listContent}
            />
            <View style={styles.totalContainer}>
                <Text style={styles.totalText}>Prix total: € {cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)}</Text>
                <Text style={styles.vatText}>TVA incluse</Text>
                <Text style={styles.shippingText}>Livraison Gratuite</Text>
                <TouchableOpacity style={styles.checkoutButton}>
                    <Text style={styles.checkoutButtonText}>Caisse</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    cartImage: {
        width: 280,
        height: 245,
        marginBottom: 20,
        marginLeft: 100,
        alignSelf: 'center',
    },
    emptyCartText: {
        fontSize: 20,
        fontFamily: 'InterBold',
        marginBottom: 16,
        textAlign: 'center',
    },
    searchPromptText: {
        fontSize: 14,
        color: '#787878',
        fontFamily: 'InterRegular',
        marginBottom: 24,
        textAlign: 'center',
    },
    searchButton: {
        backgroundColor: '#08744E',
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 8,
        alignSelf: 'center',
    },
    searchButtonText: {
        fontSize: 16,
        color: '#fff',
        fontFamily: 'InterSemiBold',
    },
    listContent: {
        padding: 16,
    },
    item: {
        backgroundColor: '#F1F5F9',
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
    },
    itemName: {
        fontSize: 16,
        fontFamily: 'InterSemiBold',
        marginBottom: 8,
    },
    itemPrice: {
        fontSize: 14,
        fontFamily: 'InterRegular',
        color: '#08744E',
        marginBottom: 8,
    },
    itemQuantity: {
        fontSize: 14,
        fontFamily: 'InterRegular',
        color: '#666',
    },
    totalContainer: {
        padding: 16,
        borderTopWidth: 1,
        borderColor: '#e0e0e0',
    },
    totalText: {
        fontSize: 18,
        fontFamily: 'InterSemiBold',
        marginBottom: 8,
    },
    vatText: {
        fontSize: 14,
        fontFamily: 'InterRegular',
        color: '#666',
        marginBottom: 8,
    },
    shippingText: {
        fontSize: 14,
        fontFamily: 'InterRegular',
        color: '#08744E',
        marginBottom: 16,
    },
    checkoutButton: {
        backgroundColor: '#08744E',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    checkoutButtonText: {
        fontSize: 16,
        color: '#fff',
        fontFamily: 'InterSemiBold',
    },
});

export default Cartscreen;