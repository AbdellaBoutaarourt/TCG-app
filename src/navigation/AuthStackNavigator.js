import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import PasswordScreen from '../screens/PasswordScreen';
import ReinitialisationMotDePasseScreen from '../screens/ReinitialisationMotDePasseScreen';
const Stack = createStackNavigator();

const AuthStackNavigator = ({ setIsLoggedIn }) => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Connexion" options={{ headerShown: false }}>
                {(props) => <LoginScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
            </Stack.Screen>
            <Stack.Screen name="Inscription" component={SignupScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Mot de passe oublié" component={PasswordScreen} />
            <Stack.Screen name="Reinitialisation Mot De Passe" component={ReinitialisationMotDePasseScreen} />

        </Stack.Navigator>
    );
};

export default AuthStackNavigator;