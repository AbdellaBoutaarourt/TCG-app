import React, { useEffect, useState } from 'react';
import { Ionicons, FontAwesome, AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import logo from '../images/logo.gif'
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet, TextInput, ScrollView, Image, FlatList, TouchableOpacity, Alert, Modal, Button } from "react-native";

const categories = [
    { name: "Assiettes & plateaux", image: require('../images/assietes1.png') },
    { name: "Barquettes & conteneurs", image: require('../images/barquettes.png') },
    { name: "Boîtes à burger", image: require('../images/burger1.png') },

];

const HomeScreen = () => {
    const [data, setData] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const navigation = useNavigation();
    const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);

    useEffect(() => {
        const currentUrl = window.location.href;

        fetch('http://localhost:3001/products')
            .then((response) => response.json())
            .then((json) => {
                const duplicatedData = json.products.concat(json.products);
                setData(duplicatedData);
                setLoading(false);
            })
            .catch((err) => {
                setError(err);
                setLoading(false);
            });

        if (currentUrl.includes('success')) {
            setIsPaymentSuccess(true);
        }

    }, []);

    const handlePaymentSuccess = () => {
        setIsPaymentSuccess(true);
    };

    const handleCloseModal = () => {
        setIsPaymentSuccess(false);
    };


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


    const isFavorite = (productId) => {
        return favorites.some(favorite => favorite.id === productId);
    };

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

    const handleAddToFavorites = async (productId) => {
        try {
            const token = await AsyncStorage.getItem('token');

            if (!token) {
                Alert.alert('Erreur', 'Vous devez être connecté pour ajouter aux favoris.');
                return;
            }

            const response = await axios.post(
                'http://localhost:3001/favorites',
                { productId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            if (response.data) {
                setFavorites(prevFavorites => [...prevFavorites, { id: productId }]);

            } else {
                Alert.alert('Erreur', 'Impossible d\'ajouter aux favoris.');
            }
        } catch (error) {
            Alert.alert('Erreur', 'Une erreur s\'est produite lors de l\'ajout aux favoris.');
            console.error(error);
        }
    };
    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Image source={logo} />
            </View>
        );
    }

    const renderCategoryItem = ({ item }) => (
        <TouchableOpacity
            style={styles.categoryItem}
            onPress={() => navigation.navigate("CategoryProducts", { categoryName: item.name })}
        >
            <Image source={item.image} style={styles.categoryImage} />
            <Text style={styles.categoryText}>{item.name}</Text>
        </TouchableOpacity>

    );

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
        <ScrollView style={styles.container}>
            <View style={{ backgroundColor: 'white', paddingVertical: 15, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}>
                <View style={styles.searchBar}>
                    <Ionicons name="search" size={20} color="#AFB5B7" />
                    <TextInput
                        placeholder="Rechercher un produit"
                        style={styles.searchInput}
                        value={searchText}
                        onChangeText={(text) => {
                            setSearchText(text);
                            navigation.setParams({ searchText: text });
                        }}

                    />
                </View>
            </View>
            {/* Payment success pop-up */}
            <Modal
                transparent={true}
                visible={isPaymentSuccess}
                animationType="fade"
                onRequestClose={handleCloseModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Paiement réussi !</Text>
                        <Text style={styles.modalMessage}>Merci pour votre commande !</Text>
                        <TouchableOpacity style={styles.CloseButton} onPress={handleCloseModal}>
                            <Text style={styles.CloseButtonText}>Fermer</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            {isPaymentSuccess && (
                <TouchableOpacity
                    style={styles.paymentButton}
                    onPress={handlePaymentSuccess}
                >
                    <Text style={styles.paymentButtonText}>Paiement Réussi</Text>
                </TouchableOpacity>
            )}

            {/* Recommandations */}
            <View style={{ backgroundColor: '#F1F5F9' }}>
                <View style={styles.recommendationCard}>

                    {/* Contenu superposé */}
                    <View style={styles.recommendationContent}>
                        <Text style={styles.recommendTitle}>Vous allez adorer ces articles</Text>
                        <Text style={styles.recommendDescription}>Nos best-sellers à découvrir</Text>
                        <TouchableOpacity style={styles.button}>
                            <Text style={styles.buttonText}>Découvrir</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.recommendationImageContainer}>
                        <Image
                            source={require('../images/whitebg.png')}
                            style={styles.recommendationImage}
                        />
                    </View>
                </View>

            </View>

            {/* Section "Pour vous" */}
            <View style={{
                backgroundColor: 'white', padding: 15, borderTopEndRadius: 20, borderTopStartRadius: 20,
            }}>
                <Text style={styles.sectionTitle}>Pour vous</Text>
                <FlatList
                    data={data}
                    keyExtractor={(item, index) => `${item.id}-${index}`}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingVertical: 10 }}
                    renderItem={({ item }) => (
                        <View style={styles.item}>
                            <View style={styles.itemContainer}>

                                <TouchableOpacity
                                    onPress={() => isFavorite(item.id) ? handleRemoveFromFavorites(item.id) : handleAddToFavorites(item.id)}
                                    style={styles.iconButton}
                                >
                                    <Ionicons
                                        name={isFavorite(item.id) ? "heart" : "heart-outline"}
                                        size={24}
                                        color={isFavorite(item.id) ? "red" : "#08744E"}
                                    />
                                </TouchableOpacity>
                                <View style={styles.imageContainer}>
                                    <Image source={{ uri: item.image }} style={styles.image} />
                                </View>
                            </View>

                            <Text style={styles.itemName}>{item.name}</Text>
                            <View style={{ flexDirection: 'row', justifyContent: "space-between", marginBottom: 10, marginHorizontal: 10, alignItems: 'center', backgroundColor: '#F5F5F5', borderRadius: 20 }}>
                                <Text style={styles.itemPrice}>€ {item.price}</Text>
                                <TouchableOpacity
                                    onPress={() => handleAddToCart(item.id)}
                                    style={styles.CartButton}
                                >
                                    <FontAwesome name="cart-plus" size={18} color="white" />
                                </TouchableOpacity>
                            </View>

                        </View>

                    )
                    }
                />
            </View>

            {/* Catégories */}
            <View style={styles.categoryCards}>
                <View style={styles.categoryTitle}>
                    <Text style={styles.sectionTitle}>Catégories</Text>
                    <TouchableOpacity onPress={() => navigation.navigate("Recherche")}>
                        <Text style={styles.sectionMore}>
                            Voir plus <AntDesign name="right" size={13} color="#01A96E" />
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={{ alignItems: 'center' }}>
                    <FlatList
                        data={categories}
                        renderItem={renderCategoryItem}
                        keyExtractor={(item) => item.name}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingVertical: 10, justifyContent: 'center' }}
                    />
                </View>

            </View>

            {/* Section "Pour vous" */}
            <View style={{
                backgroundColor: 'white', padding: 15, borderTopEndRadius: 20, borderTopStartRadius: 20,
            }}>
                <Text style={styles.sectionTitle}>Récemment consulté</Text>
                <FlatList
                    data={data}
                    keyExtractor={(item, index) => `${item.id}-${index}`}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingVertical: 10 }}
                    renderItem={({ item }) => (
                        <View style={styles.item}>
                            <View style={styles.itemContainer}>

                                <TouchableOpacity
                                    onPress={() => isFavorite(item.id) ? handleRemoveFromFavorites(item.id) : handleAddToFavorites(item.id)}
                                    style={styles.iconButton}
                                >
                                    <Ionicons
                                        name={isFavorite(item.id) ? "heart" : "heart-outline"}
                                        size={24}
                                        color={isFavorite(item.id) ? "red" : "#08744E"}
                                    />
                                </TouchableOpacity>
                                <View style={styles.imageContainer}>
                                    <Image source={{ uri: item.image }} style={styles.image} />
                                </View>
                                <TouchableOpacity
                                    onPress={() => handleAddToCart(item.id)}
                                    style={{ padding: 7, backgroundColor: '#01A96E' }}
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

            {/* Magasin */}
            <View style={styles.shopsection}>


                <Text style={styles.sectionTitle}>Notre magasin</Text>

                <View style={styles.shopimagesection}>
                    <View style={styles.shopimage}>
                        <Image
                            source={require('../images/magasin.png')}
                            style={styles.recommendationImage}
                        />
                        <View style={styles.visitLocation}>
                            <Text style={styles.sectionMore}>Visiter L'emplacement </Text><AntDesign name="right" size={13} color="#01A96E" />
                        </View>


                    </View>
                </View>

            </View>

        </ScrollView >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    searchBar: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f1f1f1",
        borderRadius: 100,
        paddingHorizontal: 100,
        paddingHorizontal: 10,
        paddingVertical: 1,
        padding: 15,
        marginHorizontal: 20

    },
    searchInput: {
        marginLeft: 10,
        fontSize: 16,
        color: "black",
        width: "100%"

    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        width: 300,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalMessage: {
        fontSize: 16,
        marginBottom: 20,
    },
    paymentButton: {
        backgroundColor: '#01A96E',
        padding: 10,
        marginTop: 20,
        alignItems: 'center',
    },
    CloseButton: {
        backgroundColor: '#01A96E',
        padding: 10,
        marginTop: 20,
        alignItems: 'center',
        borderRadius: 100,
        paddingHorizontal: 15,
    },
    CloseButtonText: {
        color: 'white'

    },
    paymentButtonText: {
        color: 'white',
        fontSize: 16,
    },
    recommendDescription: {
        fontSize: 11,
        marginTop: 8,
        fontFamily: 'InterSemiBold',
        color: "#737171"
    },
    recommendationCard: {
        paddingLeft: 20,
        backgroundColor: '#FFF3E7',
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 10,
        margin: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        elevation: 5,
    },
    recommendationContent: {
        flex: 1,
    },
    recommendationImageContainer: {
        width: '50%',
        alignItems: 'flex-end',
    },
    recommendationImage: {
        width: '100%',
        height: 150,
        resizeMode: 'cover',
    },
    recommendTitle: {
        fontSize: 16,
        fontFamily: 'InterSemiBold',
        width: '80%',

    },
    button: {
        marginTop: 10,
        backgroundColor: "#01A96E",
        padding: 10,
        borderRadius: 20,
        width: '60%',
    },
    buttonText: {
        color: "#fff",
        fontFamily: 'InterSemiBold',
        textAlign: 'center'

    },
    sectionTitle: {
        fontSize: 16,
        fontFamily: 'InterSemiBold',
    },
    sectionMore: {
        fontSize: 12,
        fontFamily: 'InterSemiBold',
        color: '#01A96E'
    },
    productCard: {
        marginRight: 10,
        alignItems: "center"
    },
    productImage: {
        marginBottom: 5
    },
    categoryItem: {
        flex: 1,
        alignItems: "center",
        backgroundColor: "#FFF",
        borderRadius: 10,
        margin: 5,
        elevation: 5,
    },
    categoryCards: {
        padding: 15,
        justifyContent: 'center'
    },
    categoryTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    categoryImage: {
        width: 114,
        height: 76,
    },
    categoryText: {
        fontSize: 10,
        fontFamily: "InterRegular",
        textAlign: "center",
        maxWidth: 100,
        color: '#444444',
        marginVertical: 5

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
        width: "fit-content",
        marginTop: 10
    },
    CartButton: {
        padding: 7,
        backgroundColor: '#01A96E',
        borderRadius: 100
    },
    shopsection: {
        padding: 15,
        backgroundColor: '#fff',

    },
    shopimagesection: {
        backgroundColor: '#fff',
        borderRadius: 10,
        elevation: 5,
        marginVertical: 10
    },
    visitLocation: {
        position: "absolute",
        flexDirection: 'row',
        alignItems: 'center',
        bottom: 5,
        right: 0,
        padding: 2,

    },
    visitText: {
        color: "white",
        fontWeight: "bold",
    },

});

export default HomeScreen;
