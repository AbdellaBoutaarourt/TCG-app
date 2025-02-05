import React from 'react';
import { View, Text } from 'react-native';

const CategoryProductsScreen = ({ route }) => {
    const { category } = route.params;  // Récupérer la catégorie passée comme paramètre

    return (
        <View>
            <Text>Produits de la catégorie : {category}</Text>
            {/* Afficher ici les produits de cette catégorie */}
        </View>
    );
};

export default CategoryProductsScreen;
