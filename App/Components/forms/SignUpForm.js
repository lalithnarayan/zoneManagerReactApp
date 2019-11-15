import React from 'react'
import PropTypes from 'prop-types'
import { Formik } from 'formik'
import * as yup from 'yup'
import { FormField, SelectField, DatePicker, PlacePicker } from '../ui'
import FormContainer from './FormContainer'


const initialValues = {
  first_name: '',
  last_name: '',
  gender: '',
  phone: '',
  password: '',
  password_confirmation: '',

}

const phoneRegExp = /^[6-9]\d{9}$/;

const validationSchema = yup.object().shape({
  first_name: yup.string().required('ಮೊದಲ ಹೆಸರು ಅಗತ್ಯವಿದೆ'),
  last_name: yup.string().required('ಕೊನೆಯ ಹೆಸರು ಅಗತ್ಯವಿದೆ'),
  phone: yup
    .string().matches(phoneRegExp, 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ಅಮಾನ್ಯವಾಗಿದೆ')
    .required('ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ಅಗತ್ಯವಿದೆ'),
  gender: yup
    .string()
    .required('ಲಿಂಗ  ಅಗತ್ಯವಿದೆ'),  
  password: yup.
  string()
  .required('ಪಾಸ್ವರ್ಡ್ ಅಗತ್ಯವಿದೆ'),
  password_confirmation: yup
    .string()
    .required('ದೃಢೀಕರಣ ಪಾಸ್ವರ್ಡ್ ಅಗತ್ಯವಿದೆ')
    .oneOf([yup.ref('password'), null], 'ಪಾಸ್ವರ್ಡ್ಗಳು ಒಂದೇ ಆಗಿರಬೇಕು')
})


export default function SignUpForm({ loading, onSubmit, positions }) {
  return (
      <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={values => onSubmit(values)}
      render={props => (
        <FormContainer
          loading={loading}
          submitButtonText='ಒಟಿಪಿ ಪಡೆಯಿರಿ'
          showLinkButton
          onSubmitButtonPress={() => props.handleSubmit()}
        >
          <FormField
            label="ಮೊದಲ ಹೆಸರು"
            value={props.values.first_name}
            onChangeText={text => props.setFieldValue('first_name', text)}
            error={props.touched.first_name && props.errors.first_name}
          />

          <FormField
            label="ಕೊನೆಯ ಹೆಸರು"
            value={props.values.last_name}
            onChangeText={text => props.setFieldValue('last_name', text)}
            error={props.touched.last_name && props.errors.last_name}
          />
          <SelectField
            label="ಲಿಂಗ"
            value={props.values.gender}
            onChange={value => props.setFieldValue('gender', value)}
            error={props.touched.gender && props.errors.gender}
            placeholder={'ಲಿಂಗವನ್ನು ಆಯ್ಕೆ ಮಾಡಿ'}
            options={[{ name: 'ಗಂಡು', value: 'Male' }, { name: 'ಹೆಣ್ಣು ', value: 'Female' }, { name: 'ಇತರೆ', value: 'Others' }]}
          />
          <FormField
            label="ಮೊಬೈಲ್ ಸಂಖ್ಯೆ"
            keyboardType="phone-pad"
            value={props.values.phone}
            onChangeText={text => props.setFieldValue('phone', text)}
            error={props.touched.phone && props.errors.phone}
          />
          <FormField
            label="ಪಾಸ್ವರ್ಡ್"
            secure
            value={props.values.password}
            onChangeText={text => props.setFieldValue('password', text)}
            error={props.touched.password && props.errors.password}
          />
          <FormField
            label="ಪಾಸ್ವರ್ಡ್ ದೃಢೀಕರಣ"
            secure
            value={props.values.password_confirmation}
            onChangeText={text => props.setFieldValue('password_confirmation', text)}
            error={props.touched.password_confirmation && props.errors.password_confirmation}
          />
        </FormContainer>
      )}
    />
  )
}

SignUpForm.propTypes = {
  loading: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired
}
