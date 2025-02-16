import React, { useState, useEffect } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, FlatList, Image } from "react-native";
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";

const categories = [
    { name: "Assiettes & plateaux", image: require('../images/assietes.png') },
    { name: "Barquettes & conteneurs", image: require('../images/barque.png') },
    { name: "Boîtes à burger", image: require('../images/burger.png') },
    { name: "Couverts & ustensiles", image: require('../images/couvert.png') },
    { name: "Emballages \npour kapsalon", image: require('../images/pizza.png') },
    { name: "Gobelets &\nverres", image: require('../images/barque.png') },
    { name: "Papiers &\nfilms alimentaires", image: require('../images/couvert.png') },
    { name: "Rouleaux de \npapier aluminium", image: require('../images/assietes.png') },
    { name: "Sachets & pochettes", image: require('../images/couvert.png') },
];

const filters = ["Tous", "Bois", "Frigolite", "Plastique", "Papier", "Verre", "Aluminium"];

const SearchScreen = () => {
    const [selectedFilter, setSelectedFilter] = useState("Tous");
    const navigation = useNavigation();
    const [data, setData] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [favorites, setFavorites] = useState([]);


    useEffect(() => {
        fetch('http://localhost:3001/products')
            .then((response) => response.json())
            .then((json) => {
                setData(json.products);
            })
            .catch((err) => {
                setError(err);
            });

    }, []);

    useEffect(() => {
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
    }, []);

    const isFavorite = (productId) => {
        return favorites.some(favorite => favorite.id === productId);
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

    useEffect(() => {
        console.log("Données brutes :", data);
        console.log("Texte de recherche :", searchText);
        console.log("Filtre sélectionné :", selectedFilter);

        if (searchText.trim() === "") {
            setFilteredProducts([]);
            return;
        }

        let filteredData = data.filter((product) => {
            const matchMaterial = selectedFilter === "Tous" || product.material?.toLowerCase() === selectedFilter.toLowerCase();
            const matchSearch = product.name?.toLowerCase().includes(searchText.toLowerCase());

            return matchMaterial && matchSearch;
        });

        console.log("Produits filtrés :", filteredData);
        setFilteredProducts(filteredData);
    }, [searchText, data, selectedFilter]);


    const renderCategoryItem = ({ item }) => (
        <TouchableOpacity
            style={styles.categoryItem}
            onPress={() => navigation.navigate("CategoryProducts", { categoryName: item.name })}
        >
            <Image source={item.image} style={styles.categoryImage} />
            <Text style={styles.categoryText}>{item.name}</Text>
        </TouchableOpacity>
    );



    return (
        <View style={styles.container}>
            <View style={styles.searchBar}>
                <Ionicons name="search" size={20} color="#AFB5B7" />
                <TextInput
                    placeholder="Rechercher un produit"
                    style={styles.searchInput}
                    value={searchText}
                    onChangeText={(text) => {
                        setSearchText(text);
                    }}
                />
            </View>

            <Text style={{ marginHorizontal: 20, marginBottom: 5, fontFamily: "InterBold", fontSize: 13 }}
            >Matérial</Text>


            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.filterContainer}
                contentContainerStyle={{ paddingBottom: 5 }}
            >
                {filters.map((filter, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => setSelectedFilter(filter)}
                        style={[
                            styles.filterButton,
                            selectedFilter === filter && styles.activeFilter,
                        ]}
                    >
                        <Text
                            style={[
                                styles.filterText,
                                selectedFilter === filter && styles.activeFilterText,
                            ]}
                        >
                            {filter}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
            {searchText.trim() === "" ? (

                <FlatList
                    data={categories}
                    renderItem={renderCategoryItem}
                    keyExtractor={(item) => item.name}
                    numColumns={2}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ backgroundColor: '#F6F5F8', paddingVertical: 10 }}
                    columnWrapperStyle={{ justifyContent: "space-between", marginHorizontal: 10 }}
                />
            ) : (
                filteredProducts.length === 0 ? (
                    <View style={{ alignItems: 'center', flex: 1 }}>
                        <Text style={{ fontSize: 16, color: 'gray' }}>Aucun produit trouvé</Text>
                    </View>
                ) : (

                    <FlatList
                        data={filteredProducts}
                        keyExtractor={(item, index) => `${item.id}-${index}`}
                        numColumns={2}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ backgroundColor: '#F1F5F9', paddingVertical: 10, paddingHorizontal: 10, flex: 1 }}
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
                                        style={styles.CartButton}
                                    >
                                        <FontAwesome name="cart-plus" size={24} color="white" />
                                    </TouchableOpacity>
                                </View>

                                <Text style={styles.itemName}>{item.name}</Text>
                                <Text style={styles.itemMinQuantity}>Référence: {item.reference}</Text>
                                <Text style={styles.itemPrice}>€ {item.price}</Text>
                            </View>


                        )}
                    />
                )
            )}


        </View >
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        paddingTop: 50,
        flex: 1,
    },
    searchBar: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F6F5F8",
        borderRadius: 100,
        paddingHorizontal: 15,
        paddingVertical: 3,
        marginBottom: 10,
        marginHorizontal: 16,

    },
    searchInput: {
        marginLeft: 10,
        flex: 1,
        fontSize: 16,
        color: "#AFB5B7",

    },
    filterContainer: {
        flexDirection: "row",
        marginBottom: 10,
        height: 45,
        marginHorizontal: 16,
        flexGrow: 0

    },
    filterButton: {
        paddingHorizontal: 15,
        borderWidth: 1,
        height: 30,
        borderColor: "#CCCCCC",
        borderRadius: 7,
        marginRight: 10,
        justifyContent: "center",
    },
    activeFilter: {
        backgroundColor: "#01A96E",
        borderWidth: 0,
    },
    filterText: {
        fontSize: 14,
        fontFamily: "InterRegular",
        textAlign: "center",
        color: "black",
    },
    activeFilterText: {
        color: "#fff",
    },
    categoryItem: {
        flex: 1,
        alignItems: "center",
        backgroundColor: "#FFF",
        justifyContent: 'space-between',
        borderRadius: 10,
        margin: 5,
        paddingLeft: 10,
        flexDirection: 'row-reverse',
        elevation: 5,
    },
    categoryImage: {
        width: 80,
        height: 110,
    },
    categoryText: {
        fontSize: 12,
        fontFamily: "InterBold",
        textAlign: "left",
        maxWidth: 100
    },
    item: {
        flex: 1,
        flexDirection: 'column',
        maxWidth: '48%',
        margin: 4,
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    imageContainer: {
        alignItems: 'center',
        width: "100%"
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 10,
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
        fontSize: 14,
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
        width: '100%',
        textAlign: 'left',

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
        padding: 8,
        backgroundColor: '#01A96E'
    },
});



export default SearchScreen;