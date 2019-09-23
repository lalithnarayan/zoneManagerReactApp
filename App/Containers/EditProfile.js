import React from 'react';
import { Container } from 'native-base';
import { AsyncStorage } from 'react-native'
import { connect } from 'react-redux';
import styled from 'styled-components/native';
import { SafeAreaViewWrapper, CustomStatusBar } from '../Components/ui';
import { NavigationEvents } from 'react-navigation';
import { EditProfileForm } from '../Components/forms';
import { CustomActivityIndicator } from '../Components/ui';
import RootActions from '../Redux/RootRedux'


export const PageContentWrapper = styled.View`
  flex: 1;
  padding: 16px;
  background-color: #f5f5f2;
`
export const headerStyle = styled.View`
  backgroundColor: '#f5f5f2',
  borderBottomColor: 'transparent'
`

class EditProfile extends React.Component {
  static navigationOptions = {
    title: 'ಪ್ರೊಫೈಲ್ ಎಡಿಟ್',
    headerStyle
  }

  onFormSubmit(values) {
    const { userObj } = this.props
    const validKeys = ['phone', 'place_id', 'position_id', 'email', 'gender'];
    AsyncStorage.getItem('accessToken').then((userToken) => {
      const { id } = userObj.citizen;
      let data = new FormData();
      for (let property in values) {
        if (property === 'first_name') {
          const firstName = values[property];
          const lastName = values['last_name'];
          data.append('user[name]', `${firstName} ${lastName}`);
        }
        if (property === 'dob') {
          const date = ("0" + values[property].getDate()).slice(-2);
          const month = ("0" + (values[property].getMonth() + 1)).slice(-2);
          const year = values[property].getFullYear();
          data.append(`user[${property}]`, `${year}-${month}-${date}`);
        } else if (validKeys.includes(property)) {
          data.append(`user[${property}]`, values[property]);
        }
      }
      this.props.editProfileDetails(userToken, id, data);
    });

  }

  formatUserObj(data) {
    if (data) {
      const namesBreakup = data.name.split(" ");
      const dateBreakup = data.dob ? data.dob.split('-') : [];
      const first_name = namesBreakup[0];
      const last_name = data.name.replace(namesBreakup[0], '');
      const dob = data.dob ? new Date(dateBreakup[0], parseInt(dateBreakup[1], 10) - 1, dateBreakup[2]) : null;
      return {
        ...data,
        first_name,
        last_name,
        dob,
      }
    }
    return {};
  }

  getUserDetails() {
    const { userObj } = this.props;
    if (!(userObj && userObj.citizen)) {
      AsyncStorage.getItem('accessToken').then((userToken) => {
        if (userToken) {
          this.props.getUserDetails(userToken);
        }
      });
    }

  }
  render() {
    const { userObj, loading } = this.props;
    return (
      <SafeAreaViewWrapper extraStyles={{ backgroundColor: '#f5f5f2' }}>
        <NavigationEvents
          onDidFocus={() => this.getUserDetails()}
        />
        <Container>
          <CustomStatusBar />
          <PageContentWrapper>
            {
              userObj && <EditProfileForm
                loading={loading}
                onSubmit={values => this.onFormSubmit(values)}
                initialValues={this.formatUserObj(userObj.citizen)}
                placeName={userObj.citizen.place_name}
              />
            }
          </PageContentWrapper>
          {
            loading ? <CustomActivityIndicator /> : null
          }
        </Container>
      </SafeAreaViewWrapper>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    userObj: state.root.userDetails,
    loading: state.root.fetching,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    editProfileDetails: (accessToken, id, data) => dispatch(RootActions.updateUserDetails(accessToken, id, data)),
    getUserDetails: (accessToken) => dispatch(RootActions.getUserDetails(accessToken)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile)
