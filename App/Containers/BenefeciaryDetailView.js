import React, { Component } from 'react';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import { NavigationEvents } from "react-navigation";
import { CustomActivityIndicator } from '../Components/ui';
import { Container } from 'native-base';
import ErrorPage from '../Components/NetworkErrorScreen';
import DetailView from '../Components/DevDetail';
import BeneficiaryActions from '../Redux/BeneficiaryRedux';


class BenefeciaryDetailView extends Component {
  static navigationOptions = {
    title: 'ಫಲಾನುಭವಿಗಳು',
    headerBackTitle: null,
    color: '#F97D09'
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
      title: data.place,
      images: data.images,
      subTitle: data.scheme_type,
      desc: data.granted_relief,
      metaData: [
        {title: 'ಹೆಸರು', description: data.beneficiary_name},
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
    data: state.beneficiary.detailData,
    fectching: state.beneficiary.fetchingDetails,
    detailError: state.beneficiary.detailError,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getDetailsForSelection: (id, accessToken) => dispatch(BeneficiaryActions.beneficiaryOnDetailRequest(id, accessToken))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BenefeciaryDetailView)
