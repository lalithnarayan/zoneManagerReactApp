import React, { Component } from 'react'
import { connect } from 'react-redux'
import { TouchableOpacity, FlatList } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import styled from 'styled-components/native'
import { Container, Content, View } from 'native-base'
import { format } from 'date-fns';
import { CustomActivityIndicator, RegularButton } from '../Components/ui';
import FooterComponent from '../Components/ListFooter';
import ErrorPage from '../Components/NetworkErrorScreen';
import AppointmentActions from '../Redux/AppointmentRedux';
import { NavigationEvents } from 'react-navigation';
import ListCardComponent from '../Components/ListCardComponent';
import EmptyListComponent from '../Components/EmptyList';

const StartButtonWrapper = styled(View)`
  justify-content: flex-start;
  align-items: stretch;
  margin: 0px 16px;
`
function randomString(length, chars) {
	var result = '';
	for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
	return result;
}
class AppointmentListScreen extends Component {
	static navigationOptions = {
		title: 'ಸಮಯಾವಕಾಶ ಕೋರಿಕೆ',
	}
	onTableFetchRequest = (pageNo) => {
		AsyncStorage.getItem('accessToken').then((accessToken) => {
			this.props.getListData(accessToken, pageNo);
		});
	}

	componentDidMount() {
		this.goToPage('first');
	}

	goToPage = (option) => {
		const { currentPage } = this.props;
		if (option === 'next') {
			this.onTableFetchRequest(currentPage + 1);
		} else if (option === 'prev') {
			this.onTableFetchRequest(currentPage - 1 >= 0 ? currentPage - 1 : 1);
		} else if (option === 'first') {
			this.onTableFetchRequest(1);
		} else if (option === 'refresh') {
			this.onTableFetchRequest(currentPage);
		}
	}

	goToDetailView(selectedData) {
		const { navigate } = this.props.navigation;
		navigate("AppointmentDetailScreen", { selectedData });
	}
	formatData(data) {
		return (
			{
				title: data.title,
				image: data.image,
				subTitle: '',
				createdDate: data.created_at ? format(new Date(data.created_at), 'DD-MM-YYYY') : 'NA',
				lastUpdatedAt: data.updated_at ? format(new Date(data.updated_at), 'DD-MM-YYYY') : 'NA',
				metaData: [
					{ title:'ಸಂಘ ಸಂಸ್ಥೆ/ವ್ಯಕ್ತಿಯ ಹೆಸರು', description: data.organisation},
					{ title: 'ಕಾರ್ಯಕ್ರಮ ನಡೆಯುವ ಸ್ಥಳ', description: data.venue },
					{ title: 'ಕೋರಿಕೆಯ ದಿನಾಂಕ', description: data.req_date },
					{ title: 'ಕೋರಿಕೆಯ ಸಮಯ', description: format(new Date(data.req_time), 'hh:mm A') },
					{ title: 'ಪರ್ಯಾಯ ದಿನಾಂಕ', description: data.opt_date },
					{ title: 'ಪರ್ಯಾಯ ಸಮಯ', description: data.opt_time && format(new Date(data.opt_time), 'hh:mm A') },

				]
			}
		)
	}

	renderContent = () => {
		const { listError, data, fetching } = this.props;
		if (listError) {
			return <ErrorPage status={listError} onButtonClick={() => this.onTableFetchRequest(1)} />
		}
		if (data && data.length) {
			return (
				<Content>
					<FlatList
						data={data}
						refreshing={fetching}
						showsHorizontalScrollIndicator={false}
						removeClippedSubview
						keyExtractor={() => randomString(6, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')}
						onEndReached={this.getMoreItems}

						renderItem={({ item, separators }) => (
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
		return <EmptyListComponent onButtonClick={() => this.onTableFetchRequest(1)} />
	}

	render() {
		const { fetching, data, currentPage, navigation } = this.props;
		return (
			<Container>
				<NavigationEvents
					onDidFocus={() => this.goToPage('first')}
				/>
				<StartButtonWrapper>
					<RegularButton
						text="ಸಮಯಾವಕಾಶ ವಿನಂತಿಸಿ"
						onPress={() => navigation.navigate("CreateAppointmentScreen")}
						primary
					/>
				</StartButtonWrapper>

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
					currentPage={currentPage}
				/>
			</Container>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		data: state.appointment.listData,
		fetching: state.appointment.fetching,
		currentPage: state.appointment.lastCalledPage,
		listError: state.appointment.listError,
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		getListData: (accessToken, pageNo) =>
			dispatch(AppointmentActions.appointmentOnListRequest(accessToken, pageNo))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(AppointmentListScreen)
