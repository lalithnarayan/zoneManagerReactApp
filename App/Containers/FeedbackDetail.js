import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StatusBar, TouchableOpacity, Image, AsyncStorage } from 'react-native';
import { Container, Header, Content, Icon, Text, View, Badge } from 'native-base';
import { connect } from 'react-redux';
import { format } from 'date-fns';
import { NavigationEvents } from "react-navigation";
import { Images } from '../Themes/';
import ErrorPage from '../Components/NetworkErrorScreen';
import LoadingOverlay from '../Components/LoadingOverlay';
import ImageViewerComponent from '../Components/ImageViewer';
import FeedbackActions from '../Redux/FeedbackRedux';
import Styles from './Styles/BenefeciaryDetailViewStyle'

class FeedbackDetailView extends Component {

  constructor(props){
    super(props);

    this.onFullScreenImage = this.onFullScreenImage.bind(this);
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

  onFullScreenImage(){
    console.log("Data come .....");
    //alert("Full Screen");
    const { data } = this.props;
    this.props.navigation.navigate("FullScreenImages", {
                  data: data.images,
                  backScreen: 'FeedbackDetailScreen'
    });
  }

  renderContent() {
    const { data, detailError } = this.props;
    if (detailError) {
      return <ErrorPage status={detailError} onButtonClick={() => this.refreshPage()} />
    }
    console.log("data :- ", data);
    return (
      <Content contentContainerStyle={Styles.layoutDefault}>
        <Image source={Images.background} style={Styles.bgImg} />
        <View style={[Styles.bgLayout, Styles.marginTopSmall]}>
          <View style={Styles.hTop}>
            <Icon name='comments' type='FontAwesome' style={Styles.hImg} />
            <View style={Styles.hContent}>
              <Text style={Styles.hTopText}>{data.name}</Text>

              <View style={Styles.hContent}>
                <Text style={[Styles.infoLabel, { color: '#FFD328' }]}>{data.place}</Text>
              </View>
              <Text style={Styles.hTopDesc}>Created on: {data.created_at ? format(new Date(data.created_at), 'DD-MM-YYYY') : 'NA'}</Text>
            </View>

          </View>
          <View style={[Styles.tripItem, Styles.marginTopSmall]}>
            <View style={[Styles.truckInfo, { flexDirection: 'column' }]}>
              <View>
                <Text style={Styles.infoLabel}>ಇಲಾಖೆ/Department</Text>
                <Text style={Styles.truckData}>{data.department}</Text>
              </View>
              <View>
                <Text style={Styles.infoLabel}> ಹಾಲಿ ಸ್ಥಿತಿ/Status</Text>
                <Text style={Styles.truckData}>{data.status}</Text>
              </View>
              <View>
                <Text style={Styles.infoLabel}> Type/ದೂರು/ಸಲಹೆ/ಬೇಡಿಕೆ</Text>
                <Text style={Styles.truckData}>{data.feedback_type}</Text>
              </View>
            </View>
            <View style={Styles.truckInfo}>
              <View>
                <Text style={Styles.infoLabel}>ಕ್ರಿಯೆ/Action</Text>
                <Text style={Styles.truckData}>{data.action_taken || 'NA'}</Text>
              </View>
            </View>
            <View style={Styles.msgBox}>
              <Text style={Styles.infoLabel}>ಷರಾ/Remarks</Text>
              <Text style={Styles.truckData}>{data.remarks || 'No Remarks'}</Text>
            </View>
            <View style={[Styles.msgBox, { paddingVertical: 4 }]}>
                <Text style={Styles.postedOn}>Last Updated at: {data.updated_at ? format(new Date(data.updated_at), 'DD-MM-YYYY') : 'NA'}</Text>
              </View>
          </View>
        </View>
        {
          data.images && data.images.length ? <ImageViewerComponent data={data.images} onFullScreenEvent={this.onFullScreenImage} /> : null
        }

      </Content>

    )
  }
  render() {

    const { data, navigation, fetching } = this.props;
    const parentProps = navigation.getParam('selectedData', null);
    if (parentProps && data && (parentProps.id !== data.id)) {
      const { fetching } = this.props;
      AsyncStorage.getItem('accessToken').then((accessToken) => {
        if (!fetching) {
          this.props.getDetailsForSelection(accessToken, parentProps.id);
        }
      });
    }
    return (
      <Container>
        <Header style={Styles.navigation}>
          <StatusBar backgroundColor="#242A38" animated barStyle="light-content" />
          <View style={Styles.nav}>
            <View style={Styles.navLeft}>
              <TouchableOpacity style={Styles.navLeft} onPress={() => {
                navigation.navigate("FeedbackList")
              }}>
                <Icon name='arrow-back' type="MaterialIcons" style={Styles.navIcon} />
              </TouchableOpacity>
            </View>
            <View style={Styles.navMiddle}>
              <Text style={Styles.logo}>Feedback Details</Text>
            </View>
            <View style={Styles.navRight} />
          </View>
        </Header>
        {this.renderContent()}
        <LoadingOverlay
          visible={fetching}
          color="white"
          indicatorSize="large"
          messageFontSize={24}
          message="Loading..."
        />
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