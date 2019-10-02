import React, { Component } from 'react'
import { Container, Content } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import styled from 'styled-components/native'
import {
  SafeAreaViewWrapper,
  CustomStatusBar,
  ProfileMenuOption
} from '../Components/ui'
import { SectionHeader } from '../Components/headers'
import { CustomActivityIndicator } from '../Components/ui';
import { connect } from 'react-redux'
import LoginActions from '../Redux/LoginRedux'


const ProfileHeroWrapper = styled.View`
  flex-direction: row;
  padding: 16px;
`

const UserDetailsWrapper = styled.View`
  flex: 1;
  margin-left: 10;
  justify-content: center;
`

const UsernameText = styled.Text`
  font-size: 17;
`

const PointsText = styled.Text`
  font-size: 14;
  color: #8a8a8f;
  margin-top: 4;
`

class UserSettings extends Component {

  async deleteToken() {
    try {
      await AsyncStorage.removeItem('accessToken')
    } catch (err) {
      console.log(`The error is: ${err}`)
    }
    this.props.navigation.navigate('Login')
  }
  onLogout = () => {
    const { access_token } = this.props.userObj ? this.props.userObj.user : {};
    const accessToken = access_token;
    this.props.onLogout(accessToken);
    const { navigate } = this.props.navigation;
    this.deleteToken();
  }

  render() {
    const { fetching, navigation, userObj } = this.props;
    const user = userObj && userObj.citizen ? userObj.citizen : {};
    return (
      <SafeAreaViewWrapper>
        <Container>
          <CustomStatusBar />
          <Content>
            <ProfileHeroWrapper>
              <UserDetailsWrapper>
                <UsernameText>{user.name}</UsernameText>
                <PointsText>{user.phone}</PointsText>
                <PointsText>{user.place_name}</PointsText>
              </UserDetailsWrapper>
            </ProfileHeroWrapper>
            <SectionHeader>ಸೆಟ್ಟಿಂಗ್‌ಗಳು</SectionHeader>
            <ProfileMenuOption
              iconName="md-person-add"
              iconColor="#278d27"
              text="ಪ್ರೊಫೈಲ್ ಮಾಹಿತಿಯ ಬದಲಾವಣೆ ಮಾಡಿ"
              onPress={() => {}}
              onPress={() => navigation.navigate('EditProfile')}
            />
            <ProfileMenuOption
              iconName="md-log-out"
              iconColor="#000"
              text="
              ಲಾಗ್ ಔಟ್"
              onPress={() => {}}
              onPress={() => this.onLogout()}
            />
          </Content>
        </Container>
        {
          fetching ? <CustomActivityIndicator /> : null
        }
      </SafeAreaViewWrapper>

    )
  }
}

const mapStateToProps = (state) => {
  return {
    userObj: state.root.userDetails,
    fetching: state.root.fetching,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onLogout: (accessToken) => dispatch(LoginActions.logoutRequest(accessToken)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserSettings)
