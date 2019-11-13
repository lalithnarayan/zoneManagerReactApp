import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components/native'

export const Title = styled.Text`
  font-size: 16;
  margin-right: 8;
  color: #2200CC;
  text-decoration: underline;
`

export const SubHeading = styled.Text`
  font-size: 15;
  color: #8a8a8f;
  margin-top: 4;
`
const Wrapper = styled.TouchableOpacity`
  flex-direction: row;
  margin-top: 16;
`

const LessonNumber = styled.Text`
  width: 30;
  font-size: 17;
  color: #8a8a8f;
  text-align: center;
`

const CourseDetailsWrapper = styled.View`
  flex: 1;
  margin-left: 8;
`

const LessonType = styled(SubHeading)`
  font-size: 13;
`

export default function CourseLessonListItem({
  number,
  title,
  description,
  type,
  onPress
}) {
  return (
    <Wrapper onPress={() => onPress()}>
      <LessonNumber>{number}</LessonNumber>
      <CourseDetailsWrapper>
        <Title>{title}</Title>
        <SubHeading numberOfLines={1}>{description}</SubHeading>
        <LessonType>{type}</LessonType>
      </CourseDetailsWrapper>
    </Wrapper>
  )
}

CourseLessonListItem.propTypes = {
  number: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['article', 'video']).isRequired,
  onPress: PropTypes.func.isRequired
}
