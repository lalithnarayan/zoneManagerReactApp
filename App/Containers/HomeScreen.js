import React from 'react'
import { Container, Content } from 'native-base';
import { BackHandler, Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { connect } from 'react-redux'
import { NavigationEvents } from 'react-navigation';
import styled from 'styled-components/native'
import EventActions from '../Redux/EventRedux'
import { SafeAreaViewWrapper, CustomStatusBar } from '../Components/ui'
import { FeaturedCoursesListView } from '../Components/list-views'
import { CourseCategoriesGridView } from '../Components/grid-views'
// import RNEexitApp from 'react-native-exit-app';


export const SAMPLE_COURSE_CATEGORIES = [
  { icon: 'road', type: 'FontAwesome', title: 'ಅಭಿವೃಧ್ಧಿ ಕಾಮಗಾರಿ', route: 'DevelopmentWorksList' },
  { icon: 'ios-people', type: 'Ionicons', title: 'ಫಲಾನುಭವಿಗಳು', route: 'BeneficiaryListingScreen' },
  { icon: 'event-note', type: 'MaterialIcons', title: 'ದಿನಂಪ್ರತಿ ಕಾರ್ಯಕ್ರಮಗಳು', route: 'EventsListScreen' },
  { icon: 'feedback', type: 'MaterialIcons', title: 'ದೂರು/ಬೇಡಿಕೆ/ಸಲಹೆ', route: 'FeedbackList' },
  { icon: 'ios-timer', type: 'Ionicons', title: 'ಸಮಯಾವಕಾಶ ಕೋರಿಕೆ', route: 'AppointmentListScreen'},
  { icon: 'facebook-square', type: 'FontAwesome', title: 'ನ್ಯೂಸ್ ಫೀಡ್', route: 'FacebookScreen'},
  { icon: 'twitter-square', type: 'FontAwesome', title: 'ಟ್ವಿಟರ್', route: 'TwitterScreen'},
]
const Heading = styled.Text`
  font-size: 15;
  padding: 16px 16px 8px;
  margin-bottom: 10;
  font-weight: bold;
`

class HomeScreen extends React.Component {

  componentDidMount() {
    this.onTableFetchRequest();
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
    const { loading, data } = this.props
    const { navigation } = this.props
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
              onItemPress={item =>  navigation.navigate("EventDetailScreen", { selectedData: item })}
            />
            <Heading>ವಿಭಾಗಗಳು</Heading>
            <CourseCategoriesGridView
              items={SAMPLE_COURSE_CATEGORIES}
              onItemPress={item =>
                navigation.navigate(item.route)
              }
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
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getEventsList: (accessToken, pageNo) =>
      dispatch(EventActions.oldEventOnListRequest(accessToken, pageNo))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen)
