import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';

const Stack = createStackNavigator();

const AuthStackNavigator = ({ setIsLoggedIn }) => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Login" options={{ headerShown: false }}>
                {(props) => <LoginScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
            </Stack.Screen>
            <Stack.Screen name="Inscription" component={SignupScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
};

export default AuthStackNavigator;