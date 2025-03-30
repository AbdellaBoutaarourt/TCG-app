import React, { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, Linking } from 'react-native';
import cartImage from '../images/cart.png';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import Feather from '@expo/vector-icons/Feather';

const Cartscreen = () => {
    const navigation = useNavigation();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deliveryMethod, setDeliveryMethod] = useState('shipping');

    useFocusEffect(
        React.useCallback(() => {
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
        }, [])
    );

    const handleDeleteItem = async (productId) => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) return;

            const response = await axios.delete('http://localhost:3001/cart', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                data: { productId },
            });

            if (response.data) {
                setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
            }
        } catch (error) {
            console.error('Erreur lors de la suppression du produit:', error);
        }
    };


    const handleSearchButtonPress = () => {
        navigation.navigate('Recherche');
    };

    const handleCheckout = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                Alert.alert('Erreur', 'Vous devez être connecté pour passer une commande.');
                return;
            }

            const products = cartItems.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image,
            }));

            const response = await axios.post(
                'http://localhost:3001/payment/create-checkout-session',
                {
                    products,
                    deliveryMethod,
                    successUrl: "http://localhost:8081/success",
                    cancelUrl: "http://localhost:8081/error"
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data && response.data.id) {
                const stripeUrl = response.data.url;

                const canOpen = await Linking.canOpenURL(stripeUrl);
                if (canOpen) {
                    await Linking.openURL(stripeUrl);

                } else {
                    Alert.alert('Erreur', 'Impossible d\'ouvrir le lien de paiement.');
                }
            } else {
                Alert.alert('Erreur', 'Impossible de créer la session de paiement.');
            }
        } catch (error) {
            console.error('Erreur lors du passage à la caisse:', error);
            Alert.alert('Erreur', 'Une erreur s\'est produite lors du passage à la caisse.');
        }
    };


    const handleQuantityChange = async (itemId, newQuantity) => {
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === itemId ? { ...item, quantity: newQuantity } : item
            )
        );

    };


    const renderItem = ({ item }) => (
        <View style={styles.item}>
            <Image source={{ uri: item.image }} style={styles.productImage} />

            <View style={{ flex: 1, gap: 30, }}>
                <View style={styles.itemDetails}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <TouchableOpacity onPress={() => handleDeleteItem(item.id)}>
                        <Feather name="x" size={24} color="black" />
                    </TouchableOpacity>

                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={styles.itemPrice}>€ {item.price}</Text>
                    <View style={styles.quantityContainer}>
                        <Picker
                            selectedValue={item.quantity}
                            onValueChange={(value) => handleQuantityChange(item.id, value)}
                            style={styles.quantityPicker}
                            dropdownIconColor="#08744E"
                        >
                            {[...Array(10).keys()].map((i) => (
                                <Picker.Item key={i + 1} label={`${i + 1}`} value={i + 1} />
                            ))}
                        </Picker>
                    </View>
                </View>

            </View>
        </View >

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
            <View style={{
                flex: 1,
                padding: 10,
            }}>

                <FlatList
                    data={cartItems}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                />
            </View>

            <View style={styles.totalContainer}>
                <Text style={styles.totalText}>Prix total: € {cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}</Text>
                <Text style={styles.vatText}>TVA incluse</Text>
                <Text style={styles.shippingText}>Livraison Gratuite</Text>
                <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
                    <Text style={styles.checkoutButtonText}>Caisse</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center'
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
    productImage: {
        width: 100,
        height: 100,
        borderRadius: 8,
    },
    itemDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12
    },

    item: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderColor: "#DBDBDB",
        flexDirection: 'row',
        alignItems: 'center',
        borderStyle: 'dashed',
        flex: 1,
        justifyContent: 'space-between',
        gap: 20,
    },
    itemName: {
        fontSize: 13,
        fontFamily: 'InterRegular',
        flex: 1,
    },
    itemPrice: {
        fontSize: 14,
        fontFamily: 'InterRegular',
        color: '#08744E',
    },
    quantityContainer: {
        borderWidth: 1,
        borderColor: '#D3D3D3',
        borderRadius: 100,
        width: 100,
        height: 30,
        justifyContent: 'center'
    },
    quantityLabel: {
        fontSize: 14,
        fontFamily: 'InterRegular',
        color: 'black',
    },

    totalContainer: {
        padding: 16,
        borderTopWidth: 1,
        borderColor: '#e0e0e0',
        width: "100%"
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