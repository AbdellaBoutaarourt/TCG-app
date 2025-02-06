import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SearchScreen from '../screens/SearchScreen';
import CategoryProductsScreen from '../screens/CategoryProductsScreen';

const Stack = createStackNavigator();

const SearchStackNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Recherche"
                component={SearchScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="CategoryProducts"
                component={CategoryProductsScreen}
                options={({ route }) => ({
                    headerTitle: route.params?.categoryName,
                    headerTitleAlign: 'center',
                    headerTitleStyle: { fontFamily: "InterBold", fontSize: 13 }
                })}
            />
        </Stack.Navigator>
    );
};

export default SearchStackNavigator;
