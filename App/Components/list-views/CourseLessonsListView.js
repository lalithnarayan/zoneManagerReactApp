import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components/native'
import { UsefulLinkItem } from '../list-items'

const Wrapper = styled.View`
  border-color: transparent;
  border-top-color: #dee3ea;
  border-width: 1;
`

export default function CourseLessonsListView({ items, onItemPress }) {
  return (
    <Wrapper>
      {items.map((item, index) => (
        <UsefulLinkItem
          key={index}
          number={index + 1}
          {...item}
          onPress={() => onItemPress(item)}
        />
      ))}
    </Wrapper>
  )
}

CourseLessonsListView.propTypes = {
  items: PropTypes.array.isRequired,
  onItemPress: PropTypes.func.isRequired
}
