import React, { Component } from "react";
import { StatusBar, TouchableOpacity, TextInput, StyleSheet, Image, ImageBackground, Dimensions, ScrollView, Platform, SafeAreaView, FlatList, ToolbarAndroid, RefreshControl } from 'react-native'
import { Container, Header, Content, Button, Icon, Text, Card, Left, Right, Body, Input, Footer, View, FooterTab, Badge, CheckBox } from 'native-base'
import { connect } from "react-redux";
import { format } from 'date-fns';
import HeaderComponent from "../Components/HeaderComponent";
import DevelopmentWorksActions from "../Redux/DevelopmentWorkRedux";
import LoadingOverlay from '../Components/LoadingOverlay';
import { Images } from '../Themes/'
// Styles
import Styles from './Styles/BenefeciaryDetailViewStyle'


function randomString(length, chars) {
  var result = '';
  for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

class DevelopmentWorksList extends Component {

  constructor(props) {
    super(props);
    this.renderRow = this.renderRow.bind(this);
  }


  componentDidMount() {
    this.onTableFetchRequest();
  }

  onTableFetchRequest = () => {
    const { user, lastCalledPage, currentPage } = this.props;
    this.props.getDevelopmentWorkslist(user.access_token, currentPage, lastCalledPage);
  }

  onRefresh = () => {
    this.onTableFetchRequest();
  }
  goToDetailView(selectedData) {
    const { navigate } = this.props.navigation;
    navigate("DevelopmentWorkDetail", { selectedData });
  }

  getMoreItems = () => {
    if (!this.props.fetching) {
      this.onTableFetchRequest();
    }
  }
  renderRow({ item, index }) {
    return (
      <TouchableOpacity onPress={() => this.goToDetailView(item)}>
        <View style={Styles.tripItem}>
          <View style={Styles.truckInfo}>          
            <View>
              <Text style={Styles.infoLabel}> ಆರಿಸಿ/Place</Text>
              <Text style={Styles.truckData}>{item.place}</Text>
              <Text style={Styles.infoLabel}>ಕಾಮಗಾರಿ/Work</Text>
              <Text style={Styles.truckTrip}>{item.name}</Text>
              <Text style={Styles.infoLabel}>ವಿವರಗಳು/Details</Text>
              <Text style={Styles.truckTrip}>{item.desc}</Text>
            </View>
          </View>
          <View style={Styles.tripInfo}>
              <View style={{ flexDirection: "column", alignItems: "flex-start" }}>
                <Text style={Styles.infoLabel}>ಇಲಾಖೆ/Department</Text>
                <Text style={Styles.truckData}>{item.department}</Text>
              </View>
            <View style={[Styles.rowSpaceAlignment, { marginTop: 10}]}>
              <View style={Styles.tripPlaces}>
                <Icon
                  name="circle-o"
                  type="FontAwesome"
                  style={Styles.tripIcon}
                />
                <Text style={Styles.placeText}>ಮಂಜೂರಾದ ಮೊತ್ತ / Sanctioned</Text>
              </View>
              <View style={[Styles.tripPlaces, { flex: 2 }]}>
                <Icon
                  name="cash-multiple"
                  type="MaterialCommunityIcons"
                  style={Styles.checkIcon}
                />
                <Text style={[Styles.placeText]}>₹ {item.sanctioned_amount}</Text>
              </View>
            </View>
          </View>
          <View style={Styles.tripInfo}>
            <View style={Styles.rowSpaceAlignment}>
              <View style={Styles.tripPlaces}>
                <Icon
                  name="circle-o"
                  type="FontAwesome"
                  style={Styles.tripIcon}
                />
                <Text style={Styles.placeText}>ಅಡಿಗಲ್ಲು ದಿನಾಂಕ / Foundation date</Text>
              </View>
              <View style={[Styles.tripPlaces, { flex: 2 }]}>
                <Icon
                  name="calendar-clock"
                  type="MaterialCommunityIcons"
                  style={Styles.checkIcon}
                />
                <Text style={Styles.placeText}>{item.foundation_date || 'NA'}</Text>
              </View>
            </View>
            <Text style={Styles.lineTracker}>|</Text>
            <View style={Styles.rowSpaceAlignment}>
              <View style={Styles.tripPlaces}>
                <Icon
                  name="circle-o"
                  type="FontAwesome"
                  style={Styles.tripIcon}
                />
                <Text style={Styles.placeText}>ಉದ್ಘಾಟನೆ ದಿನಾಂಕ/Inauguration Date</Text>
              </View>
              <View style={[Styles.tripPlaces, { flex: 2 }]}>
                <Icon
                  name="calendar-clock"
                  type="MaterialCommunityIcons"
                  style={Styles.checkIcon}
                />
                <Text style={Styles.placeText}>{item.inaugration_date || 'NA'}</Text>
              </View>
            </View>
          </View>
          <View style={Styles.more}>
            <Text style={Styles.postedOn}>Last Updated at: {item.updated_at ? format(new Date(item.updated_at), 'DD MMM YYYY') : 'NA'}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    const { data, fetching } = this.props;
    return (
      <Container>
        <HeaderComponent title={''} {...this.props} />
        <Content
          refreshControl={
            <RefreshControl
              refreshing={fetching} 
              onRefresh={this.onRefresh} 
            />
          }
          contentContainerStyle={[Styles.layoutDefault, { flex: 1 }]}
        >
          <Image source={Images.background} style={Styles.bgImg} />
          <View style={Styles.bgLayout}>
            <View style={Styles.hTop}>
              <Icon name='package' type="MaterialCommunityIcons" style={Styles.hImg} />
              <View style={Styles.hContent}>
                <Text style={Styles.hTopText}>Development Works</Text>

                <Text style={Styles.hTopDesc}>View all the development works</Text>
              </View>
            </View>
            <FlatList
              contentContainerStyle={Styles.listContent}
              keyExtractor={() => randomString(6, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')}
              data={data}
              removeClippedSubview
              renderItem={this.renderRow}
              onEndReached={this.getMoreItems}
            />

          </View>
        </Content>
        <LoadingOverlay
          visible={fetching}
          color="white"
          indicatorSize="large"
          messageFontSize={24}
          message="Loading..."
        />
      </Container>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.login.user,
    data: state.development.listData,
    fetching: state.development.fetching,
    lastCalledPage: state.development.lastCalledPage,
    currentPage: state.development.currentPage,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getDevelopmentWorkslist: (accessToken, pageNo, lastCalledPage) =>
      dispatch(DevelopmentWorksActions.developmentWorkRequest(accessToken, pageNo, lastCalledPage))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DevelopmentWorksList);
