import React from 'react'
import PropTypes from 'prop-types'
import { Icon } from 'native-base';
import styled from 'styled-components/native'

export const Wrapper = styled.View`
  flex: 1;
  padding: 16px;
  justify-content: center;
  align-items: center;
`

const iconWrapperDims = 80
export const IconWrapper = styled.TouchableOpacity`
  width: ${iconWrapperDims};
  height: ${iconWrapperDims};
  justify-content: center;
  align-items: center;
  border-radius: ${iconWrapperDims / 2};
  background-color: #fff;
`

export const Title = styled.Text.attrs({
  numberOfLines: 1
})`
 
  font-size: 15;
  margin-top: 8;
`

export default function CourseCategoryGridItem({ icon, title, onPress, type }) {
  return (
    <Wrapper>
      <IconWrapper onPress={() => onPress()}>
        <Icon name={icon} type={type || 'FontAwesome'} style={{
          fontSize: 35,
          color: '#3C5A99'
        }} />
      </IconWrapper>
      <Title>{title}</Title>
    </Wrapper>
  )
}

CourseCategoryGridItem.propTypes = {
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired
}
