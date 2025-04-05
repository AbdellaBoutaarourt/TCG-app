import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';


const ReinitialisationMotDePasseScreen = () => {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();
    const route = useRoute();

    const { token } = route.params;

    const handleReset = async () => {
        if (!password) {
            Alert.alert('Erreur', 'Veuillez entrer un nouveau mot de passe.');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(`http://localhost:3001/clients/reset-password/${token}`, {
                password,
            });

            if (response.data.success) {
                navigation.navigate('Connexion', {
                    message: 'Mot de passe changé avec succès.'
                });
            } else {
                Alert.alert('Erreur', response.data.message || 'Une erreur est survenue.');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Erreur', 'Erreur lors de la réinitialisation. Token invalide ou expiré.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Réinitialiser le mot de passe</Text>

            <TextInput
                style={styles.input}
                placeholder="Nouveau mot de passe"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            <TouchableOpacity style={styles.button} onPress={handleReset} disabled={loading}>
                <Text style={styles.buttonText}>
                    {loading ? 'Réinitialisation...' : 'Réinitialiser'}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.linkButton} onPress={() => navigation.navigate('Connexion')}>
                <Text style={styles.linkText}>Retour à la connexion</Text>
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
        marginBottom: 15,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'InterBold',
    },
    linkButton: {
        alignItems: 'center',
    },
    linkText: {
        color: '#01A96E',
        fontSize: 14,
        fontFamily: 'InterRegular',
    },
});

export default ReinitialisationMotDePasseScreen;

