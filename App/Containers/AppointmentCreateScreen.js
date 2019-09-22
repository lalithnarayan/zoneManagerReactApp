import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import { Container, Content } from 'native-base';
import { format } from 'date-fns';
import { connect } from 'react-redux';
import { AppointmentForm } from '../Components/forms'
import { CustomActivityIndicator } from '../Components/ui';
import ErrorPage from '../Components/NetworkErrorScreen';
import AppointmentActions from '../Redux/AppointmentRedux';


class AppointmentCreateScreen extends Component {
  static navigationOptions = {
    title: 'ಸಮಯಾವಕಾಶ ಕೋರಿಕೆ',
    headerBackTitle: null,
    color: '#F97D09'
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.createFeedbackResponse && nextProps.createFeedbackResponse.id) {
      this.goToPage();
    }
  }

  onFormSubmit = (values) => {
    let data = new FormData();
    for (let property in values) {
      if (property !== 'photos') {
        if(property.includes('date') && values[property]) {
          const dateObjToString  = format(values[property], 'DD-MM-YYYY') 
          data.append(`appointment[${property}]`, dateObjToString);
        } else {
          data.append(`appointment[${property}]`, values[property]);
        }
      } else {
        const photos = values[property];
        if (photos && photos.length) {
          photos.map((photoItem, index) => {
            if (photoItem.file) {
              data.append(`appointment[stored_images_attributes][${index}][image]`, {
                uri: photoItem.file.uri,
                type: 'image/jpeg',
                name: 'image.jpg',
              });
            }
            return photoItem;
          });
        }
      }
    }
    AsyncStorage.getItem('accessToken').then((accessToken) => {
      this.props.createAppointment(accessToken, data);
    });
  }

  refreshPage = () => {
    const { fetching } = this.props;
    this.setState({
      formObj: {},
      errorsObj: {},
      photos: [],
    });
  }

  goToPage = () => {
    const { navigation } = this.props;
    this.props.resetStateOnNavigation();
    navigation.navigate("AppointmentListScreen");
  }

  renderComponent() {
    const { errorCode, fetching } = this.props;
    if (errorCode) {
      return <ErrorPage status={errorCode} onButtonClick={() => this.refreshPage(1)} />
    }
    return (
      <Content contentContainerStyle={{
        flexGrow: 1,
        backgroundColor: '#F1F2F6'
      }}>
        <AppointmentForm
          loading={fetching}
          onSubmit={values => this.onFormSubmit(values)}
        />
      </Content>
    )
  }

  render() {
    const { fetching } = this.props;
    const isLoaderVsible = fetching ? true : false;
    return (
      <Container>
        {this.renderComponent()}
        {
          isLoaderVsible ? <CustomActivityIndicator /> : null
        }
      </Container>

    )
  }
}

const mapStateToProps = (state) => {
  return {
    fetching: state.appointment.fetching,
    error: state.appointment.formError,
    errorCode: state.appointment.createFeedbackErrorCode,
    createFeedbackResponse: state.appointment.createFeedbackResponse,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    createAppointment: (accessToken, data) =>
      dispatch(AppointmentActions.createAppointment(accessToken, data)),
    resetStateOnNavigation: () =>
      dispatch(AppointmentActions.resetStateOnNavigation())

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AppointmentCreateScreen)
