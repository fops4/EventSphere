import 'react-native-gesture-handler'; // Assurez-vous que c'est la première ligne
import { AppRegistry } from 'react-native';
import App from './Appp';
//import PaymentScreen from './frontEnd/PaymentScreen';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
