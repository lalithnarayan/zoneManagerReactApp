import React, { Component } from 'react'
import { View, StatusBar } from 'react-native'
import ReduxNavigation from '../Navigation/ReduxNavigation'

class RootContainer extends Component {
  render () {
    return (
      <View style={{ flex: 1}}>
        <StatusBar backgroundColor="#F97D09" barStyle='light-content' />
        <ReduxNavigation />
      </View>
    )
  }
}


export default RootContainer;
