import React, { Component } from 'react'
import { StatusBar, TouchableOpacity, RefreshControl, StyleSheet, Image, ImageBackground, Dimensions, ScrollView, Platform, SafeAreaView, FlatList, ToolbarAndroid } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Container, Header, Content, Button, Icon, Text, Card, Left, Right, Body, Input, Footer, View, FooterTab, Badge, CheckBox } from 'native-base'
import { connect } from 'react-redux';
import LoadingOverlay from '../Components/LoadingOverlay';
import ErrorPage from '../Components/NetworkErrorScreen';
import { Images } from '../Themes/';
import ModuleActions from '../Redux/ModuleRedux'
import Styles from './Styles/ModuleListViewStyle'


function randomString(length, chars) {
  var result = '';
  for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

class ModuleListView extends Component {

  componentDidMount() {
    this.onTableFetchRequest();
  }

  onTableFetchRequest = () => {
    const { lastCalledPage, pageNo, fetching } = this.props;
    AsyncStorage.getItem('accessToken').then((accessToken) => {
      if(!fetching) {
        this.props.getListData(accessToken, pageNo, lastCalledPage);
      }
    });
  }

  getMoreItems = () => {
    console.log('end of scroll')
    this.onTableFetchRequest();
  }

  renderListItem = ({ item, separators }) => {
    return (
      <View style={Styles.tripItem}>
        <View style={Styles.truckInfo}>
          <View>
            <Text style={Styles.truckTrip}>ವಿಷಯ</Text>
            <Text style={Styles.truckData}>{item.name}</Text>
          </View>
        </View>
        <View style={Styles.tripInfo}>
          <View style={Styles.rowSpaceAlignment}>
            <View style={Styles.tripPlaces}>
              <Icon name='circle-o' type="FontAwesome" style={Styles.tripIcon} />
              <Text style={Styles.placeText}>{item.startplace}</Text>
            </View>
            <View style={Styles.tripPlaces}>
              <Icon name='calendar-clock' type="MaterialCommunityIcons" style={Styles.checkIcon} />
              <Text style={Styles.placeText}>{item.startat}</Text>
            </View>
          </View>
          <Text style={Styles.lineTracker}>|</Text>
          <View style={Styles.rowSpaceAlignment}>
            <View style={Styles.tripPlaces}>
              <Icon name='circle-o' type="FontAwesome" style={Styles.tripIcon} />
              <Text style={Styles.placeText}>{item.finishplace}</Text>
            </View>
            <View style={Styles.tripPlaces}>
              <Icon name='calendar-clock' type="MaterialCommunityIcons" style={Styles.checkIcon} />
              <Text style={Styles.placeText}>{item.finishat}</Text>
            </View>
          </View>
        </View>
        <View style={Styles.rowSpaceAlignment}>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity style={Styles.editBtn} onPress={() => {
              NavigationService.navigate("TransporterCreateTrip")
            }}>
              <Icon name='pencil' type="FontAwesome" style={Styles.editIcon} />
              <Text style={Styles.editText}>EDIT</Text>
            </TouchableOpacity>
            <TouchableOpacity style={Styles.editBtn}>
              <Icon name='trash-o' type="FontAwesome" style={Styles.editIcon} />
              <Text style={Styles.editText}>DELETE</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={Styles.editBtn} onPress={() => {
            NavigationService.navigate("PublicSearchShipment")
          }}>
            <Icon name='md-search' type="Ionicons" style={Styles.editIcon} />
            <Text style={Styles.editText}>SHIPMENT</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
//   <TouchableOpacity style={Styles.msgItem}>
//   <View>
//     <View>
//       <Text style={Styles.msgName}>ವಿಷಯ</Text>
//       <Text style={Styles.msgContent}>{item.name}</Text>
//     </View>
//     <View>
//       <Text style={Styles.msgName}>ಇಲಾಖೆ</Text>
//       <Text style={Styles.msgContent}>{item.department}</Text>
//     </View>
//     <View>
//       <Text style={Styles.msgName}>ಹಾಲಿ ಸ್ಥಿತಿ</Text>
//       <Text style={Styles.msgContent}>{item.status}</Text>
//     </View>
//     <View>
//       <Text style={Styles.msgName}>ಕ್ರಿಯೆ</Text>
//       <Text style={Styles.msgContent}>{item.action_taken}</Text>
//     </View>
//   </View>
// </TouchableOpacity>
  refreshPage = () => {
    this.onTableFetchRequest();
  }
  renderHeader = () => {
    return (
      <View>
        <Image source={Images.background} style={Styles.bgImg} />
        <View style={Styles.bgLayout}>
          <View style={Styles.hTop}>
            <Icon name='google-maps' type="MaterialCommunityIcons" style={Styles.hImg} />
            <View style={Styles.hColumn}>
              <View style={Styles.hContent}>
                <Text style={Styles.hTopText}>Feedback</Text>
                <Text style={Styles.hTopDesc}>Manage all the feedbacks rasied by you</Text>
              </View>
            </View>
          </View>
          <View style={Styles.hTop}>
            <TouchableOpacity style={Styles.addBtn} onPress={() => {
              NavigationService.navigate("TransporterCreateTrip")
            }}>
              <Text style={Styles.addText}>Give Feedback</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }
  renderContent = () => {
    const { listData, listError, fetching } = this.props;
    if (listError) {
      return <ErrorPage status={listError} onButtonClick={this.refreshPage} />
    }
    return (
      <FlatList
        style={{ marginBottom: 80 }}
        data={listData}
        ListHeaderComponent={this.renderHeader}
        showsHorizontalScrollIndicator={false}
        renderItem={this.renderListItem}
        keyExtractor={() => randomString(6, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')}
        removeClippedSubview
        refreshPage={()=> this.goToPage('refresh')}
        bounces={false}
      />
    )
  }
  render() {
    const { fetching } = this.props;
    return (
      <Container>
        <Header style={Styles.navigation}>
          <StatusBar backgroundColor="#242A38" animated barStyle="light-content" />
          <View style={Styles.nav}>
            <View style={Styles.navLeft}>
              <TouchableOpacity style={Styles.navLeft} onPress={() => {
                NavigationService.navigate("TransporterDashboard")
              }}>
                <Icon name='arrow-back' type="MaterialIcons" style={Styles.navIcon} />
              </TouchableOpacity>
            </View>
            <View style={Styles.navMiddle} />
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
        <Footer>
          <View style={Styles.nav}>
            <View style={Styles.navLeft}>
              <TouchableOpacity style={Styles.navLeft} onPress={() => {
                NavigationService.navigate("TransporterDashboard")
              }}>
                <Icon name='arrow-back' type="MaterialIcons" style={Styles.navIcon} />
              </TouchableOpacity>
            </View>
            <View style={Styles.navMiddle} />
            <View style={Styles.navRight} />
          </View>
        </Footer>
      </Container>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    pageNo: state.moduleName.pageNo,
    fetching: state.moduleName.fetching,
    lastCalledPage: state.moduleName.lastCalledPage,
    listError: state.moduleName.listError,
    listData: state.moduleName.listData,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getListData: (accessToken, pageNo, lastCalledPage) =>
      dispatch(ModuleActions.moduleOnListRequest(accessToken, pageNo, lastCalledPage))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModuleListView)
