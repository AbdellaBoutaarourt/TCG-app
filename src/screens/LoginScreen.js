import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import logo from '../images/logo.png'
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ setIsLoggedIn }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const checkConnection = async () => {
            const token = await AsyncStorage.getItem("token");
            if (!token) return;

            try {
                const response = await axios.get("http://localhost:3001/clients/check-connection", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.data.success) {
                    setIsLoggedIn(true);
                }
            } catch (error) {
                console.error("Erreur de vérification de connexion:", error);
                await AsyncStorage.removeItem("token");
            }
        };

        checkConnection();
    }, []);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post('http://localhost:3001/clients/login', {
                email,
                password,
            });

            if (response.data.success) {
                await AsyncStorage.setItem('token', response.data.token);
                setIsLoggedIn(true);
                Alert.alert('Succès', 'Connexion réussie.');
            } else {
                Alert.alert('Erreur', response.data.message || 'Échec de la connexion.');
            }
        } catch (error) {
            Alert.alert('Erreur', 'Une erreur s\'est produite lors de la connexion.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Image source={logo} style={styles.logo} />

            <Text style={styles.title}>Connexion</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Mot de passe"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
                <Text style={styles.buttonText}>{loading ? 'Connexion...' : 'Se connecter'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Inscription')}>
                <Text style={styles.link}>Pas de compte ? <Text style={styles.linkBold}>S'inscrire</Text></Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        colo: '#fff'
    },
    logo: {
        width: '70%',
        height: 170,
        alignSelf: 'center',
        marginBottom: 30,
    },
    title: {
        fontSize: 24,
        fontFamily: 'InterBold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 15,
    },
    button: {
        backgroundColor: '#01A96E',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'InterBold',
    },
    link: {
        color: '#666',
        textAlign: 'center',
        marginTop: 15,
        fontFamily: 'InterSemiBold',
    },
    linkBold: {
        fontFamily: 'InterBold',
        color: '#01A96E',
    },
});

export default LoginScreen;