import React from 'react'
import PropTypes from 'prop-types';
import { Card } from 'native-base'
import styled from 'styled-components/native'
import { ImageProgressComponent } from './ui'
import { CourseLessonListItem } from './list-items';

const Wrapper = styled.View`
  flex-direction: column;
  padding: 16px;
  border-radius: 8;
  border-color: #aeaeae;
  border-width: 1;
  margin: 16px 5px 1px 5px;
`

const CourseTitle = styled.Text.attrs({
  numberOfLines: 2
})`
  font-size: 15;
  margin-top: 8;
`

const PricesWrapper = styled.View`
  flex-direction: row;
  font-size: 10;
  color: #8a8a8f;
  margin-top: 2;
  margin-bottom: 2;
`

const DetailsWrapper = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
`

const DetailsItem = styled.View`
  width: 50%;
  text-align: right;
`;

const SellingPrice = styled.Text`
  font-size: 15;
  margin-top: 4;
`
const SubtitleLabel = styled.Text`
font-size: 10;
font-weight: bold;
letter-spacing: 2;
text-decoration-style: dotted;
color: #8a8a8f;
margin-top: 4;
`;
function randomString(length, chars) {
  var result = '';
  for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}
export default function ListCardComponent({
  title,
  image,
  subTitleLabel,
  subTitle,
  metaData,
  desc,
}) {
  return (
    <Wrapper key={randomString(4, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')}>
      {
        image ?
          <ImageProgressComponent
            photoURL={image}
            resizeMode="cover"
            style={{ flex: 1, width: null, height: 180 }}
          /> : null
      }
      <CourseTitle>{title}</CourseTitle>
      {subTitleLabel ? <SubtitleLabel>{subTitleLabel}</SubtitleLabel> : null}
      <PricesWrapper>
        <SellingPrice>{subTitle}</SellingPrice>
      </PricesWrapper>
      {desc ? <PricesWrapper>{desc}</PricesWrapper> : null}
      <DetailsWrapper>
        {metaData.map((item, index) => (
          <DetailsItem>
            <CourseLessonListItem
              position={index % 2 ? 'left' : 'right'}
              key={randomString(4, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')}
              number={index + 1}
              {...item}
            />
          </DetailsItem>
        ))}
      </DetailsWrapper>

    </Wrapper>
  )
}

ListCardComponent.propTypes = {
  title: PropTypes.string,
}
