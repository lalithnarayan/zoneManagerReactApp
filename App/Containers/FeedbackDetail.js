import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-community/async-storage';
import { Container } from 'native-base';
import { connect } from 'react-redux';
import { format } from 'date-fns';
import { NavigationEvents } from "react-navigation";
import ErrorPage from '../Components/NetworkErrorScreen';
import { CustomActivityIndicator } from '../Components/ui';
import FeedbackActions from '../Redux/FeedbackRedux';
import DetailView from '../Components/DevDetail';

class FeedbackDetailView extends Component {
  static navigationOptions = {
    title: 'ದೂರು/ಬೇಡಿಕೆ/ಸಲಹೆ',
    headerBackTitle: null,
  }
  refreshPage() {
    const { navigation, fetching } = this.props;
    const parentProps = navigation.getParam('selectedData', null);
    if (parentProps && parentProps.id) {
      AsyncStorage.getItem('accessToken').then((accessToken) => {
        if (!fetching) {
          this.props.getDetailsForSelection(accessToken, parentProps.id);
        }
      });
    }
  }

  renderContent() {
    const { data, detailError } = this.props;
    const componentPayload = {
      title: data.beneficiary_name,
      images: data.images,
      subTitle: data.scheme_type,
      desc: data.granted_relief,
      createdDate: data.created_at ? format(new Date(data.created_at), 'DD-MM-YYYY') : 'NA',
      lastUpdatedAt: data.updated_at ? format(new Date(data.updated_at), 'DD-MM-YYYY') : 'NA',
      metaData: [
        {title: 'ಸ್ಥಳ', description: data.place},
        {title: 'ಅರ್ಜಿ ದಿನಾಂಕ', description: data.application_date},
        {title: 'ಹಾಲಿ ಸ್ಥಿತಿ', description: data.status},
        {title: 'ಷರಾ', description: data.remarks},
      ]
    };
    if (detailError) {
      return <ErrorPage status={detailError} onButtonClick={() => this.refreshPage()} />
    }
    return (
      <DetailView data={componentPayload} />
    )
  }
  render() {
    const { navigation, fetching } = this.props;
    return (
      <Container>
        <NavigationEvents
          onDidFocus={() => this.refreshPage()}
        />
        {this.renderContent()}
        {fetching ? <CustomActivityIndicator /> : null}
      </Container>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    data: state.feedback.detailData,
    fectching: state.feedback.fetchingDetails,
    detailError: state.feedback.detailError,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getDetailsForSelection: (id, accessToken) => dispatch(FeedbackActions.feedbackOnDetailRequest(id, accessToken))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FeedbackDetailView)
