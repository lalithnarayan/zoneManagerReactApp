import React from 'react'
import PropTypes from 'prop-types'
import { FlatList } from 'react-native'
import styled from 'styled-components/native'
import { ListLoadingComponent, ListEmptyComponent } from '../ui'
import { FeaturedCourseListItem } from '../list-items'

const Wrapper = styled.View`
  height: 250;
  padding: 0px 0px 16px;
`

export default function FeaturedCoursesListView({
  loading,
  items,
  onItemPress
}) {
  return (
    <Wrapper>
      {loading && <ListLoadingComponent text="ಕಾರ್ಯಕ್ರಮಗಳು ಲೋಡ್ ಆಗುತ್ತಿದೆ" />}

      {!loading && items.length === 0 && (
        <ListEmptyComponent text="ಪ್ರದರ್ಶಿಸಲು ಯಾವುದೇ ಕಾರ್ಯಕ್ರಮಗಳಿಲ್ಲ." />
      )}

      {!loading && items.length > 0 && (
        <FlatList
          horizontal
          style={{ flex: 1 }}
          data={items}
          keyExtractor={item => items.indexOf(item).toString()}
          renderItem={({ item }) => (
            <FeaturedCourseListItem
              {...item}
              onPress={() => onItemPress(item)}
            />
          )}
          showsHorizontalScrollIndicator={false}
        />
      )}
    </Wrapper>
  )
}

FeaturedCoursesListView.propTypes = {
  loading: PropTypes.bool.isRequired,
  items: PropTypes.array.isRequired,
  onItemPress: PropTypes.func.isRequired
}
