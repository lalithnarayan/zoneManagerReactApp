import React, { Component } from 'react'
import { Container, Content, Icon, Text } from 'native-base'
import { connect } from 'react-redux'
import { ToastActionsCreators } from 'react-native-redux-toast';
import { CustomActivityIndicator } from '../Components/ui';
import LoginActions from '../Redux/LoginRedux'
import { SignUpForm, OTPForm } from '../Components/forms'

export const onboardingHeaderStyle = {
  backgroundColor: '#f5f5f2',
  borderBottomColor: 'transparent'
}
class Register extends Component {
  static navigationOptions = {
    title: 'ಸೈನ್ ಅಪ್',
    headerStyle: onboardingHeaderStyle,
  }
  constructor(props) {
    super(props);
    const phone = props.navigation.getParam('phone', null);
    this.state = {
      formObj: {
      },
      errorsObj: {},
      isErrorShown: false,
    }
  }

  componentDidMount() {
    this.props.getPositionsList();
  }

  componentWillReceiveProps(nextProps) {
    const { error } = nextProps;
    const { isErrorShown } = this.state;
    if (error && !isErrorShown) {
      const errorKeys = Object.keys(error);
      errorKeys.map((errorKey) => {
        const errorMsgs = error[errorKey];
        errorMsgs.map((errorMsg) => {
          this.props.errorToast(`${errorKey} ${errorMsg}`);
        });
      });
      this.setState({
        isErrorShown: true,
      });
    }
  };



  goToPage = (route) => {
    const { navigation } = this.props;
    navigation.navigate(route);
    this.props.onNavigationResetState();
    this.setState({
      formObj: {},
      errorsObj: {},
      isErrorShown: false,
    });
  }


  onFormSubmit = (values) => {
    this.props.getOTPForNumber(values.phone);
    this.setState({ formObj: values });
  };

  onOTPFormSubmit = (values) => {
    const { formObj } = this.state;
    const tempFormObj = { ...formObj };
    this.setState({ formObj: { ...formObj, ...values } });
    let data = new FormData();
    for (let property in tempFormObj) {
      if (property === 'first_name') {
        const firstName = tempFormObj[property];
        const lastName = tempFormObj['last_name'];
        data.append('user[name]', `${firstName} ${lastName}`);
      }
      else if (property !== 'last_name' && property !== 'first_name') {
        data.append(`user[${property}]`, tempFormObj[property]);
      }
    }
    for (let property in values) { 
       data.append([property], values[property]);
    }
    this.props.attempSingUp(data);
  }


  renderPostionOptions() {
    const { positions } = this.props;
    let options = positions.map(({ name, id }) => ({ name, value: id }));
    return options;
  }

  render() {
    const { otpStatus, fetching } = this.props;
    return (
      <Container>
        <Content contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: '#F1F2F6'
        }}>
          <SignUpForm
            loading={fetching}
            onSubmit={values => this.onFormSubmit(values)}
            positions={this.renderPostionOptions()}
            otpStatus={otpStatus}
          />
          {
            otpStatus ? <OTPForm
              loading={fetching}
              onSubmit={values => this.onOTPFormSubmit(values)}
            /> : null
          }

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
    error: state.login.signUpErrors,
    placesList: state.login.placesList,
    fetchingPlaces: state.login.fetchingPlaces,
    positions: state.login.positionsList,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getOTPForNumber: (phone) => dispatch(LoginActions.otpRequest(phone, true)),
    errorToast: (msg) => dispatch(ToastActionsCreators.displayError(msg)),
    attempSingUp: (data) => dispatch(LoginActions.signupRequest(data)),
    onNavigationResetState: () => dispatch(LoginActions.logoutRequest()),
    getPositionsList: () => dispatch(LoginActions.getPositionsList()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Register)

