import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons, FontAwesome, MaterialIcons } from '@expo/vector-icons';

const filters = ["Tous", "Bois", "Frigolite", "Plastique", "Papier", "Verre", "Aluminium"];


const CategoryProductsScreen = ({ route }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { categoryName } = route.params;
    const [selectedFilter, setSelectedFilter] = useState("Tous");

    useEffect(() => {
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
    }, []);

    const filteredProducts = data.filter((product) =>
        product.type.toLowerCase() === categoryName.toLowerCase() &&
        (selectedFilter === "Tous" || product.material.toLowerCase() === selectedFilter.toLowerCase())
    );

    const handleAddToFavorites = (productId) => {
        console.log(`Produit ${productId} ajouté aux favoris`);
        // Ajoute ici la logique pour ajouter aux favoris
    };

    const handleAddToCart = (productId) => {
        console.log(`Produit ${productId} ajouté au panier`);
        // Ajoute ici la logique pour ajouter au panier
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Chargement...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Erreur de chargement: {error.message}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterContainer} style={styles.scrollView}>
                {filters.map((filter, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => setSelectedFilter(filter)}
                        style={[
                            styles.filterButtonn,
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
            <View style={styles.header}>
                <TouchableOpacity style={styles.sortButton}>
                    <svg width="16" height="16" viewBox="0 0 11 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.85349 3.1465C6.04899 2.951 6.04899 2.635 5.85349 2.4395L3.70704 0.293C3.51204 0.0980005 3.25605 0.000499725 3.00006 0.000499725C2.74406 0.000499725 2.48807 0.0980005 2.29307 0.293L0.146622 2.4395C-0.0488739 2.635 -0.0488739 2.951 0.146622 3.1465C0.342117 3.342 0.65811 3.342 0.853606 3.1465L2.50007 1.5V11.5C2.50007 11.7765 2.72406 12 3.00006 12C3.27605 12 3.50005 11.7765 3.50005 11.5V1.5L5.14651 3.1465C5.342 3.342 5.658 3.342 5.85349 3.1465ZM10.8534 9.5605L8.70693 11.707C8.31744 12.0965 7.68245 12.0965 7.29296 11.707L5.14651 9.5605C4.95101 9.365 4.95101 9.049 5.14651 8.8535C5.342 8.658 5.658 8.658 5.85349 8.8535L7.49995 10.5V0.5C7.49995 0.2235 7.72345 0 7.99994 0C8.27644 0 8.49993 0.2235 8.49993 0.5V10.5L10.1464 8.8535C10.2439 8.756 10.3719 8.707 10.4999 8.707C10.6279 8.707 10.7559 8.756 10.8534 8.8535C11.0489 9.049 11.0489 9.365 10.8534 9.5605Z" fill="black" />
                    </svg>

                    <Text style={styles.sortText}>Trier</Text>
                </TouchableOpacity>
                <View style={styles.separator} />

                <Text style={styles.resultCount}>{filteredProducts.length} Résultats</Text>

                <View style={styles.separator} />

                <TouchableOpacity style={styles.filterButton}>
                    <MaterialIcons name="filter-list" size={20} color="black" />
                    <Text style={styles.filterText}>Filtre</Text>
                </TouchableOpacity>
            </View>

            {filteredProducts.length === 0 ? (
                <View style={{ alignItems: 'center', marginTop: 20 }}>
                    <Text style={{ fontSize: 16, color: 'gray' }}>Aucun produit trouvé</Text>
                </View>
            ) : (

                <FlatList
                    data={filteredProducts}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={2}
                    renderItem={({ item }) => (
                        <View style={styles.item}>
                            <View style={styles.itemContainer}>
                                <View style={styles.imageContainer}>
                                    <Image source={{ uri: item.image }} style={styles.image} />
                                </View>
                                <View style={styles.iconContainer}>
                                    <TouchableOpacity
                                        onPress={() => handleAddToFavorites(item.id)}
                                        style={styles.iconButton}
                                    >
                                        <Ionicons name="heart-outline" size={24} color="#08744E" />
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={() => handleAddToCart(item.id)}
                                        style={styles.CartButton}
                                    >
                                        <FontAwesome name="cart-plus" size={24} color="white" />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <Text style={styles.itemName}>{item.name}</Text>
                            <Text style={styles.itemMinQuantity}>Référence: {item.reference}</Text>
                            <Text style={styles.itemPrice}>€ {item.price}</Text>
                        </View>

                    )
                    }
                />
            )}
        </View >
    );
};

const styles = StyleSheet.create({
    scrollView: {
        maxHeight: 45,
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    filterContainer: {
        flexDirection: "row",
        alignItems: 'center',
        alignContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: "#CFCFCF",
        paddingHorizontal: 16

    },
    filterButtonn: {
        paddingHorizontal: 15,
        paddingVertical: 4,
        borderRadius: 20,
    },
    activeFilter: {
        backgroundColor: "#DEEDE0",
    },
    activeFilterText: {
        color: "#008E5C",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginBottom: 16,
        padding: 16,

    },
    separator: {
        height: 30,
        width: 1,
        backgroundColor: '#CFCFCF',
        marginHorizontal: 4,
    },
    sortButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sortText: {
        marginLeft: 4,
        fontSize: 15,
        fontFamily: "InterRegular"
    },
    resultCount: {
        fontSize: 15,
        fontFamily: "InterRegular"
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    filterText: {
        marginLeft: 4,
        fontSize: 15,
        fontFamily: "InterRegular"
    },
    item: {
        flex: 1,
        margin: 4,
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        position: 'relative',
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 10,
    },
    imageContainer: {
        alignItems: 'center'
    },
    itemContainer: {
        flex: 1,
        width: '100%'
    },
    itemName: {
        marginVertical: 4,
        fontSize: 14,
        fontFamily: 'InterSemiBold',
        textAlign: 'left',
    },
    itemPrice: {
        marginTop: 5,
        fontSize: 14,
        fontFamily: 'InterSemiBold',
        color: '#08744E',
        marginBottom: 4,
        width: '100%',
        textAlign: 'left',

    },
    itemMinQuantity: {
        width: '100%',
        fontSize: 11,
        color: '#666',
        fontFamily: 'InterRegular',
        textAlign: 'left',

    },
    iconContainer: {
        flexDirection: 'column',
        alignItems: "flex-end",
    },
    iconButton: {
        padding: 8,
    },
    CartButton: {
        padding: 8,
        backgroundColor: '#08744E'
    },
});


export default CategoryProductsScreen;
