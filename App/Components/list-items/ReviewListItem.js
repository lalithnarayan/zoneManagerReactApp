import React from 'react'
import PropTypes from 'prop-types'
import { Card } from 'native-base'
import styled from 'styled-components/native'
import { ImageProgressComponent } from '../ui'
import { Top, DetailsWrapper, Title, SubHeading } from './CourseListItem'

const Wrapper = styled(Card)`
  padding: 16px;
  margin-top: 16;
  border-top-color: #f4f6fa;
  border-radius: 8;
`

const ReviewWrapper = styled.View`
  margin-top: 16;
  border-color: transparent;
  border-top-color: #dee3ea;
  border-width: 1;
`

// const RatingStars = styled(Rating)`
//   align-self: flex-start;
//   margin: 16px 0px 8px;
// `

export default function ReviewListItem({
  photoURL,
  title,
  category,
  date,
  review,
  rating
}) {
  return (
    <Wrapper>
      <Top>
        <ImageProgressComponent
          photoURL={photoURL}
          resizeMode="cover"
          style={{ width: 50, height: 50, marginRight: 16 }}
          imageStyle={{ borderRadius: 25 }}
        />
        <DetailsWrapper>
          <Title>{title}</Title>
          <SubHeading>{category}</SubHeading>
        </DetailsWrapper>

        <SubHeading>{date}</SubHeading>
      </Top>
      <ReviewWrapper>
        <SubHeading>{review}</SubHeading>
      </ReviewWrapper>
    </Wrapper>
  )
}

ReviewListItem.propTypes = {
  photoURL: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  review: PropTypes.string.isRequired,
  rating: PropTypes.number.isRequired
}
