import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import SearchStackNavigator from './SearchStackNavigator';
import CartScreen from '../screens/CartScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, focused }) => {
                    let icons = {
                        Accueil: focused ? 'home-sharp' : "home-outline",
                        Recherche: 'search',
                        Favoris: focused ? 'heart' : 'heart-outline',
                        Panier: focused ? 'cart' : "cart-outline",
                        Profil: focused ? "person" : 'person-outline',
                    };
                    return <Ionicons name={icons[route.name]} size={22} color={color} />;
                },
                tabBarActiveTintColor: '#01A96E',
                tabBarInactiveTintColor: 'black',
                tabBarStyle: {
                    backgroundColor: '#fff',
                    borderTopWidth: 0,
                    shadowColor: 'black',
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
            <Tab.Screen name="Accueil" component={HomeScreen} options={{ headerTitleAlign: "center", headerTitleStyle: { fontFamily: "InterSemiBold" }, headerStyle: { shadowOpacity: 0, elevation: 0, }, }} />
            <Tab.Screen name="Recherche" component={SearchStackNavigator} options={{ headerShown: false }} />
            <Tab.Screen name="Favoris" component={FavoritesScreen} options={{ headerTitleAlign: "center", headerTitleStyle: { fontFamily: "InterSemiBold" } }} />
            <Tab.Screen name="Panier" component={CartScreen} options={{ headerTitleAlign: "center", headerTitleStyle: { fontFamily: "InterSemiBold" } }} />
            <Tab.Screen name="Profil" component={ProfileScreen} options={{ headerTitleAlign: "center", headerTitleStyle: { fontFamily: "InterSemiBold" } }} />
        </Tab.Navigator>
    );
};

export default BottomTabNavigator;
