import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import CartScreen from '../screens/CartScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ color }) => {
                        let icons = {
                            Accueil: 'home-outline',
                            Recherche: 'search-outline',
                            Favoris: 'heart-outline',
                            Panier: 'cart-outline',
                            Profil: 'person-outline',
                        };
                        return <Ionicons name={icons[route.name]} size={30} color={color} />;
                    },
                    tabBarActiveTintColor: '#08744E',
                    tabBarInactiveTintColor: 'gray',
                    tabBarStyle: {
                        backgroundColor: '#fff',
                        borderTopWidth: 0,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: -5 },
                        shadowOpacity: 0.25,
                        shadowRadius: 4,
                        elevation: 10,
                        height: 70,
                        paddingHorizontal: 10,
                        paddingTop: 10,
                        paddingBottom: 10,

                    },
                })}
            >
                <Tab.Screen name="Accueil" component={HomeScreen} options={{ tabBarLabel: () => null }} />
                <Tab.Screen name="Recherche" component={SearchScreen} options={{ tabBarLabel: () => null }} />
                <Tab.Screen name="Favoris" component={FavoritesScreen} options={{ tabBarLabel: () => null }} />
                <Tab.Screen name="Panier" component={CartScreen} options={{ tabBarLabel: () => null }} />
                <Tab.Screen name="Profil" component={ProfileScreen} options={{ tabBarLabel: () => null }} />
            </Tab.Navigator>
        </NavigationContainer>
    );
};

export default BottomTabNavigator;
