import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from './screens/home_screen';
import { AddScreen } from './screens/add_screen';
import { SettingsScreen } from './screens/settings_screen';
import { Icon } from '@rneui/themed';

export default function App() {

  const Tab = createBottomTabNavigator();

  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} options={{ 
            tabBarIcon: ({ color, size }) => (
              <Icon name="home" type="antdesign" size={24} color="black" />
          ),
        }}/>
        <Tab.Screen name="Add" component={AddScreen} options={{ 
          tabBarIcon: ({ color, size }) => (
            <Icon name="plus" type="antdesign" size={30} color="black" />
          ),
          headerShown: false
        }}/>
        <Tab.Screen name="Settings" component={SettingsScreen} options={{ 
          tabBarIcon: ({ color, size }) => (
            <Icon name="settings" type="feather" size={22} color="black" />
          ),
         headerShown: false 
        }}/>
      </Tab.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );

}