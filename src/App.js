import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';

import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import BottomTabNavigator from './navigation/BottomTabNavigator';
import { Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';

export default function App() {
  let [fontsLoaded] = useFonts({
    InterRegular: Inter_400Regular,
    InterSemiBold: Inter_600SemiBold,
    InterBold: Inter_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View>
        <ActivityIndicator size="large" color="#08744E" />
      </View>
    );
  }

  return (
    <>
      <NavigationContainer>
        <StatusBar style="auto" />
        <BottomTabNavigator />
      </NavigationContainer>

    </>
  );
}

