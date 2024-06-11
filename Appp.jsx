import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {StripeProvider} from '@stripe/stripe-react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import PreloaderScreen from './frontEnd/PreloaderScreen';
import FirstScreen from './frontEnd/FirstScreen';
import PaymentScreen from './frontEnd/PaymentScreen';
import AccueilScreen from './frontEnd/AccueilScreen';
import HomeScreen from './frontEnd/HomeScreen';
import SearchScreen from './frontEnd/SearchScreen';
import FavoritesScreen from './frontEnd/FavoritesScreen';
import TicketScreen from './frontEnd/TicketScreen';
import EventDetailScreen from './frontEnd/EventDetailScreen';
import ProfileScreen from './frontEnd/ProfileScreen';
import Connexion from './frontEnd/Connexion';
import ResetPasswordScreen from './frontEnd/ResetPasswordScreen';
import Inscription from './frontEnd/Inscription';
import TicketDetailsScreen from './frontEnd/TicketDetailsScreen';
import EditProfileScreen from './frontEnd/EditProfileScreen';
import EditPasswordScreen from './frontEnd/EditPasswordScreen';
import CreateEventScreen from './frontEnd/CreateEventScreen';
import EditEventScreen from './frontEnd/EditEventScreen';
import ReservedTicketsScreen from './frontEnd/ReservedTicketsScreen';
import Etc from './frontEnd/Etc';
import {AuthProvider} from './service/AuthContext';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Favorites') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'Tickets') {
            iconName = focused ? 'ticket' : 'ticket-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'gray',
        tabBarShowLabel: false,
        headerShown: false,
      })}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
      <Tab.Screen name="Tickets" component={ReservedTicketsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const App = () => {
  return (
    <StripeProvider
      publishableKey="pk_test_51PPvUdRvCobcJd2pVbFu51baa9FdLhZRm2d2MSm7Zgyz5SvD8zjgVPYggZGn98Dsm1Xlm9SqkOnF8z1QK9DrwxYe00cEUDJs2i"
      urlScheme="your-url-scheme" // Required for 3D Secure and bank redirects
    >
      <AuthProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="PreloaderScreen">
            <Stack.Screen
              name="Connexion"
              component={Connexion}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Etc"
              component={Etc}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="ResetPassword"
              component={ResetPasswordScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Inscription"
              component={Inscription}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="FirstScreen"
              component={FirstScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="AccueilScreen"
              component={AccueilScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="PreloaderScreen"
              component={PreloaderScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Main"
              component={TabNavigator}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="TicketDetailsScreen"
              component={TicketDetailsScreen}
            />
            <Stack.Screen
              name="EditProfileScreen"
              component={EditProfileScreen}
            />
            <Stack.Screen
              name="EditPasswordScreen"
              component={EditPasswordScreen}
            />
            <Stack.Screen
              name="CreateEventScreen"
              component={CreateEventScreen}
            />
            <Stack.Screen name="EditEventScreen" component={EditEventScreen} />
            <Stack.Screen name="FavoritesScreen" component={FavoritesScreen} />
            <Stack.Screen
              name="EventDetailScreen"
              component={EventDetailScreen}
            />
            <Stack.Screen
              name="ReservedTicketsScreen"
              component={ReservedTicketsScreen}
            />
            <Stack.Screen name="TicketScreen" component={TicketScreen} />
            <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </AuthProvider>
    </StripeProvider>
  );
};

export default App;
