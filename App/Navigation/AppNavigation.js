import { createStackNavigator, createAppContainer, createSwitchNavigator, createDrawerNavigator, createBottomTabNavigator } from 'react-navigation'
import {
  getDashboardNavigatorHeaderTitle,
  getDashboardNavigatorTabIconName,
  getNavigationHeaderRight
} from '../utils';
import { Platform } from 'react-native';
import { Icon } from 'native-base';
import styled from 'styled-components'
import RegisterScreen from '../Containers/Register';
import LaunchScreen from '../Containers/LaunchScreen';
// These are the Pre Authentication Screens

import LoginScreen from '../Containers/LoginScreen';
// import SplashScreen from '../Components/SplashScreen';
import ForgotPasswordScreen from '../Containers/ForgotPassword';
import NetworkError from '../Components/NetworkErrorScreen';
import AuthLoadingScreen from '../Containers/AuthLoadingScreen';


// Sample Screen Which needs to be replicated

import ModuleListScreen from '../Containers/ModuleListView';
// These Are the post authencation Screens
import BeneficiaryListingScreen from '../Containers/BeneficiaryList'
import BeneficiaryDetailScreen from '../Containers/BenefeciaryDetailView'

// These Are the post authencation Screens
import EventsListScreen from '../Containers/EventsList';
import EventDetailScreen from '../Containers/EventDetail';

// FeedBack Screen
import FeedbackScreen from '../Containers/FeedbackScreen';
import FeedbackList from '../Containers/FeedbackList';
import FeedbackDetailScreen from '../Containers/FeedbackDetail';

// Appointment Screen
import CreateAppointmentScreen from '../Containers/AppointmentCreateScreen';
import AppointmentListScreen from '../Containers/AppointmentsList';
import AppointmentDetailScreen from '../Containers/AppointmentDetailScreen';
// import FeedbackDetailScreen from '../Containers/FeedbackDetail';

import UserSettings from '../Containers/UserSettings';
import ProfileEdit from '../Containers/EditProfile';

// These Are the post authencation Screens
import DevelopmentWorksList from '../Containers/DevelopmentWorksList'
import DevelopmentWorkDetail from '../Containers/DevelopmentWorkDetail'

import FacebookScreen from '../Containers/FacebookPage';
import TwitterScreen from '../Containers/TwitterPage';

import HomeScreen from '../Containers/HomeScreen';


const tabBarOptions = {
  activeTintColor: '#F97D09',
  inactiveTintColor: 'grey',
  showLabel: false,
  style: {
    backgroundColor: '#fff',
    borderTopColor: '#dee3ea'
  }
}

const headerTitleStyle = {
  fontSize: 18,
  color: '#F97D09'
}

const HeaderBackImageWrapper = styled.View`
  width: 35;
  justify-content: center;
  align-items: center;
  margin-left: ${Platform.OS === 'ios' ? 8 : 0};
`

const defaultStackNavigatorHeaderStyle = {
  headerStyle: {
    // backgroundColor: '#F97D09',
    // borderBottomColor: '#F97D09',
    // borderBottomWidth: 1,
    borderTopColor: '#F97D09',
    borderTopWidth: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,

    elevation: 2,
  },
  headerTitleStyle,
  headerTintColor: '#32ce89',
  headerBackTitleStyle: headerTitleStyle,
  headerBackImage: ({ tintColor }) => (
    <HeaderBackImageWrapper>
      <Icon name="md-arrow-round-back" color={tintColor} size={30} />
    </HeaderBackImageWrapper>
  )
}

export const tabHeaderStyle = {
  backgroundColor: '#fff'
}

const AuthStack = createStackNavigator(
  {
    Login: LoginScreen,
    RegisterScreen: {
      screen: RegisterScreen
    },
    ForgotPassword: {
      screen: ForgotPasswordScreen,
    },
    NetworkError: {
      screen: NetworkError,
    },
  },
  {
    initialRouteName: 'Login',
  }
);

const DashboardTabNavigator = createBottomTabNavigator(
  {
    Home: HomeScreen,
    Feedback: FeedbackScreen,
    Profile: UserSettings,
  },
  {
    defaultNavigationOptions: ({ navigation }) => {
      return {
        tabBarIcon: ({ tintColor }) =>
          getDashboardNavigatorTabIconName(navigation, tintColor)
      }
    },
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: getDashboardNavigatorHeaderTitle(navigation),
        headerLeft: getNavigationHeaderRight(navigation),
        gesturesEnabled: false,
        headerBackTitle: null,
        ...defaultStackNavigatorHeaderStyle
      }
    },
    tabBarOptions
  }
)

const DashboardStackNavigator = createStackNavigator(
  {
    DashboardTabNavigator,
    BeneficiaryListingScreen: {
      screen: BeneficiaryListingScreen,
    },
    BenfeciaryDetail: {
      screen: BeneficiaryDetailScreen,
    },
    DevelopmentWorksList: {
      screen: DevelopmentWorksList
    },
    DevelopmentWorkDetail: {
      screen: DevelopmentWorkDetail
    },
    EventsListScreen: {
      screen: EventsListScreen,
    },
    EventDetailScreen: {
      screen: EventDetailScreen,
    },
    FeedbackScreen: {
      screen: FeedbackScreen,
    },
    FeedbackList: {
      screen: FeedbackList,
    },
    FeedbackDetailScreen: {
      screen: FeedbackDetailScreen,
    },
    UserSettings: {
      screen: UserSettings,
    },
    Notifications: {
      screen: LaunchScreen,
    },
    AppointmentListScreen: {
      screen: AppointmentListScreen,
    },
    CreateAppointmentScreen: {
      screen: CreateAppointmentScreen,
    },
    AppointmentDetailScreen: {
      screen: AppointmentDetailScreen
    },
    EditProfile: {
      screen: ProfileEdit,
    },
    FacebookScreen: {
      screen: FacebookScreen,
    },
    TwitterScreen: {
      screen: TwitterScreen,
    },
  },
  {
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: getDashboardNavigatorHeaderTitle(navigation),
        headerRight: getNavigationHeaderRight(navigation),
        gesturesEnabled: false,
        headerBackTitle: null,
        ...defaultStackNavigatorHeaderStyle
      }
    },
  }
)

export default createAppContainer(createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: DashboardStackNavigator,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'AuthLoading',
  }
));