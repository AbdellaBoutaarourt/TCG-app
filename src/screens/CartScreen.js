import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import cartImage from '../images/cart.png'
const Cartscreen = () => {
    return (
        <View style={styles.container}>
            <Image source={cartImage} style={styles.cartImage} />
            <Text style={styles.emptyCartText}>Votre panier est vide</Text>

            <Text style={styles.searchPromptText}>À la recherche de produits ?</Text>

            {/* Bouton "Rechercher des produits" */}
            <TouchableOpacity style={styles.searchButton}>
                <Text style={styles.searchButtonText}>Rechercher des produits</Text>
            </TouchableOpacity>
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
        marginLeft: 30
    },
    emptyCartText: {
        fontSize: 20,
        fontFamily: 'InterBold',
        marginBottom: 16,
    },
    searchPromptText: {
        fontSize: 14,
        color: '#787878',
        fontFamily: 'InterRegular',
        marginBottom: 24,
    },
    searchButton: {
        backgroundColor: '#08744E',
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 8,
    },
    searchButtonText: {
        fontSize: 16,
        color: '#fff',
        fontFamily: 'InterSemiBold',
    },
});

export default Cartscreen;