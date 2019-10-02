import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-community/async-storage';
import { Container } from 'native-base';
import { connect } from 'react-redux';
import { format } from 'date-fns';
import { NavigationEvents } from "react-navigation";
import ErrorPage from '../Components/NetworkErrorScreen';
import { CustomActivityIndicator } from '../Components/ui';
import AppointmentActions from '../Redux/AppointmentRedux';
import DetailView from '../Components/DevDetail';

class FeedbackDetailView extends Component {
  static navigationOptions = {
    title: 'ಸಮಯಾವಕಾಶ ಕೋರಿಕೆ',
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
      title: data.title,
      images: data.images,
      subTitle: '',
      desc: data.venue,
      createdDate: data.created_at ? format(new Date(data.created_at), 'DD-MM-YYYY') : 'NA',
      lastUpdatedAt: data.updated_at ? format(new Date(data.updated_at), 'DD-MM-YYYY') : 'NA',
      metaData: [
        { title:'ಸಂಘ ಸಂಸ್ಥೆ/ವ್ಯಕ್ತಿಯ ಹೆಸರು', description: data.organisation},
        { title: 'ಕೋರಿಕೆಯ ದಿನಾಂಕ', description: data.req_date },
        { title: 'ಕೋರಿಕೆಯ ಸಮಯ', description: format(new Date(data.req_time), 'hh:mm A') },
        { title: 'ಪರ್ಯಾಯ ದಿನಾಂಕ', description: data.opt_date },
        { title: 'ಪರ್ಯಾಯ ಸಮಯ', description: data.opt_time && format(new Date(data.opt_time), 'hh:mm A') },
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
    data: state.appointment.detailData,
    fectching: state.appointment.fetchingDetails,
    detailError: state.appointment.detailError,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getDetailsForSelection: (id, accessToken) => dispatch(AppointmentActions.appointmentOnDetailRequest(id, accessToken))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FeedbackDetailView)
