import React, { Component } from 'react'
import { Keyboard, TouchableOpacity, TextInput, Image } from 'react-native'
import { Container, Content, Icon, Text, View } from 'native-base'
import { connect } from 'react-redux'
import LoginActions from '../Redux/LoginRedux'
import { ToastActionsCreators } from 'react-native-redux-toast';
import { RegularButton, CustomActivityIndicator, LinkButton } from '../Components/ui';

// Styles
import Styles from './Styles/ForgotPasswordStyle'

export const onboardingHeaderStyle = {
  backgroundColor: '#f5f5f2',
  borderBottomColor: 'transparent'
}

class ForgotPassword extends Component {
  static navigationOptions = {
    title: 'ಪಾಸ್ವರ್ಡ್ ಮರೆತಿರಾ',
    headerStyle: onboardingHeaderStyle,
  }
  constructor(props) {
    super(props)
    this.state = {
      formObj: {},
      errorObj: {},
    }
  }
  onFormChange = (value, key) => {
    const { formObj } = this.state;
    this.setState({
      formObj: { ...formObj, [key]: value }
    })
  }
  handleNextClick = () => {
    this.dismissKeyboard();
    const { formObj } = this.state;
    const errorObj = {};
    const regex = /^[6-9]\d{9}$/; //eslint-disable-line
    if (!regex.test(formObj['phone'])) {
      this.props.errorToast("ಮಾನ್ಯ ಫೋನ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ");
      errorObj.phone = "ದಯವಿಟ್ಟು ಮಾನ್ಯವಾದ ಫೋನ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ";
    } else {
      const phone = formObj['phone'];
      this.props.getOTPForNumber(phone)
    }
    this.setState({
      errorObj,
    })
  }

  goToPage = (route) => {
    const { navigation } = this.props;
    navigation.navigate(route);
    this.props.onNavigationResetState();
    this.setState({
      formObj: {},
      errorObj: {},
      showPassword: false,
    });
  }
  togglePasswordShow = () => {
    const { showPassword } = this.state;
    this.setState({
      showPassword: !showPassword,
    });

  }
  dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  onFormSubmit = () => {
    const { formObj } = this.state;
    let data = new FormData();
    for (let property in formObj) {
      data.append(property, formObj[property]);
    }
    this.props.attempResetPassword(data);
  };

  render() {
    const { otpStatus, fetching, resetPasswordError } = this.props;
    const { errorObj, showPassword } = this.state;
    return (
      <Container>
        <Content contentContainerStyle={Styles.layoutDefault}>
          <View style={Styles.bgLayout}>
            <View style={Styles.hTop}>
              <Icon name='lock' type="MaterialCommunityIcons" style={Styles.hImg} />
              <Text style={Styles.hTopText}>ಪಾಸ್ವರ್ಡ್ ಮರೆತಿರಾ?</Text>
              <Text style={Styles.hTopDesc}>ಪಾಸ್ವರ್ಡ್ ಅನ್ನು ಮರುಹೊಂದಿಸಲು ನಿಮ್ಮ ನೋಂದಾಯಿತ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ನಮಗೆ ಅಗತ್ಯವಿದೆ </Text>
            </View>
            <View style={Styles.regForm}>
              <View style={Styles.infoBox}>
                <View style={(errorObj && errorObj.phone) ? Styles.fRowError : Styles.fRow}>
                  <Icon name='cellphone-android' type="MaterialCommunityIcons" style={Styles.fIcon} />
                  <TextInput
                    style={Styles.fInput}
                    placeholder='ಮೊಬೈಲ್ ನಂಬರ'
                    placeholderTextColor='rgba(36,42,56,0.4)'
                    keyboardType={'phone-pad'}
                    onChangeText={(text) => this.onFormChange(text, 'phone')}
                    disabled={fetching}
                  />
                  <Text style={Styles.fErrorLabel}>{errorObj.phone}</Text>
                </View>
                {
                  otpStatus === 1 ?
                    <View style={(errorObj && errorObj.phone) ? Styles.fRowError : Styles.fRow}>
                      <Icon
                        name='message-circle'
                        type="Feather"
                        style={Styles.fIcon}
                      />
                      <TextInput
                        style={Styles.fInput}
                        placeholder='ಒಟಿಪಿ'
                        placeholderTextColor='rgba(36,42,56,0.4)'
                        keyboardType={'phone-pad'}
                        onChangeText={(text) => this.onFormChange(text, 'otp')}
                        disabled={fetching}
                        textContentType="oneTimeCode"
                      />
                    </View> : null
                }
                {
                  otpStatus === 1 ?
                    <View style={resetPasswordError ? Styles.fRowError : Styles.fRow}>
                      <Icon name='textbox-password' type="MaterialCommunityIcons" style={Styles.fIcon} />
                      <TextInput
                        style={Styles.fInput}
                        secureTextEntry={!showPassword}
                        textContentType="password"
                        placeholder='ಹೊಸ ಪಾಸ್‌ವರ್ಡ್'
                        placeholderTextColor='rgba(36,42,56,0.4)'
                        onChangeText={(text) => this.onFormChange(text, 'password')}
                        disabled={fetching}
                      />
                      <Icon
                        name={showPassword ? 'eye-off' : 'eye'}
                        type="MaterialCommunityIcons"
                        style={Styles.fIcon}
                        onPress={this.togglePasswordShow}
                      />
                    </View> : null
                }
                {
                  typeof resetPasswordError === 'string' ? <Text style={Styles.errorText}>{resetPasswordError}</Text> : null
                }
                {
                  otpStatus ?
                    <LinkButton
                      text="ಒಟಿಪಿಯನ್ನು ಮರುಹೊಂದಿಸಿ"
                      onPress={this.handleNextClick}
                    /> : null
                }
                {
                  !otpStatus ?
                    <RegularButton text="ಒಟಿಪಿ ಪಡೆಯಿರಿ" onPress={this.handleNextClick} /> : null
                }
                {
                  otpStatus === 1 ?
                    <RegularButton text="ಪಾಸ್ವರ್ಡ್ ಮರುಹೊಂದಿಸಿ" onPress={this.onFormSubmit} /> : null
                }
                {
                  otpStatus === 2 ?
                    <LinkButton
                      text="ಒಟಿಪಿಯನ್ನು ಮರುಹೊಂದಿಸಿ"
                      onPress={this.handleNextClick}
                    /> : null
                }
              </View>
            </View>

            <View style={Styles.account}>
              <Text style={Styles.accountText}>ಖಾತೆ ಇಲ್ಲವೇ?</Text>
              <TouchableOpacity style={Styles.accountBtn} onPress={() => this.goToPage('RegisterScreen')}>
                <Text style={Styles.accountBtnText}>ಸೈನ್ ಅಪ್ ಮಾಡಿ!</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Content>
        {
          fetching ? <CustomActivityIndicator /> : null
        }
      </Container>

    )
  }
}

const mapStateToProps = (state) => {
  return {
    otpStatus: state.login.getOtpStatus,
    fetching: state.login.fetching,
    resetPasswordError: state.login.resetPasswordError,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getOTPForNumber: (phone) => dispatch(LoginActions.verifyUser(phone)),
    attempResetPassword: (data) => dispatch(LoginActions.resetPasswordRequest(data)),
    errorToast: (msg) => dispatch(ToastActionsCreators.displayError(msg)),
    onNavigationResetState: () => dispatch(LoginActions.logoutRequest()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword)
