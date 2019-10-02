import React, { Component } from 'react'
import {View, Image } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { connect } from 'react-redux'
import LoginActions from '../Redux/LoginRedux'
import RootActions from '../Redux/RootRedux'
import LoadingOverlay from '../Components/LoadingOverlay';
import { Images } from '../Themes/'

const styles = {
  image: {
    flex: 1,
    height: null,
    width: null,
  },
  imageContainer: {
    bottom: 0,
    flex: 1,
    height: '100%',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    width: '100%',
  },
};
class AuthLoadingScreen extends Component {

  componentDidMount() {
    AsyncStorage.getItem('accessToken').then((userToken) => {
      if (userToken) {
        this.props.getUserDetails(userToken);
      }
      this.props.navigation.navigate(userToken ? 'App' : 'Auth');
    });
  }

  render() {
    return (
      <View style={styles.imageContainer}>
      <Image
        resizeMode="cover"
        source={Images.splashBackground}
        style={styles.image}
      />
      <LoadingOverlay
          visible
          color="white"
          indicatorSize="large"
          messageFontSize={24}
          message="Loading..."
        >
        <Image
          resizeMode="cover"
          source={Images.bjpGif}
        />
        </LoadingOverlay>
    </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return {
    saveUserToken: (user) => dispatch(LoginActions.loginSuccess(user)),
    getUserDetails: (accessToken) => dispatch(RootActions.getUserDetails(accessToken)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthLoadingScreen)
