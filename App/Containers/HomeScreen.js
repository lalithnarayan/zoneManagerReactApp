import React from 'react'
import { Container, Content } from 'native-base';
import { BackHandler, Alert, Platform, Linking } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { connect } from 'react-redux'
import { NavigationEvents } from 'react-navigation';
import styled from 'styled-components/native'
import EventActions from '../Redux/EventRedux'
import { SafeAreaViewWrapper, CustomStatusBar } from '../Components/ui'
import { FeaturedCoursesListView } from '../Components/list-views' 
import { CourseCategoriesGridView } from '../Components/grid-views'
import OneSignal from 'react-native-onesignal';

export const SAMPLE_COURSE_CATEGORIES = [
  { icon: 'road', type: 'FontAwesome', title: 'ಅಭಿವೃಧ್ಧಿ ಕಾಮಗಾರಿ', route: 'DevelopmentWorksList' },
  { icon: 'ios-people', type: 'Ionicons', title: 'ಫಲಾನುಭವಿಗಳು', route: 'BeneficiaryListingScreen' },
  { icon: 'event-note', type: 'MaterialIcons', title: 'ದಿನಂಪ್ರತಿ ಕಾರ್ಯಕ್ರಮಗಳು', route: 'EventsListScreen' },
  { icon: 'feedback', type: 'MaterialIcons', title: 'ದೂರು/ಬೇಡಿಕೆ/ಸಲಹೆ', route: 'FeedbackList' },
  { icon: 'ios-timer', type: 'Ionicons', title: 'ಸಮಯಾವಕಾಶ ಕೋರಿಕೆ', route: 'AppointmentListScreen' },
  { icon: 'facebook-square', type: 'FontAwesome', title: 'ನ್ಯೂಸ್ ಫೀಡ್', link: 'https://www.facebook.com/Sunilnaik581354/' },
  { icon: 'twitter-square', type: 'FontAwesome', title: 'ಟ್ವಿಟರ್', link: 'https://twitter.com/sunilnaikbhatkl?s=08' },
  { icon: 'youtube-square', type: 'FontAwesome', title: 'ಯೂಟ್ಯೂಬ್', link: 'https://www.youtube.com/channel/UCJpeMzzQfbalCg3VKMqCKig' },
  { icon: 'thumb-tack', type: 'FontAwesome', title: 'ಉಪಯುಕ್ತ ಲಿಂಕ್‌ಗಳು', route: 'UsefulLinksScreen' },
]
const Heading = styled.Text`
  font-size: 15;
  padding: 16px 16px 8px;
  margin-bottom: 10;
  font-weight: bold;
`

class HomeScreen extends React.Component {

  constructor(properties) {
    super(properties);
    console.log(properties);
    OneSignal.init("abc8864e-a22d-4635-8969-b08ef7da58c6");

    OneSignal.addEventListener('received', this.onReceived);
    OneSignal.addEventListener('opened', this.onOpened);
    OneSignal.addEventListener('ids', this.onIds);
  }
  componentDidMount() {
    this.onTableFetchRequest();
  }


  componentWillUnmount() {
    OneSignal.removeEventListener('received', this.onReceived);
    OneSignal.removeEventListener('opened', this.onOpened);
    OneSignal.removeEventListener('ids', this.onIds);
  }

  onReceived(notification) {
    // console.log("Notification received: ", notification);
  }

  onOpened(openResult) {
    // console.log('Message: ', openResult.notification.payload.body);
    // console.log('Data: ', openResult.notification.payload.additionalData);
    // console.log('isActive: ', openResult.notification.isAppInFocus);
    // console.log('openResult: ', openResult);
  }

  onIds(device) {
    // console.log('Device info: ', device);
  }

  onTableFetchRequest = (pageID) => {
    const { fetching } = this.props;
    AsyncStorage.getItem('accessToken').then((accessToken) => {
      if (!fetching) {
        this.props.getEventsList(accessToken, pageID);
      }
    });
  }

  handleBackButton = () => {
    Alert.alert(
      'Exit App',
      'Exiting the application?', [{
        text: 'Cancel',
        style: 'cancel'
      }, {
        text: 'OK',
        onPress: () => BackHandler.exitApp()
      },], {
        cancelable: false
      }
    )
    return true;
  }


  bindBackButton() {
    if (Platform.OS === 'ios') return
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  unBindBackButton() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  render() {
    const { loading, data, userObj } = this.props
    const { navigation } = this.props
    if (userObj && userObj.citizen) {
      OneSignal.sendTags({name: userObj.citizen.name });
    }
    return (
      <SafeAreaViewWrapper>
        <NavigationEvents
          onWillBlur={() => this.unBindBackButton()}
          onDidFocus={() => this.bindBackButton()}
        />
        <Container>
          <CustomStatusBar />
          <Content>
            <Heading>ಕಾರ್ಯಕ್ರಮಗಳು</Heading>
            <FeaturedCoursesListView
              loading={loading}
              items={data}
              onItemPress={item => navigation.navigate("EventDetailScreen", { selectedData: item })}
            />
            <Heading>ವಿಭಾಗಗಳು</Heading>
            <CourseCategoriesGridView
              items={SAMPLE_COURSE_CATEGORIES}
              onItemPress={item => {
                if (item.route) {
                  navigation.navigate(item.route);
                } else {
                  Linking.openURL(item.link)
                }
              }}
            />
          </Content>
        </Container>
      </SafeAreaViewWrapper>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    data: state.event.oldListData,
    loading: state.event.fetching,
    listError: state.event.listError,
    userObj: state.root.userDetails,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getEventsList: (accessToken, pageNo) =>
      dispatch(EventActions.oldEventOnListRequest(accessToken, pageNo))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen)
