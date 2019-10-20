import React from 'react'
import { Container } from 'native-base'
import { connect } from 'react-redux'
import { Platform, BackHandler, Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import styled from 'styled-components/native'
import { SafeAreaViewWrapper, CustomStatusBar } from '../Components/ui'
import { NavigationEvents } from 'react-navigation';
import LoginActions from '../Redux/LoginRedux'
import { SignInForm } from '../Components/forms'

export const onboardingHeaderStyle = {
  backgroundColor: '#f5f5f2',
  borderBottomColor: 'transparent'
}

export const PageContentWrapper = styled.View`
  flex: 1;
  padding: 16px;
  background-color: #f5f5f2;
`

class SignInScreen extends React.Component {
  static navigationOptions = {
    title: 'ಲಾಗಿನ್',
    headerStyle: onboardingHeaderStyle,
  }
  constructor(props) {
    super(props)
    AsyncStorage.getItem('id_token').then((userToken) => {
      props.navigation.navigate(userToken ? 'App' : 'Auth');
    });
  }

  componentWillReceiveProps(nextProps) {
    const _this = this;
    if (nextProps.user.access_token) {
      this.goToPage('App');
    }
  }

  goToPage = (route) => {
    const { navigation } = this.props;
      navigation.navigate(route);
      this.props.onNavigationResetState();

  }
  onFormSubmit(values) {
    this.setState({ formLoading: true })
    const { phone, password } = values
    this.props.attemptLogin(phone, password);
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
    const { navigation, fetching } = this.props
    return (
      <SafeAreaViewWrapper extraStyles={{ backgroundColor: '#f5f5f2' }}>
        <NavigationEvents
          onWillBlur={() => {
            this.unBindBackButton();
          }}
          onDidFocus={() => this.bindBackButton()}
        />
        <Container>
          <CustomStatusBar />
          <PageContentWrapper>
            <SignInForm
              loading={fetching}
              onSubmit={values => this.onFormSubmit(values)}
              onSignUpPress={() => this.goToPage("RegisterScreen")}
              onForgotPasswordPress={() => this.goToPage("ForgotPassword")}
            />
          </PageContentWrapper>
        </Container>
      </SafeAreaViewWrapper>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    fetching: state.login.fetching,
    error: state.login.error,
    user: state.login.user,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    attemptLogin: (phone, password) => dispatch(LoginActions.loginRequest(phone, password)),
    warningToast: (msg) => dispatch(ToastActionsCreators.displayWarning(msg)),
    errorToast: (msg) => dispatch(ToastActionsCreators.displayError(msg)),
    onNavigationResetState: () => dispatch(LoginActions.resetStateOnNavigation()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignInScreen)
