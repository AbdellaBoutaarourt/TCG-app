import React, { useEffect, useState } from 'react';
import { Ionicons, FontAwesome, AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import logo from '../images/logo.gif'
import { useNavigation } from '@react-navigation/native';

import {
    View,
    Text,
    StyleSheet,
    TextInput,
    ScrollView,
    Image, FlatList, TouchableOpacity,
} from "react-native";

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


    useEffect(() => {
        fetch('http://192.168.1.37:3001/products')
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

    }, []);


    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                if (!token) return;

                const response = await axios.get('http://192.168.1.37:3001/favorites', {
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
    }, []);

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
                'http://192.168.1.37:3001/favorites',
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
                'http://192.168.1.37:3001/favorites',
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
                'http://192.168.1.37:3001/cart',
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
            {/* Recommandations */}
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
                            Voir plus <AntDesign name="right" size={11} color="#01A96E" />
                        </Text>
                    </TouchableOpacity>                </View>

                <FlatList
                    data={categories}
                    renderItem={renderCategoryItem}
                    keyExtractor={(item) => item.name}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ backgroundColor: '#F6F5F8', paddingVertical: 10 }}
                />
            </View>

        </ScrollView >
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#F1F5F9",
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
        textAlign: "left",
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
});

export default HomeScreen;
