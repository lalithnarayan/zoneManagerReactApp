import React, { Component } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { Container, Content } from 'native-base';
import { connect } from 'react-redux';
import { FeedbackForm } from '../Components/forms'
import { CustomActivityIndicator } from '../Components/ui';
import ErrorPage from '../Components/NetworkErrorScreen';
import FeedbackActions from '../Redux/FeedbackRedux';


class FeedbackScreen extends Component {
  static navigationOptions = {
    title: 'ದೂರು/ಬೇಡಿಕೆ/ಸಲಹೆ',
    headerBackTitle: null,
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
        data.append(`feedback[${property}]`, values[property]);
      } else {
        const photos = values[property];
        if (photos && photos.length) {
          photos.map((photoItem, index) => {
            if (photoItem.file) {
              data.append(`feedback[stored_images_attributes][${index}][image]`, {
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
      this.props.createFeedback(accessToken, data);
    });
  }

  refreshPage = () => {
    const { fetching } = this.props;
    this.setState({
      formObj: {},
      errorsObj: {},
      photos: [],
    });
    AsyncStorage.getItem('accessToken').then((accessToken) => {
      if (!fetching) {
        this.props.getDepartmentsStatus(accessToken);
      }
    });
  }

  goToPage = () => {
    const { navigation } = this.props;
    this.props.resetStateOnNavigation();
    navigation.navigate("FeedbackList");
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
        <FeedbackForm
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
    fetching: state.feedback.fetching,
    error: state.feedback.formError,
    errorCode: state.feedback.createFeedbackErrorCode,
    createFeedbackResponse: state.feedback.createFeedbackResponse,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getDepartmentsStatus: (accessToken) =>
      dispatch(FeedbackActions.getDepartmentsList(accessToken)),
    createFeedback: (accessToken, data) =>
      dispatch(FeedbackActions.createFeedback(accessToken, data)),
    resetStateOnNavigation: () =>
      dispatch(FeedbackActions.resetStateOnNavigation())

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FeedbackScreen)
