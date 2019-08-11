import React from 'react'
import { Platform } from 'react-native'
import styled from 'styled-components'
// import { Ionicons } from '@expo/vector-icons'

const HeaderBackImageWrapper = styled.View`
  width: 35;
  justify-content: center;
  align-items: center;
  margin-left: ${Platform.OS === 'ios' ? 8 : 0};
`

export const safeAreaViewStyle = {
  flex: 1
}

export const onboardingHeaderStyle = {
  backgroundColor: '#f5f5f2',
  borderBottomColor: 'transparent'
}

const headerTitleStyle = {
  fontFamily: 'SFProDisplayBold',
  fontSize: 20,
  color: '#000'
}
export const defaultStackNavigatorHeaderStyle = {
  headerStyle: {
    backgroundColor: '#fff',
    borderBottomColor: 'transparent'
  },
  headerTitleStyle,
  headerTintColor: '#32ce89',
  headerBackTitleStyle: headerTitleStyle,
  headerBackImage: ({ tintColor }) => (
    <HeaderBackImageWrapper>
    </HeaderBackImageWrapper>
  )
}

export const tabHeaderStyle = {
  backgroundColor: '#fff'
}

export const tabBarOptions = {
  activeTintColor: '#32ce89',
  inactiveTintColor: 'grey',
  showLabel: false,
  style: {
    backgroundColor: '#fff',
    borderTopColor: '#dee3ea'
  }
}
