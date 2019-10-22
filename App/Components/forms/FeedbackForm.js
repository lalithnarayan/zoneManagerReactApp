import React from 'react'
import PropTypes from 'prop-types';
import { Formik } from 'formik'
import * as yup from 'yup'
import { FormField, PlacePicker, StatusPicker, PhotoPicker } from '../ui'
import FormContainer from './FormContainer'

const initialValues = {
  name: '',
  details: '',
  feedback_type: '',
  place_id: '',
  photos: [],
}

const validationSchema = yup.object().shape({
  name: yup.string().required('ಶೀರ್ಷಿಕೆ ಅಗತ್ಯವಿದೆ'),
  details: yup
    .string()
    .required('ವಿವರಗಳು  ಅಗತ್ಯವಿದೆ'),
  place_id: yup
    .number()
    .required('ಸ್ಥಳ ಅಗತ್ಯವಿದೆ'),
  feedback_type: yup
    .string()
    .required('ವಿಧ ಅಗತ್ಯವಿದೆ'),
})

export default function FeedbackCreateForm({ loading, onSubmit }) {

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, { resetForm }) => {
        onSubmit(values)
        resetForm();
        if (this.photoPickerRef) {
          this.photoPickerRef.clearAllPhoto();
        }
      }}
      render={props => {
        return (
          <FormContainer
            loading={loading}
            submitButtonText="ಸಲ್ಲಿಸಿ"
            onSubmitButtonPress={() => props.handleSubmit()}
          >
            <FormField
              label="ಶೀರ್ಷಿಕೆ"
              value={props.values.name}
              onChangeText={text => props.setFieldValue('name', text)}
              error={props.touched.name && props.errors.name}
            />

            <FormField
              label="ವಿವರಗಳು"
              value={props.values.details}
              onChangeText={text => props.setFieldValue('details', text)}
              error={props.touched.details && props.errors.details}
              multiline
              placeholder="ದೂರು/ಸಲಹೆ/ಬೇಡಿಕೆ ಬಗ್ಗೆ ವಿವರವಾಗಿ ವಿವರಿಸಿ"
            />

            <PlacePicker
              label="ಸ್ಥಳವನ್ನು ಆಯ್ಕೆ ಮಾಡಿ"
              value={props.values.place_id}
              onChange={({ id }) => props.setFieldValue('place_id', id)}
              error={props.touched.place_id && props.errors.place_id}
            />

            <StatusPicker
              label="ದೂರು/ಸಲಹೆ/ಬೇಡಿಕೆ ವಿಧ"
              value={props.values.feedback_type}
              onChange={value => props.setFieldValue('feedback_type', value)}
              error={props.touched.feedback_type && props.errors.feedback_type}
              placeholder={'ದೂರು/ಸಲಹೆ/ಬೇಡಿಕೆ ವಿಧ ಆಯ್ಕೆ ಮಾಡಿ'}
            />
            <PhotoPicker
              ref={ref => {
                this.photoPickerRef = ref
              }}
              label="ಫೋಟೋಗಳನ್ನು ಸೇರಿಸಿ"
              onChange={value => props.setFieldValue('photos', value)}
            />
          </FormContainer>
        )
      }}
    />
  )
}

FeedbackCreateForm.propTypes = {
  loading: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
}
