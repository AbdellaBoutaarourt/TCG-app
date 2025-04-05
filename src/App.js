import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import BottomTabNavigator from './navigation/BottomTabNavigator';
import AuthStackNavigator from './navigation/AuthStackNavigator';
import { Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { Asset } from 'expo-asset';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const linking = {
    prefixes: ['http://localhost:8081', 'myapp://'],
    config: {
      screens: {
        'Reinitialisation Mot De Passe': {
          path: 'reset-password/:token',
        },
      },
    },
  };


  useEffect(() => {
    async function prepare() {
      try {
        await Asset.fromModule(require('./images/logo.png')).downloadAsync();

        await Font.loadAsync({
          InterRegular: Inter_400Regular,
          InterSemiBold: Inter_600SemiBold,
          InterBold: Inter_700Bold,
        });
      } catch (e) {
        console.warn(e);
      } finally {
        setIsReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <Image source={require('./images/logo.png')} style={styles.logo} />
      </View>
    );
  }

  return (
    <NavigationContainer linking={linking}>
      {isLoggedIn ? (
        <BottomTabNavigator />
      ) : (
        <AuthStackNavigator setIsLoggedIn={setIsLoggedIn} />
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: '35%',
    height: 100,
  },
});