import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components/native'
import { ImageProgressComponent } from '../ui'
import { Image } from 'react-native'
import { Images } from '../../Themes/'


const Wrapper = styled.TouchableOpacity`
  width: 200;
  margin-left: 16;
`

const CourseTitle = styled.Text.attrs({
  numberOfLines: 2
})`
  font-weight: bold;
  margin-top: 2;
`

const PricesWrapper = styled.View`
  flex-direction: row;
`

const SellingPrice = styled.Text`
   
  font-size: 15;
  margin-top: 4;
`


export default function FeaturedCourseListItem({
  name,
  venue,
  image,
  onPress
}) {
  if (image) {
    return (
      <Wrapper onPress={() => onPress()}>
        {
          image ?
            <ImageProgressComponent
              photoURL={image}
              resizeMode="cover"
              style={{ width: 200, height: 150 }}
              imageStyle={{ borderRadius: 8 }}
            /> :
            <Image source={Images.sunil}
              style={{ width: 200, height: 150 }}
              resizeMode="cover"
            />
        }
        <CourseTitle>{name}</CourseTitle>
        <PricesWrapper>
          <SellingPrice>{venue}</SellingPrice>
        </PricesWrapper>
      </Wrapper>
    )
  }
  return null;
}

FeaturedCourseListItem.propTypes = {
  name: PropTypes.string.isRequired,
  venue: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired
}
