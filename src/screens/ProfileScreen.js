import React, { useState, useEffect } from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, TextInput, Button, Alert, ActivityIndicator
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = () => {
    const [activeSection, setActiveSection] = useState('personalData');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        clientType: 'individual',
        name: '',
        firstName: '',
        vatNumber: '',
        email: '',
        billingAddress: '',
        phoneNumber: '',
    });

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                const response = await axios.get('http://localhost:3001/orders', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const sortedOrders = response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                setOrders(sortedOrders);
            } catch (error) {
                console.error('Erreur chargement des commandes', error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    useEffect(() => {
        const fetchClientData = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                const response = await axios.get('http://localhost:3001/clients/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (response.status === 200) {
                    setFormData(response.data.client);
                }
                console.log(response)
            } catch (error) {
                console.error("Erreur lors de la récupération des informations du client", error);
            }
        };
        fetchClientData();
    }, []);

    const handleUpdateProfile = async () => {
        try {
            const response = await axios.put('http://localhost:3001/clients/profile', formData, {
                headers: { 'Content-Type': 'application/json' },
            });
            if (response.status === 200) {
                Alert.alert("Succès", "Profil mis à jour !");
            } else {
                Alert.alert("Erreur", response.data.message);
            }
        } catch (error) {
            Alert.alert("Erreur", "Impossible de mettre à jour les données");
        }
    };

    return (
        <View style={styles.container}>
            {/* Barre de navigation */}
            <View style={styles.navbar}>
                <TouchableOpacity onPress={() => setActiveSection('personalData')} style={[styles.navButton, activeSection === 'personalData' && styles.activeButton]}>
                    <Text style={styles.navText}>Données Personnelles</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setActiveSection('orderHistory')} style={[styles.navButton, activeSection === 'orderHistory' && styles.activeButton]}>
                    <Text style={styles.navText}>Commandes</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setActiveSection('emailPreferences')} style={[styles.navButton, activeSection === 'emailPreferences' && styles.activeButton]}>
                    <Text style={styles.navText}>Préférences Email</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
                {activeSection === 'personalData' && (
                    <View>
                        <Text style={styles.title}>Données Personnelles</Text>
                        <TextInput style={styles.input} placeholder="Nom" value={formData.name} onChangeText={(text) => setFormData({ ...formData, name: text })} />
                        <TextInput style={styles.input} placeholder="Prénom" value={formData.firstName} onChangeText={(text) => setFormData({ ...formData, firstName: text })} />
                        <TextInput style={styles.input} placeholder="Email" value={formData.email} onChangeText={(text) => setFormData({ ...formData, email: text })} />
                        <TextInput style={styles.input} placeholder="Téléphone" value={formData.phoneNumber} onChangeText={(text) => setFormData({ ...formData, phoneNumber: text })} />
                        <Button title="Mettre à jour" onPress={handleUpdateProfile} />
                    </View>
                )}

                {activeSection === 'orderHistory' && (
                    <View>
                        <Text style={styles.title}>Historique des Commandes</Text>
                        {loading ? (
                            <ActivityIndicator size="large" color="#007bff" />
                        ) : orders.length > 0 ? (
                            orders.map((order, index) => (
                                <View key={index} style={styles.orderCard}>
                                    <Text>Date de commande: {new Date(order.created_at).toLocaleDateString('fr-FR')}</Text>
                                    <Text>Numéro de commande: {order.stripe_session_id}</Text>
                                    <Text>Total: {order.total_amount} €</Text>
                                    {order.line_items && order.line_items.map((item, idx) => (
                                        <View key={idx} style={styles.product}>
                                            <Image source={{ uri: item.product_image }} style={styles.productImage} />
                                            <Text>{item.name} ({item.quantity} x {item.price} €)</Text>
                                        </View>
                                    ))}
                                </View>
                            ))
                        ) : (
                            <Text>Aucune commande trouvée.</Text>
                        )}
                    </View>
                )}

                {activeSection === 'emailPreferences' && (
                    <Text style={styles.title}>Préférences Email (À implémenter...)</Text>
                )}
            </ScrollView>
        </View>
    );
};

// 🎨 Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    navbar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 15,
        backgroundColor: '#007bff',
    },
    navButton: {
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    activeButton: {
        borderBottomWidth: 2,
        borderBottomColor: '#fff',
    },
    navText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    content: {
        padding: 15,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    orderCard: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    product: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    productImage: {
        width: 50,
        height: 50,
        marginRight: 10,
    },
});

export default ProfileScreen;
