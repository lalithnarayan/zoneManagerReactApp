import React, { Component } from 'react'
import { Platform } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';
import PropTypes from 'prop-types'
import { Item, Picker, Text } from 'native-base'
import styled from 'styled-components/native'
import { connect } from 'react-redux';
import FeedbackActions from '../../Redux/FeedbackRedux';

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

const StyledSelectBox = styled(Picker)``

const Error = styled.Text`
 
  font-size: 15;
  color: #f4224a;
  margin: 4px 8px;
`
function renderPickerOptions(data, feature) {
  let PickerOptions = data.map(( status, index) => <Picker.Item key={`selectbox_${feature}_${index}`} label={status} value={status} />);
  return PickerOptions;
}

class StatusPicker extends Component {

  componentDidMount() {
    const { fetching } = this.props;
    AsyncStorage.getItem('accessToken').then((accessToken) => {
      if (!fetching) {
        this.props.getDepartmentsStatus(accessToken);
      }
    });
  }

  render() {
    const {
      label,
      value,
      error,
      disabled,
      onChange,
      placeholder,
      statuses,
    } = this.props;
    if (statuses && statuses.length) {
      return (
        <Wrapper>
          {label ? <Label>{label}</Label> : null}
          <FormFieldWrapper>
            <StyledSelectBox
              disabled={disabled}
              placeholder={placeholder}
              placeholderTextColor="#a5a5a5"
              selectedValue={value}
              onValueChange={text => onChange(text)}
            >
              <Picker.Item label={'ಆಯ್ಕೆ ಮಾಡಿ'} value={null} />
              {renderPickerOptions(statuses, 'status')}
            </StyledSelectBox>
          </FormFieldWrapper>

          {!!error && <Error>{error}</Error>}
        </Wrapper>
      )
    }
    return null;
  }
}


const mapStateToProps = (state) => {
  return {
    statuses: state.feedback.statuses,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getDepartmentsStatus: (accessToken) =>
      dispatch(FeedbackActions.getDepartmentsList(accessToken)),
  }
}



StatusPicker.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
}
StatusPicker.defaultProps = {
  disabled: false,
  error: '',
}

export default connect(mapStateToProps, mapDispatchToProps)(StatusPicker)
