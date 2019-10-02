import React, { Component } from 'react'
import AsyncStorage from '@react-native-community/async-storage';
import PropTypes from 'prop-types'
import { Item, Picker, Text } from 'native-base'
import styled from 'styled-components/native'
import { connect } from 'react-redux';
import LoginActions from '../../Redux/LoginRedux'
import { CustomActivityIndicator } from '../ui'

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

function renderPickerOptions(data, feature) {
    let PickerOptions = data.map(({ id, name }, index) => <Picker.Item key={`selectbox_${feature}_${index}`} label={name} value={id} />);
    return PickerOptions;
}

class PlacePicker extends Component {

    componentDidMount() {
        this.getPanchayatList();
    }

    getPanchayatList() {
        AsyncStorage.getItem('accessToken').then((accessToken) => {
            this.props.getPanchayatList(accessToken);
        });
    }

    getPanchayatName(panchayatID) {
        const { panchayatList, onChange } = this.props;
        let panchayatName = '';
        panchayatList.map(({ id, name }) => {
            if (id === panchayatID) {
                panchayatName = name;
            }
        });
        onChange(panchayatID, panchayatName);
    }
    render() {
        const {
            label,
            value,
            error,
            disabled,
            onChange,
            placeholder,
            panchayatList,
            fetching_panchayat,
        } = this.props;
        if (panchayatList && panchayatList.length) {
            return (
                <Wrapper>
                    {label ? <Label>{label}</Label> : null}
                    <FormFieldWrapper>
                        <StyledSelectBox
                            disabled={disabled}
                            placeholder={placeholder}
                            placeholderTextColor="#a5a5a5"
                            selectedValue={value}
                            onValueChange={text => this.getPanchayatName(text)}
                        >
                            <Picker.Item key={`selectbox_position_placeholder`} label={'ಆಯ್ಕೆ ಮಾಡಿ'} value={null} />
                            {renderPickerOptions(panchayatList, 'panchayatList')}
                        </StyledSelectBox>
                    </FormFieldWrapper>

                    {!!error && <Error>{error}</Error>}
                </Wrapper>
            )
        }
        return <React.Fragment>
            {
                fetching_panchayat ? <CustomActivityIndicator /> : null
            }
        </React.Fragment>;
    }
}


const mapStateToProps = (state) => {
    return {
        panchayatList: state.login.panchayatList,
        fetching_panchayat: state.login.fetching_panchayat,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getPanchayatList: (accessToken) =>
            dispatch(LoginActions.getPanchayatList(accessToken)),
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
