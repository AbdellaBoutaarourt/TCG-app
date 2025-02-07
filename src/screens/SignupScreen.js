import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Picker compatible avec Expo
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; // Icônes Expo
import axios from 'axios';

const SignupScreen = () => {
    const [clientType, setClientType] = useState('individual');
    const [name, setName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [vatNumber, setVatNumber] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [billingAddress, setBillingAddress] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const navigation = useNavigation();

    const handleSignup = async () => {
        if (!email || !password || !name || !billingAddress || !phoneNumber) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires.');
            return;
        }

        // Validation supplémentaire en fonction du type de client
        if (clientType === 'individual' && !firstName) {
            return Alert.alert('Erreur', 'Le prénom est requis pour les particuliers.');
        }

        if (clientType === 'company' && !vatNumber) {
            return Alert.alert('Erreur', 'Le numéro de TVA est requis pour les sociétés.');
        }

        try {
            const response = await axios.post('http://votre-api.com/signup', {
                clientType,
                name,
                firstName: clientType === 'individual' ? firstName : null, // Inclure firstName seulement pour les particuliers
                vatNumber: clientType === 'company' ? vatNumber : null, // Inclure vatNumber seulement pour les sociétés
                email,
                password,
                billingAddress,
                phoneNumber,
            });

            if (response.data.success) {
                Alert.alert('Succès', 'Inscription réussie !');
                navigation.navigate('Login');
            } else {
                Alert.alert('Erreur', response.data.message || 'Échec de l\'inscription.');
            }
        } catch (error) {
            Alert.alert('Erreur', 'Une erreur s\'est produite lors de l\'inscription.');
            console.error(error);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Inscription</Text>

            {/* Menu déroulant pour le type de client */}
            <View style={styles.inputContainer}>
                <Ionicons name="person" size={20} color="#01A96E" style={styles.icon} />
                <Picker
                    selectedValue={clientType}
                    onValueChange={(itemValue) => setClientType(itemValue)}
                    style={styles.picker}
                >
                    <Picker.Item label="Particulier (individual)" value="individual" />
                    <Picker.Item label="Entreprise (company)" value="company" />
                </Picker>
            </View>

            {/* Champ Nom */}
            <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={20} color="#01A96E" style={styles.icon} />
                <TextInput
                    style={styles.input}
                    placeholder="Nom"
                    value={name}
                    onChangeText={setName}
                />
            </View>

            {/* Champ Prénom (uniquement pour les particuliers) */}
            {clientType === 'individual' && (
                <View style={styles.inputContainer}>
                    <Ionicons name="person-outline" size={20} color="#01A96E" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Prénom"
                        value={firstName}
                        onChangeText={setFirstName}
                    />
                </View>
            )}

            {/* Champ Numéro de TVA (uniquement pour les entreprises) */}
            {clientType === 'company' && (
                <View style={styles.inputContainer}>
                    <Ionicons name="business" size={20} color="#01A96E" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Numéro de TVA"
                        value={vatNumber}
                        onChangeText={setVatNumber}
                    />
                </View>
            )}

            {/* Champ Email */}
            <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color="#01A96E" style={styles.icon} />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
            </View>

            {/* Champ Mot de passe */}
            <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#01A96E" style={styles.icon} />
                <TextInput
                    style={styles.input}
                    placeholder="Mot de passe"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
            </View>

            {/* Champ Adresse de facturation */}
            <View style={styles.inputContainer}>
                <Ionicons name="home-outline" size={20} color="#01A96E" style={styles.icon} />
                <TextInput
                    style={styles.input}
                    placeholder="Adresse de facturation"
                    value={billingAddress}
                    onChangeText={setBillingAddress}
                />
            </View>

            {/* Champ Numéro de téléphone */}
            <View style={styles.inputContainer}>
                <Ionicons name="call-outline" size={20} color="#01A96E" style={styles.icon} />
                <TextInput
                    style={styles.input}
                    placeholder="Numéro de téléphone"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    keyboardType="phone-pad"
                />
            </View>

            {/* Bouton d'inscription */}
            <TouchableOpacity style={styles.button} onPress={handleSignup}>
                <Text style={styles.buttonText}>S'inscrire</Text>
            </TouchableOpacity>

            {/* Lien vers la connexion */}
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.link}>Déjà un compte ? <Text style={styles.linkBold}>Se connecter</Text></Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 28,
        fontFamily: 'InterBold',
        marginBottom: 30,
        textAlign: 'center',
        color: '#01A96E',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 15,
        paddingHorizontal: 10,
        backgroundColor: '#f9f9f9',
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        height: 50,
        fontSize: 16,
    },
    picker: {
        flex: 1,
        height: 50,
        fontSize: 16,
    },
    button: {
        backgroundColor: '#01A96E',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontFamily: 'InterBold',
    },
    link: {
        color: '#666',
        textAlign: 'center',
        marginTop: 15,
    },
    linkBold: {
        fontFamily: 'InterBold',
        color: '#01A96E',
    },
});

export default SignupScreen;