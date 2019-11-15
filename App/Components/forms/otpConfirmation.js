import React from 'react'
import PropTypes from 'prop-types'
import { Formik } from 'formik'
import * as yup from 'yup'
import { FormField, SelectField, DatePicker, PlacePicker } from '../ui'
import Modal from "react-native-modal";
import FormContainer from './FormContainer'
import { View, Text } from 'react-native';
const initialValues = {
    otp: '',
}

const phoneRegExp = /\b\d{4}\b/;

const validationSchema = yup.object().shape({
    otp: yup
        .string().matches(phoneRegExp, 'ಒಟಿಪಿ ಸಂಖ್ಯೆ ಅಮಾನ್ಯವಾಗಿದೆ')
        .required('ಒಟಿಪಿ ಸಂಖ್ಯೆ ಅಗತ್ಯವಿದೆ'),
})


export default function OTPValidationForm({ loading, onSubmit }) {
    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={values => onSubmit(values)}
            render={props => (
                <FormContainer
                    loading={loading}
                    submitButtonText='ನೋಂದಾಯಿಸಿ'
                    onSubmitButtonPress={() => props.handleSubmit()}
                >
                    <FormField
                        label="ಒಟಿಪಿ"
                        value={props.values.otp}
                        keyboardType="phone-pad"
                        onChangeText={text => props.setFieldValue('otp', text)}
                        error={props.touched.otp && props.errors.otp}
                    />
                </FormContainer>
            )}
        />

    )
}

OTPValidationForm.propTypes = {
    loading: PropTypes.bool,
    onSubmit: PropTypes.func.isRequired
}
