import React, { Component } from 'react'
import { connect } from 'react-redux'
import { AsyncStorage, TouchableOpacity, FlatList } from 'react-native'
import { Container, Content } from 'native-base'
import styled from 'styled-components/native'
import DevelopmentWorksActions from "../Redux/DevelopmentWorkRedux";
import { format } from 'date-fns';
import { DevWorksFIlterForm } from '../Components/forms'
import { CustomActivityIndicator, LinkButton, CoursePriceTag } from '../Components/ui';
import FooterComponent from '../Components/ListFooter';
import ErrorPage from '../Components/NetworkErrorScreen';
import { NavigationEvents } from 'react-navigation';
import ListCardComponent from '../Components/ListCardComponent';
import EmptyListComponent from '../Components/EmptyList';

const StyledBadge = styled.View`
justify-content: center;
align-items: center;
display: flex;
`;

const Wrapper = styled.View`
  justify-content: center;
  align-items: center;
`

function randomString(length, chars) {
  var result = '';
  for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

class BeneficiaryList extends Component {
  static navigationOptions = {
    title: 'ಅಭಿವೃಧ್ಧಿ ಕಾಮಗಾರಿ',
    headerBackTitle: null,
  }

  constructor(props) {
    super(props);
    this.state = {
      showFilter: false,
    }
  }

  componentDidMount() {
    this.goToPage('first');
  }

  goToPage = (option, panchayatID) => {
    const { lastCalledPage } = this.props;
    if (option === 'next') {
      this.onTableFetchRequest(lastCalledPage + 1, panchayatID);
    } else if (option === 'prev') {
      this.onTableFetchRequest(lastCalledPage - 1 >= 0 ? lastCalledPage - 1 : 1, panchayatID);
    } else if (option === 'first') {
      this.onTableFetchRequest(1, panchayatID);
    } else if (option === 'refresh') {
      this.onTableFetchRequest(lastCalledPage, panchayatID);
    }
  }

  onTableFetchRequest = (pageID, panchayatID) => {
    const { fetching } = this.props;
    AsyncStorage.getItem('accessToken').then((accessToken) => {
      if (!fetching) {
        this.props.getListData(accessToken, pageID, panchayatID);
      }
    });
  }

  goToDetailView(selectedData) {
    const { navigate } = this.props.navigation;
    navigate('DevelopmentWorkDetail', { selectedData });
  }

  formatData(data) {
    console.log(data);
    return (
      {
        title: data.name,
        image: data.image,
        subTitle: data.department,
        subTitleLabel: 'ಇಲಾಖೆ',
        desc: data.desc,
        createdDate: data.created_at ? format(new Date(data.created_at), 'DD-MM-YYYY') : 'NA',
        lastUpdatedAt: data.updated_at ? format(new Date(data.updated_at), 'DD-MM-YYYY') : 'NA',
        metaData: [
          { title: 'ಸ್ಥಳ', description: data.place },
          { title:'ಕೆಲಸದ ವಿಧ', description: data.type_of_work},
          { title: 'ಮಂಜೂರಾದ ಮೊತ್ತ', description: data.sanctioned_amount, hasIcon: true, iconName: 'cash-multiple', isCash: true, },
          { title: 'ಹಾಲಿ ಸ್ಥಿತಿ', description: data.status },
          { title: 'ಅಡಿಗಲ್ಲು ದಿನಾಂಕ', description: data.foundation_date, iconName: 'calendar', hasIcon: true },
          { title: 'ಉದ್ಘಾಟನೆ ದಿನಾಂಕ', description: data.inaugration_date, iconName: 'calendar', hasIcon: true },
        ]
      }
    )
  }

  toggleFilter = () => {
    const { showFilter } = this.state;
    this.setState({
      showFilter: !showFilter,
    });
  }

  onFormSubmit = ({ panchayat_id, panchayat_name }) => {
    this.onTableFetchRequest(1, panchayat_id);
    this.setState({
      showFilter: false,
      panchayat_id,
      panchayat_name,
    });
  }

  onClearFilter = () => {
    this.setState({
      showFilter: false,
      panchayat_id: '',
      panchayat_name: '',
    });
    this.onTableFetchRequest(1);
  }

  renderContent = () => {
    const { listError, data, fetching } = this.props;
    const { panchayat_name, panchayat_id } = this.state;
    if (listError) {
      return <ErrorPage status={listError} onButtonClick={() => this.onTableFetchRequest(1)} />
    }
    return (
      <Content>
        {
          data.length ? <LinkButton
            text={"ಫಿಲ್ಟರ್ ಮಾಡಿ"}
            onPress={() => this.toggleFilter()}
          /> : null
        }
        <StyledBadge>
          {
            panchayat_name ? <React.Fragment>
              <CoursePriceTag price={panchayat_name} showCloseButton onClick={() => this.onClearFilter()}/>
            </React.Fragment> : null
          }
        </StyledBadge>

        <FlatList
          keyExtractor={() => randomString(6, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')}
          data={data}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => this.goToDetailView(item)}>
              <ListCardComponent
                {...this.formatData(item)}
              />
            </TouchableOpacity>
          )}
          removeClippedSubview
          ListEmptyComponent={() => <EmptyListComponent onButtonClick={() => this.onTableFetchRequest(1)} />}
        />
      </Content>
    )
  }

  render() {
    const { fetching, lastCalledPage, data } = this.props;
    const { showFilter, panchayat_id } = this.state;
    return (
      <Container>
        <NavigationEvents
          onDidFocus={() => this.goToPage('first', panchayat_id)}
        />
        {
          !showFilter ?
            <React.Fragment>
              {this.renderContent()}
              {
                fetching ? <CustomActivityIndicator /> : null
              }
              <FooterComponent
                goToFirstPage={() => this.goToPage('first', panchayat_id)}
                goToNextPage={() => this.goToPage('next', panchayat_id)}
                goToPrevPage={() => this.goToPage('prev', panchayat_id)}
                refreshPage={() => this.goToPage('refresh', panchayat_id)}
                data={data}
                currentPage={lastCalledPage}
              />
            </React.Fragment> : <Content contentContainerStyle={{
              flexGrow: 1,
              backgroundColor: '#F1F2F6'
            }}>
              <DevWorksFIlterForm
                loading={fetching}
                onSubmit={values => this.onFormSubmit(values)}
                onCancel={() => { this.toggleFilter(); }}
                onClearFilter={() => this.onClearFilter()}
                panchayat_id={panchayat_id}
              />
            </Content>
        }
      </Container>
    )
  }
}



const mapStateToProps = (state) => {
  return {
    // currentPage: state.beneficiary.pageNo,
    // listError: state.beneficiary.listError,
    data: state.development.listData,
    fetching: state.development.fetching,
    lastCalledPage: state.development.lastCalledPage,
    listError: state.development.listError,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getListData: (accessToken, pageNo, panchayatID) =>
      dispatch(DevelopmentWorksActions.devWorkOnListRequest(accessToken, pageNo, panchayatID))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BeneficiaryList)