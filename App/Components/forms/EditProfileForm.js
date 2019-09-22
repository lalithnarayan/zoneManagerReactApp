import React from 'react'
import PropTypes from 'prop-types'
import { Formik } from 'formik'
import * as yup from 'yup'
import { FormField, SelectField, DatePicker, PlacePicker, PositionPicker } from '../ui'
import FormContainer from './FormContainer'


const phoneRegExp = /^[6-9]\d{9}$/;

const validationSchema = yup.object().shape({
  first_name: yup.string().required('ಮೊದಲ ಹೆಸರು ಅಗತ್ಯವಿದೆ'),
  last_name: yup.string().required('ಕೊನೆಯ ಹೆಸರು ಅಗತ್ಯವಿದೆ'),
  dob: yup
    .date()
    .max(new Date(), `ಹುಟ್ಟಿದ ದಿನಾಂಕ ಅಮಾನ್ಯವಾಗಿದೆ`),
  gender: yup
    .string()
    .required('ಲಿಂಗ  ಅಗತ್ಯವಿದೆ'),
  position_id: yup
    .string()
    .required('ಉದ್ಯೋಗ/ಹುದ್ದೆ ಅಗತ್ಯವಿದೆ'),
  place_id: yup
    .string()
    .required('ಸ್ಥಳ ಅಗತ್ಯವಿದೆ'),
  phone: yup
    .string().matches(phoneRegExp, 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ಅಮಾನ್ಯವಾಗಿದೆ')
    .required('ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ಅಗತ್ಯವಿದೆ'),
})


export default function EditProfileForm({ loading, onSubmit, positions, initialValues, placeName }) {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={values => onSubmit(values)}
      render={props => {
        return (
          <FormContainer
            loading={loading}
            submitButtonText='ನವೀಕರಿಸಿ'
            onSubmitButtonPress={() => props.handleSubmit()}
          >
            <FormField
              label="ಮೊದಲ ಹೆಸರು"
              value={props.values.first_name}
              onChangeText={text => props.setFieldValue('first_name', text)}
              error={props.errors.first_name}
            />
  
            <FormField
              label="ಕೊನೆಯ ಹೆಸರು"
              value={props.values.last_name}
              onChangeText={text => props.setFieldValue('last_name', text)}
              error={props.errors.last_name}
            />
  
            <FormField
              label="ಮೊಬೈಲ್ ಸಂಖ್ಯೆ"
              keyboardType="phone-pad"
              value={props.values.phone}
              onChangeText={text => props.setFieldValue('phone', text)}
              error={props.errors.phone}
            />
            <FormField
              label="ಇಮೇಲ್"
              keyboardType="email-address"
              value={props.values.email}
              onChangeText={text => props.setFieldValue('email', text)}
              error={props.errors.email}
            />
  
            <PlacePicker
              label="ಸ್ಥಳವನ್ನು ಆಯ್ಕೆ ಮಾಡಿ"
              value={props.values.place_id}
              onChange={({ id }) => props.setFieldValue('place_id', id)}
              error={props.errors.place_id}
              name={placeName}
            />
  
            <SelectField
              label="ಲಿಂಗ"
              value={props.values.gender}
              onChange={value => props.setFieldValue('gender', value)}
              error={props.errors.gender}
              placeholder={'ಲಿಂಗವನ್ನು ಆಯ್ಕೆ ಮಾಡಿ'}
              options={[{ name: 'ಗಂಡು', value: 'Male' }, { name: 'ಹೆಣ್ಣು ', value: 'Female' }, { name: 'ಇತರೆ', value: 'Others' }]}
            />
  
            <PositionPicker
              label="ಉದ್ಯೋಗ/ಹುದ್ದೆ ಆಯ್ಕೆ ಮಾಡಿ"
              value={props.values.position_id}
              onChange={value => props.setFieldValue('position_id', value)}
              error={props.errors.position_id}
              placeholder={'ಉದ್ಯೋಗ/ಹುದ್ದೆ ಆಯ್ಕೆ ಮಾಡಿ'}
            />
  
            <DatePicker
              label="ಹುಟ್ಟಿದ ದಿನಾಂಕ"
              defaultDate={props.values.dob}
              onChange={value => props.setFieldValue('dob', value)}
              value={props.values.dob}
              error={props.errors.dob}
              placeholder={'ಹುಟ್ಟಿದ ದಿನಾಂಕ ಆಯ್ಕೆ ಮಾಡಿ'}
            />
          </FormContainer>
        )
      }}
    />
  )
}

EditProfileForm.propTypes = {
  loading: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired
}
