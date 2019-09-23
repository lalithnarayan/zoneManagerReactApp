import React from 'react'
import PropTypes from 'prop-types'
import { Card } from 'native-base'
// import { Ionicons } from '@expo/vector-icons'
import styled from 'styled-components/native'
import { ImageProgressComponent, CoursePriceTag } from '../ui'

const Wrapper = styled(Card)`
  flex-direction: row;
  height: 150;
  padding: 16px;
  margin-top: 16;
  border-top-color: #f4f6fa;
  border-radius: 8;
`

export const Right = styled.View`
  flex: 1;
  margin-left: 16;
`

export const Top = styled.View`
  flex-direction: row;
`

export const DetailsWrapper = styled.TouchableOpacity`
  flex: 1;
`

export const Title = styled.Text.attrs({
  // numberOfLines: 1
})`
 
  font-size: 14;
  margin-right: 8;
`

export const SubHeading = styled.Text`
  font-size: 10;
  color: #8a8a8f;
  margin-top: 4;
`

const MetaWrapper = styled.View`
  flex-direction: row;
  margin-top: 16;
  border-color: transparent;
  border-top-color: #dee3ea;
  border-width: 1;
`

const CourseMetadataWrapper = styled.View`
  flex: 1;
  margin-top: 8;
`

const CoursePriceWrapper = styled.View`
  flex: 1;
  justify-content: flex-end;
`

export default function CourseListItem({
  photoURL,
  title,
  category,
  price,
  lectures,
  students,
  saved,
  onPress,
  allowSave,
  onSavePress
}) {
  return (
    <Wrapper>
      <ImageProgressComponent
        photoURL={photoURL}
        resizeMode="cover"
        style={{ width: 50, height: 50 }}
        imageStyle={{ borderRadius: 25 }}
      />

      <Right>
        <Top>
          <DetailsWrapper onPress={() => onPress()}>
            <Title>{title}</Title>
            <SubHeading>{category}</SubHeading>
          </DetailsWrapper>

        </Top>

        <MetaWrapper>
          <CourseMetadataWrapper>
            <Title>{students}</Title>
            <SubHeading>students</SubHeading>
          </CourseMetadataWrapper>

          <CourseMetadataWrapper>
            <Title>{lectures}</Title>
            <SubHeading>lectures</SubHeading>
          </CourseMetadataWrapper>

          <CourseMetadataWrapper>
            <CoursePriceWrapper>
              <CoursePriceTag price={price} />
            </CoursePriceWrapper>
          </CourseMetadataWrapper>
        </MetaWrapper>
      </Right>
    </Wrapper>
  )
}

CourseListItem.propTypes = {
  photoURL: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  lectures: PropTypes.string.isRequired,
  students: PropTypes.string.isRequired,
  saved: PropTypes.bool.isRequired,
  allowSave: PropTypes.bool,
  onPress: PropTypes.func.isRequired,
  onSavePress: PropTypes.func
}
CourseListItem.defaultProps = {
  onSavePress: () => null,
  allowSave: true
}
