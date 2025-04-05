import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const MotDePasseOublieScreen = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();

    const handlePasswordReset = async () => {
        if (!email) {
            Alert.alert('Erreur', 'Veuillez entrer votre adresse e-mail.');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post('http://localhost:3001/clients/reset-password', {
                email,
                successUrl: 'http://localhost:8081'
            });

            if (response.data.success) {
                Alert.alert('Succès', 'Un email de réinitialisation a été envoyé.');
                navigation.goBack(); // retourne à l'écran de login
            } else {
                Alert.alert('Erreur', response.data.message || 'Une erreur s’est produite.');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Erreur', 'Impossible d’envoyer la demande. Veuillez réessayer plus tard.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Mot de passe oublié</Text>
            <Text style={styles.subtitle}>
                Entrez votre adresse e-mail pour recevoir un lien de réinitialisation.
            </Text>

            <TextInput
                style={styles.input}
                placeholder="Votre email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
            />

            <TouchableOpacity style={styles.button} onPress={handlePasswordReset} disabled={loading}>
                <Text style={styles.buttonText}>
                    {loading ? 'Envoi en cours...' : 'Envoyer le lien'}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontFamily: 'InterBold',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 20,
        textAlign: 'center',
        fontFamily: 'InterRegular',
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
});

export default MotDePasseOublieScreen;
