import '../Config'
import DebugConfig from '../Config/DebugConfig'
import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { View } from 'react-native'
import { Toast } from 'react-native-redux-toast';
import RootContainer from './RootContainer'
import createStore from '../Redux'
import NotifService from './NotifService';
import appConfig from './app.json';

const store = createStore()

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      senderId: appConfig.senderID
    };

    this.notif = new NotifService(this.onRegister.bind(this), this.onNotif.bind(this));
  }

  onRegister(token) {
    Alert.alert("Registered !", JSON.stringify(token));
    console.log(token);
    this.setState({ registerToken: token.token, gcmRegistered: true });
  }

  onNotif(notif) {
    console.log(notif);
    Alert.alert(notif.title, notif.message);
  }

  handlePerm(perms) {
    Alert.alert("Permissions", JSON.stringify(perms));
  }
  render() {
    return (
      <Provider store={store}>
        <View style={{ flex: 1 }}>
          <Toast />
          <RootContainer />
        </View>
      </Provider>
    )
  }
}

// allow reactotron overlay for fast design in dev mode
export default DebugConfig.useReactotron ?
  console.tron.overlay(App) :
  App

if (__DEV__) {
  import('../ReactotronConfig').then(() => console.log('Reactotron Configured'))
}
