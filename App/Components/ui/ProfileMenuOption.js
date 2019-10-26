import React from 'react'
import PropTypes from 'prop-types'
import { Icon } from 'native-base'
import styled from 'styled-components/native'
import Separator from './Separator'

const Wrapper = styled.TouchableOpacity`
  height: 60;
  flex-direction: row;
  padding: 0px 16px;
`

const IconWrapper = styled.View`
  width: 30;
  height: 30;
  justify-content: center;
  align-items: center;
  align-self: center;
`

const Right = styled.View`
  flex: 1;
  margin: 0px 8px;
`

const LabelWrapper = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
`

const Label = styled.Text.attrs({
  numberOfLines: 1
})`
  flex: 1;
 
  font-size: 15;
`

export default function ProfileMenuOption({
  iconName,
  iconColor,
  text,
  showDivider,
  onPress
}) {
  return (
    <Wrapper onPress={() => onPress()}>
      <IconWrapper>
        <Icon name={iconName} style={{color: iconColor,  fontSize: 20 }} />
      </IconWrapper>
      <Right>
        <LabelWrapper>
          <Label>{text}</Label>
          <Icon 
            name="ios-arrow-forward" 
            style={{color: '#8a8a8f',  fontSize: 20 }} 
          />
        </LabelWrapper>
        {showDivider && <Separator />}
      </Right>
    </Wrapper>
  )
}

ProfileMenuOption.propTypes = {
  iconName: PropTypes.string.isRequired,
  iconColor: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  showDivider: PropTypes.bool,
  onPress: PropTypes.func.isRequired
}
ProfileMenuOption.defaultProps = {
  showDivider: false
}
