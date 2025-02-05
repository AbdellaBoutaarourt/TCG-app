import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SearchScreen from '../screens/SearchScreen';
import CategoryProductsScreen from '../screens/CategoryProductsScreen';

const Stack = createStackNavigator();

const SearchStackNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Search"
                component={SearchScreen}
                options={{ headerTitle: 'Recherche' }}
            />
            <Stack.Screen
                name="CategoryProducts"
                component={CategoryProductsScreen}
                options={{ title: 'Produits de catégorie' }}
            />
        </Stack.Navigator>
    );
};

export default SearchStackNavigator;
