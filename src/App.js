import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import BottomTabNavigator from './navigation/BottomTabNavigator';

export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <BottomTabNavigator />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffff',
    alignItems: 'center',
    justifyContent: 'center',
  },

});
