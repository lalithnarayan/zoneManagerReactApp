import '../Config';
import DebugConfig from '../Config/DebugConfig';
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { View } from 'react-native';
import { Toast } from 'react-native-redux-toast';
import RootContainer from './RootContainer';
import createStore from '../Redux';
import OneSignal from 'react-native-onesignal'; // Import package from node modules


// create our store
const store = createStore()

/**
 * Provides an entry point into our application.  Both index.ios.js and index.android.js
 * call this component first.
 *
 * We create our Redux store here, put it into a provider and then bring in our
 * RootContainer.
 *
 * We separate like this to play nice with React Native's hot reloading.
 */
class App extends Component {

  constructor(properties) {
    super(properties);
    OneSignal.init("abc8864e-a22d-4635-8969-b08ef7da58c6");

    OneSignal.addEventListener('received', this.onReceived);
    OneSignal.addEventListener('opened', this.onOpened);
    OneSignal.addEventListener('ids', this.onIds);
  }

  componentWillUnmount() {
    OneSignal.removeEventListener('received', this.onReceived);
    OneSignal.removeEventListener('opened', this.onOpened);
    OneSignal.removeEventListener('ids', this.onIds);
  }

  onReceived(notification) {
    console.log("Notification received: ", notification);
  }

  onOpened(openResult) {
    console.log('Message: ', openResult.notification.payload.body);
    console.log('Data: ', openResult.notification.payload.additionalData);
    console.log('isActive: ', openResult.notification.isAppInFocus);
    console.log('openResult: ', openResult);
  }

  onIds(device) {
    console.log('Device info: ', device);
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
export default DebugConfig.useReactotron
  ? console.tron.overlay(App)
  : App

if (__DEV__) {
  import('../ReactotronConfig').then(() => console.log('Reactotron Configured'))
}
