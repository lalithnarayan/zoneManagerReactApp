import React from 'react'
import { Icon } from 'native-base';
import styled from 'styled-components/native'
import { Images } from '../Themes'

const onIconPress = (navigation, routeName) => {
  if (routeName === 'Profile') {
    navigation.navigate('EditProfile')
  }
}
const profilePhotoDimensions = 35
const ProfilePhoto = styled.Image.attrs({
  source: Images.sunil,
})`
  width: ${profilePhotoDimensions};
  height: ${profilePhotoDimensions};
  border-radius: ${profilePhotoDimensions / 2};
  border-color: #fff;
  align-self: center;
  margin-left: 10;
`
export default function getNavigationHeaderRight(navigation) {
  const { routeName } = navigation.state.routes[navigation.state.index];
  let iconName;
  let type;
  if (routeName === 'Home') {
    return <ProfilePhoto />
  }

  return (
    <Icon
      name={iconName}
      type={type}
      color="#000"
      size={20}
      style={{ marginRight: 16 }}
      onPress={() => onIconPress(navigation, routeName)}
    />
  )
}
