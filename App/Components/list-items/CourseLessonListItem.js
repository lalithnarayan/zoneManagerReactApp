import React from 'react'
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { Title, SubHeading } from './CourseListItem';
import { Icon } from 'native-base'


const CourseDetailsWrapper = styled.View`
  flex: 1;
  margin-left: 8;
  margin-top: 4;
`

export const LessonType = styled(SubHeading)`
  font-size: 10;
  margin-bottom: 8;
  font-weight: bold;
  letter-spacing: 2;
  text-decoration-style: dotted;
`

const DescriptionWrapper = styled.View`
  flex-direction: row;
  align-items: center;
`;

const IconStyle = {
  fontSize: 16,
  color: '#278d27',
  marginRight: 10,
};

function convertNumberToIndianCurrency(money) {
  const x = money.toString();
  let lastThree = x.substring(x.length - 3);
  const otherNumbers = x.substring(0, x.length - 3);
  if (otherNumbers != '')
    lastThree = ',' + lastThree;
  return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
}
export default function CourseLessonListItem({
  title,
  description,
  hasIcon,
  iconName,
  isCash,
  number,
  style,
}) {
  return description ? (
    <CourseDetailsWrapper>
      <LessonType numberOfLines={1} style={number % 2 ? { color: '#FF6600' } : {}}>{title}</LessonType>
      <DescriptionWrapper>
        {
          hasIcon && iconName ?
            <Icon
              name={iconName}
              type="MaterialCommunityIcons"
              style={IconStyle}
            /> : null
        }
        <Title>{isCash ? `₹ ${convertNumberToIndianCurrency(description)}` : `${description}`}</Title>
      </DescriptionWrapper>
    </CourseDetailsWrapper>

  ) : null
}

CourseLessonListItem.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.any,
  hasIcon: PropTypes.bool,
  iconName: PropTypes.string,
  style: PropTypes.object,
}
