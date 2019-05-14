import React, { Component } from 'react'
import { AsyncStorage, TouchableOpacity, TextInput, StyleSheet, Image, ImageBackground, Dimensions, ScrollView, Platform, SafeAreaView, FlatList, ToolbarAndroid, RefreshControl } from 'react-native'
import { Container, Header, Content, Button, Icon, Text, Title, TabHeading, ScrollableTab, Card, Left, Right, Body, Input, Tabs, Tab, Footer, View, FooterTab, Badge } from 'native-base'
import { connect } from 'react-redux'
import { format } from 'date-fns';
import { Images } from '../Themes/'
import HeaderComponent from '../Components/HeaderComponent'
import LoadingOverlay from '../Components/LoadingOverlay';
import FooterComponent from '../Components/ListFooter';
import ErrorPage from '../Components/NetworkErrorScreen';
import EventActions from '../Redux/EventRedux'
import Styles from './Styles/EventsListStyle'

function randomString(length, chars) {
  var result = '';
  for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}
class EventsList extends Component {

  constructor(props) {
    super(props);
    this.renderRow = this.renderRow.bind(this);
  }

  componentDidMount() {
    this.onTableFetchRequest(1);
  }

  goToPage = (option) => {
    const { lastCalledPage } = this.props;
    if (option === 'next') {
      this.onTableFetchRequest(lastCalledPage + 1);
    } else if (option === 'prev') {
      this.onTableFetchRequest(lastCalledPage - 1 >= 0 ? lastCalledPage - 1 : 1);
    } else if (option === 'first') {
      this.onTableFetchRequest(1);
    }else if(option === 'refresh') {
      this.onTableFetchRequest(lastCalledPage);
    }
  }

  onTableFetchRequest = (pageID) => {
    const { fetching } = this.props;
    AsyncStorage.getItem('accessToken').then((accessToken) => {
      if (!fetching) {
        this.props.getEventsList(accessToken, pageID);
      }
    });
  }

  goToDetailView(selectedData) {
    const { navigate } = this.props.navigation;
    navigate("EventDetailScreen", { selectedData });
  }

  renderRow = ({ item, index }) => {
    return (
      <TouchableOpacity onPress={() => this.goToDetailView(item)}>
        <View style={Styles.bookingItem}>
          <View style={Styles.tripTo}>
            <Text style={Styles.productText}>{item.name}</Text>
          </View>
          <View style={Styles.truckInfo}>
            <View style={{ flexDirection: 'row' }}>
              <Icon name="date-range" type="MaterialIcons" style={Styles.truckIcon} />
              <Text style={Styles.truckText}>{item.date} {item.start_time ? format(new Date(item.start_time), 'hh:mm A') : ''} - {item.end_time ? format(new Date(item.end_time), 'hh:mm A') : ''}</Text>
            </View>
          </View>
          <View style={Styles.tripDest}>
            <View style={Styles.locations}>
              <View style={{ flexDirection: 'row' }}>
                <Icon name="location-pin" type="Entypo" style={[Styles.locationIcon, Styles.colorGreen]} />
                <Text style={Styles.placeText}>{item.venue}</Text>
              </View>
            </View>
          </View>

          <View style={Styles.msgBox}>
            <Text style={Styles.msgText}>{item.details}
            </Text>
          </View>
          <View style={Styles.orderDetails}>
            <Text style={Styles.orderText}>Updated at {item.updated_at ? format(new Date(item.updated_at), 'DD-MM-YYYY') : 'NA'}</Text>
          </View>
        </View>
      </TouchableOpacity>)
  }
  renderContent = () => {
    const { listError, lastCalledPage, data, fetching } = this.props;
    if (listError) {
      return <ErrorPage status={listError} onButtonClick={() => this.onTableFetchRequest(1)} />
    } else {
      return (
        <View style={{ flex: 1 }}>
          <Content
            contentContainerStyle={[Styles.layoutDefault, { flex: 1 }]}
          >
            <Image source={Images.background} style={Styles.bgImg} />
            <View style={Styles.bgLayout}>
              <View style={Styles.hTop}>
                <Icon name='calendar-check-o' type="FontAwesome" style={Styles.hImg} />
                <TouchableOpacity style={Styles.hContent} onPress={() => {
                  this.goToPage('first')
                }}>
                  <Text style={Styles.hTopText}>Events</Text>
                  <Text style={Styles.hTopDesc}>List of All Public Meetings and Events of our MLA</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                style={{ marginBottom: 80 }}
                data={data}
                refreshing={fetching}
                keyExtractor={() => randomString(6, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')}
                showsHorizontalScrollIndicator={false}
                removeClippedSubview
                renderItem={this.renderRow}
              />
            </View>
          </Content>
          <FooterComponent
            goToFirstPage={() => this.goToPage('first')}
            goToNextPage={() => this.goToPage('next')}
            goToPrevPage={() => this.goToPage('prev')}
            refreshPage={()=> this.goToPage('refresh')}
            data={data}
            currentPage={lastCalledPage}
          />
        </View>
      )
    }
  }
  render() {
    const { fetching } = this.props;
    return (
      <Container>
        <HeaderComponent title={"Events"} {...this.props} />
        {this.renderContent()}
        {/* <LoadingOverlay
          visible={fetching}
          color="white"
          indicatorSize="large"
          messageFontSize={24}
          message="Loading..."
        /> */}
      </Container>

    )
  }
}

const mapStateToProps = (state) => {
  return {
    data: state.event.listData,
    fetching: state.event.fetching,
    lastCalledPage: state.event.lastCalledPage,
    listError: state.event.listError,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getEventsList: (accessToken, pageNo) =>
      dispatch(EventActions.eventOnListRequest(accessToken, pageNo))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EventsList)
