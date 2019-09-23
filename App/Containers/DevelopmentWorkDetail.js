import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { AsyncStorage } from 'react-native'
import { Container, Header, Content, Icon, Text, View } from 'native-base'
import { format } from 'date-fns';
import { NavigationEvents } from 'react-navigation';
import ErrorPage from '../Components/NetworkErrorScreen';
import DetailView from '../Components/DevDetail';
import { connect } from 'react-redux'
import { CustomActivityIndicator } from '../Components/ui';
import DevelopmentWorksActions from "../Redux/DevelopmentWorkRedux";

class DevelopmentWorkDetail extends Component {
  static navigationOptions = {
    title: 'ಅಭಿವೃಧ್ಧಿ ಕಾಮಗಾರಿ',
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

  renderDetailedView() {
    const { data, detailError } = this.props;
    const componentPayload = {
      title: data.name,
      images: data.images,
      subTitle: data.department,
      desc: data.desc,
      createdDate: data.created_at ? format(new Date(data.created_at), 'DD-MM-YYYY') : 'NA',
      lastUpdatedAt: data.updated_at ? format(new Date(data.updated_at), 'DD-MM-YYYY') : 'NA',
      metaData: [
        { title: 'ಸ್ಥಳ', description: data.place },
        { title: 'ಕೆಲಸದ ವಿಧ', description: data.type_of_work },
        { title: 'ಮಂಜೂರಾದ ಮೊತ್ತ', description: data.sanctioned_amount, hasIcon: true, iconName: 'cash-multiple', isCash: true, },
        { title: 'ಹಾಲಿ ಸ್ಥಿತಿ', description: data.status },
        { title: 'ಅಡಿಗಲ್ಲು ದಿನಾಂಕ', description: data.foundation_date, iconName: 'calendar', hasIcon: true },
        { title: 'ಉದ್ಘಾಟನೆ ದಿನಾಂಕ', description: data.inaugration_date, iconName: 'calendar', hasIcon: true },
        { title: 'ಷರಾ', description: data.remarks },
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
    const { fectching } = this.props;
    return (
      <Container>
        <NavigationEvents
          onDidFocus={() => this.refreshPage()}
        />
        {this.renderDetailedView()}
        {fectching ? <CustomActivityIndicator /> : null}
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    data: state.development.detailData,
    fectching: state.development.fetchingDetails,
    detailError: state.development.detailError,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getDetailsForSelection: (id, accessToken) => dispatch(DevelopmentWorksActions.devWorkOnDetailRequest(id, accessToken))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DevelopmentWorkDetail)