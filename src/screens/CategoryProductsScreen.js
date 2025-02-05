import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator } from 'react-native';

const CategoryProductsScreen = ({ route }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { categoryName } = route.params;

    useEffect(() => {
        fetch('http://localhost:3001/products')
            .then((response) => response.json())
            .then((json) => {
                console.log(json.products)
                setData(json.products);
                setLoading(false);
            })
            .catch((err) => {
                setError(err);
                setLoading(false);
            });
    }, []);

    const filteredProducts = data.filter((product) =>
        product.type.toLowerCase() === categoryName.toLowerCase()
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Chargement...</Text>
            </View>
        );
    }

    // Si erreur
    if (error) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Erreur de chargement: {error.message}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={filteredProducts}
                keyExtractor={(item) => item.id.toString()}
                numColumns={4}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Image source={{ uri: item.image }} style={styles.image} />
                        <Text style={styles.itemText}>{item.name}</Text>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    item: {
        flex: 1,
        margin: 5,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f9c2ff',
        borderRadius: 10,
        padding: 10,
    },
    itemText: {
        fontSize: 16,
        marginTop: 8,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 10,
    },
});

export default CategoryProductsScreen;
