import React, { Component } from 'react'
import AsyncStorage from '@react-native-community/async-storage';
import { Container } from 'native-base'
import { connect } from 'react-redux'
import { format } from 'date-fns';
import DetailView from '../Components/DevDetail';
import ErrorPage from '../Components/NetworkErrorScreen';
import { CustomActivityIndicator } from '../Components/ui';
import { NavigationEvents } from 'react-navigation';

import EventActions from '../Redux/EventRedux'

class EventDetail extends Component {
  static navigationOptions = {
    title: 'ದಿನಂಪ್ರತಿ ಕಾರ್ಯಕ್ರಮಗಳು',
  }
  componentDidMount() {
    this.refreshPage();
  }

  refreshPage() {
    const { navigation, fetching } = this.props;
    const parentProps = navigation.getParam('selectedData', null);
    if (parentProps && parentProps.id) {
      AsyncStorage.getItem('accessToken').then((accessToken) => {
        if (!fetching) {
          this.props.getDetailsForSelection(accessToken, parentProps.id, );
        }
      });
    }
  }

  renderContent() {
    const { data, detailError } = this.props;
    const componentPayload = {
      title: data.name,
      images: data.images,
      subTitle: data.venue,
      desc: data.details,
      createdDate: data.created_at ? format(new Date(data.created_at), 'DD-MM-YYYY') : 'NA',
      lastUpdatedAt: data.updated_at ? format(new Date(data.updated_at), 'DD-MM-YYYY') : 'NA',
      metaData: [
        {title: 'ಸಮಯ', description: `${data.date} ${data.start_time ? format(new Date(data.start_time), 'hh:mm A') : ''} - ${data.end_time ? format(new Date(data.end_time), 'hh:mm A') : ''}`, iconName: 'calendar', hasIcon: true},
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
    const { fetching } = this.props;
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
    data: state.event.detailData,
    fectching: state.event.fetchingDetail,
    detailError: state.event.detailError,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getDetailsForSelection: (id, accessToken) => dispatch(EventActions.eventOnDetailRequest(id, accessToken))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EventDetail)
