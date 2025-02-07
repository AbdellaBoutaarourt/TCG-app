import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import logo from '../images/logo.png'

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();

    const handleLogin = async ({ setIsLoggedIn }) => {
        if (!email || !password) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
            return;
        }

        try {
            const response = await axios.post('http://votre-api.com/login', {
                email,
                password,
            });

            if (response.data.success) {
                setIsLoggedIn(true);
                navigation.navigate('Accueil');
            } else {
                Alert.alert('Erreur', response.data.message || 'Échec de la connexion.');
            }
        } catch (error) {
            Alert.alert('Erreur', 'Une erreur s\'est produite lors de la connexion.');
            console.error(error);
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
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Se connecter</Text>
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