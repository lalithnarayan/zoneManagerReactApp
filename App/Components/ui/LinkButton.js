import React from 'react'
import PropTypes from 'prop-types'
import { Button } from 'native-base'
import styled from 'styled-components/native'

const Wrapper = styled.TouchableOpacity`
  height: 50;
  justify-content: center;
  align-items: center;
  margin: 25px 0px 10px;
`

const ButtonText = styled.Text.attrs({
  numberOfLines: 1
})`
  
  font-size: 15;
  color: #F97D09;
  text-decoration: underline;
`

export default function LinkButton({ text, onPress, primary }) {
  return (
    <Wrapper primary={primary} onPress={() => onPress()}>
      <ButtonText>{text}</ButtonText>
    </Wrapper>
  )
}

LinkButton.propTypes = {
  text: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired
}
