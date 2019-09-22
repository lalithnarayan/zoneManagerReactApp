import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Item, Input, Text, Textarea } from 'native-base'
import {
  View,
  ListView,
  TouchableOpacity,
} from 'react-native';
import styled from 'styled-components/native'
import ProgressiveInput from './typeAheadComponent';
import { connect } from 'react-redux';
import LoginActions from '../../Redux/LoginRedux'

const Wrapper = styled.View`
  margin: 8px 0px;
`

const FormFieldWrapper = styled(Item).attrs({
  rounded: true
})`
  border-color: #fff;
  background-color: #fff;
  padding: 0px 8px;
  margin: 0px;
`
const Label = styled(Text)`
  font-size: 12;
  color: #278D27;
  margin: 4px;
`;


const Error = styled.Text`
 
  font-size: 15;
  color: #f4224a;
  margin: 4px 8px;
`

const styles = {
  container: {
    flex: 1,
    backgroundColor: 'grey',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  map: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
  },
  progressiveInput: {
    marginTop: 20,
    marginLeft: 10,
    marginRight: 10,
  },
  listViewContainer: {
    flex: 0,
  },
  listView: {
    backgroundColor: 'white',
    margin: 10,
  },
  listItem: {
    padding: 10,
  },
  listItemSeparator: {
    borderWidth: 0.5,
    borderColor: 'lightgrey',
  },
};

const ds = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1.id !== r2.id,
});

class PlacePicker extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dataSource: ds.cloneWithRows([]),
      place_name: props.name || '',
    };
    this.searchLocation = this.searchLocation.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.renderSeparator = this.renderSeparator.bind(this);
    this.onInputCleared = this.onInputCleared.bind(this);
  }

  searchLocation = text => {
    this.props.getPlantsForSearchParam(text);
    this.setState({
      place_id: null,
      place_name: text,
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      dataSource: ds.cloneWithRows(nextProps.placesList),
    });
  }

  onInputCleared() {
    this.setState({
      place_id: null,
      place_name: '',
    });
    this.props.getPlantsForSearchParam('');
  }

  onListItemClicked({ name, id }) {
    this.setState({
      place_id: id,
      place_name: name,
    });
    this.props.getPlantsForSearchParam('');
    this.props.onChange({ name, id });
  }

  renderRow({ name, id }) {
    return (
      <TouchableOpacity
        onPress={() => this.onListItemClicked({ name, id })}
        style={styles.listItem}
      >
        <Text>{name}</Text>
      </TouchableOpacity>
    );
  }

  renderSeparator() {
    return <View style={styles.listItemSeparator} />;
  }

  render() {
    const {
      label,
      value,
      error,
      fetchingPlaces,
      disabled,
      onChange,
      placeholder,
      placesList,
    } = this.props;
    return (
      <Wrapper>
        {label ? <Label>{label}</Label> : null}
        <FormFieldWrapper>
          <ProgressiveInput
            value={this.state.place_name}
            isLoading={fetchingPlaces}
            onChangeText={this.searchLocation}
            onInputCleared={this.onInputCleared}
          />
        </FormFieldWrapper>

        {!!error && <Error>{error}</Error>}
        <View style={styles.listViewContainer}>
            <ListView
              enableEmptySections
              style={styles.listView}
              dataSource={this.state.dataSource}
              renderRow={this.renderRow}
              renderSeparator={this.renderSeparator}
            />
          </View>
      </Wrapper>

    )
  }
}


const mapStateToProps = (state) => {
  return {
    placesList: state.login.placesList,
    fetchingPlaces: state.login.fetchingPlaces,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getPlantsForSearchParam: (searchParam) =>
      dispatch(LoginActions.getPreLoginPlacesList(searchParam)),
  }
}



PlacePicker.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.any,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
}
PlacePicker.defaultProps = {
  disabled: false,
  error: '',
}

export default connect(mapStateToProps, mapDispatchToProps)(PlacePicker)
