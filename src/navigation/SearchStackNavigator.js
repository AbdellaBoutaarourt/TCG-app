import React, { useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SearchScreen from '../screens/SearchScreen';
import CategoryProductsScreen from '../screens/CategoryProductsScreen';
import { TextInput, StyleSheet, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons';

const Stack = createStackNavigator();

const SearchStackNavigator = () => {
    const [searchText, setSearchText] = useState('');


    return (
        <Stack.Navigator>
            <Stack.Screen
                name="RechercheStack"
                component={SearchScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="CategoryProducts"
                component={CategoryProductsScreen}
                options={({ navigation }) => ({
                    headerTitle: () => (
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
                    ),
                })}
            />
        </Stack.Navigator>
    );
};

export default SearchStackNavigator;

const styles = StyleSheet.create({
    searchBar: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F6F5F8",
        borderRadius: 100,
        paddingHorizontal: 100,
        paddingLeft: 10,
        paddingVertical: 1,


    },
    searchInput: {
        marginLeft: 10,
        fontSize: 16,
        color: "black",
        width: '120%',
    },
})
