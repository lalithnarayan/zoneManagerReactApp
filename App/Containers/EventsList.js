import React, { Component } from 'react'
import { TouchableOpacity, FlatList } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Container, Content, View } from 'native-base'
import { connect } from 'react-redux'
import { format } from 'date-fns';
import { CustomActivityIndicator } from '../Components/ui';
import { NavigationEvents } from 'react-navigation';
import FooterComponent from '../Components/ListFooter';
import ErrorPage from '../Components/NetworkErrorScreen';
import EventActions from '../Redux/EventRedux'
import ListCardComponent from '../Components/ListCardComponent';
import EmptyListComponent from '../Components/EmptyList';

function randomString(length, chars) {
  var result = '';
  for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}
class EventsList extends Component {

  static navigationOptions = {
    title: 'ದಿನಂಪ್ರತಿ ಕಾರ್ಯಕ್ರಮಗಳು',
  }

  componentDidMount() {
    this.goToPage('first');
  }

  goToPage = (option) => {
    const { lastCalledPage } = this.props;
    if (option === 'next') {
      this.onTableFetchRequest(lastCalledPage + 1);
    } else if (option === 'prev') {
      this.onTableFetchRequest(lastCalledPage - 1 >= 0 ? lastCalledPage - 1 : 1);
    } else if (option === 'first') {
      this.onTableFetchRequest(1);
    } else if (option === 'refresh') {
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

  formatData(data) {
    return (
      {
        title: data.name,
        images: data.images,
        subTitleLabel: 'ಸ್ಥಳ',
        subTitle: data.venue,
        desc: data.details,
        createdDate: data.created_at ? format(new Date(data.created_at), 'DD-MM-YYYY') : 'NA',
        lastUpdatedAt: data.updated_at ? format(new Date(data.updated_at), 'DD-MM-YYYY') : 'NA',
        metaData: [
          { title: 'ಸಮಯ', description: `${data.date} ${data.start_time ? format(new Date(data.start_time), 'hh:mm A') : ''} - ${data.end_time ? format(new Date(data.end_time), 'hh:mm A') : ''}`, iconName: 'calendar', hasIcon: true },
          { title: 'ಷರಾ', description: data.remarks },
        ]
      }
    )
  }

  renderContent = () => {
    const { listError, data, fetching } = this.props;
    if (listError) {
      return <ErrorPage status={listError} onButtonClick={() => this.onTableFetchRequest(1)} />
    } else {
      return (
        <Content>
          <FlatList
            style={{ marginBottom: 80 }}
            data={data}
            refreshing={fetching}
            keyExtractor={() => randomString(6, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')}
            showsHorizontalScrollIndicator={false}
            removeClippedSubview
            ListEmptyComponent={() => <EmptyListComponent onButtonClick={() => this.onTableFetchRequest(1)} />}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => this.goToDetailView(item)}>
                <ListCardComponent
                  {...this.formatData(item)}
                />
              </TouchableOpacity>
            )}
          />
        </Content>

      )
    }
  }
  render() {
    const { fetching, data, lastCalledPage } = this.props;
    return (
      <Container>
        <NavigationEvents
          onDidFocus={() => this.goToPage('first')}
        />
        {this.renderContent()}
        {
          fetching ? <CustomActivityIndicator /> : null
        }
        <FooterComponent
          goToFirstPage={() => this.goToPage('first')}
          goToNextPage={() => this.goToPage('next')}
          goToPrevPage={() => this.goToPage('prev')}
          refreshPage={() => this.goToPage('refresh')}
          data={data}
          currentPage={lastCalledPage}
        />
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
