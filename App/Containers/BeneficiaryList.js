import React, { Component } from 'react'
import styled from 'styled-components/native'
import { connect } from 'react-redux'
import { AsyncStorage, TouchableOpacity, FlatList } from 'react-native'
import { Container, Content } from 'native-base'
import BeneficiaryActions from '../Redux/BeneficiaryRedux'
import { format } from 'date-fns';
import { CustomActivityIndicator, LinkButton, CoursePriceTag } from '../Components/ui';
import { DevWorksFIlterForm } from '../Components/forms'
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

function randomString(length, chars) {
  var result = '';
  for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

class BeneficiaryList extends Component {
  static navigationOptions = {
    title: 'ಫಲಾನುಭವಿಗಳು',
  }

  constructor(props) {
    super(props);
    this.state = {
      showFilter: false,
    }
  }


  toggleFilter = () => {
    const { showFilter } = this.state;
    this.setState({
      showFilter: !showFilter,
    });
  }

  componentDidMount() {
    this.goToPage('first');
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

  goToPage = (option, panchayatID) => {
    const { lastCalledPage } = this.props;
    if (option === 'next') {
      this.onTableFetchRequest(lastCalledPage + 1, panchayatID );
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
    navigate('BenfeciaryDetail', { selectedData });
  }

  formatData(data) {
    return (
      {
        title: data.beneficiary_name,
        image: data.image,
        subTitle: data.scheme_type,
        desc: data.granted_relief,
        createdDate: data.created_at ? format(new Date(data.created_at), 'DD-MM-YYYY') : 'NA',
        lastUpdatedAt: data.updated_at ? format(new Date(data.updated_at), 'DD-MM-YYYY') : 'NA',
        metaData: [
          { title: 'ಸ್ಥಳ', description: data.place },
          { title: 'ಅರ್ಜಿ ದಿನಾಂಕ', description: data.application_date },
          { title: 'ಹಾಲಿ ಸ್ಥಿತಿ', description: data.status },
          { title: 'ಷರಾ', description: data.remarks },
        ]
      }
    )
  }

  renderContent = () => {
    const { listError, data } = this.props;
    const { panchayat_name } = this.state;
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
              <CoursePriceTag price={panchayat_name} showCloseButton onClick={() => this.onClearFilter()} />
            </React.Fragment> : null
          }
        </StyledBadge>
        <FlatList
          keyExtractor={() => randomString(6, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')}
          data={data}
          ListEmptyComponent={() => <EmptyListComponent onButtonClick={() => this.onTableFetchRequest(1)} />}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => this.goToDetailView(item)}>
              <ListCardComponent
                {...this.formatData(item)}
              />
            </TouchableOpacity>
          )}
          removeClippedSubview
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
    data: state.beneficiary.listData,
    fetching: state.beneficiary.fetching,
    lastCalledPage: state.beneficiary.lastCalledPage,
    currentPage: state.beneficiary.pageNo,
    listError: state.beneficiary.listError,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getListData: (accessToken, pageNo, panchayatID) =>
      dispatch(BeneficiaryActions.beneficiaryOnListRequest(accessToken, pageNo, panchayatID))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BeneficiaryList)