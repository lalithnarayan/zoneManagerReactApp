import { takeLatest, all } from 'redux-saga/effects'
import { LoginTypes } from '../Redux/LoginRedux'
import { RootTypes } from '../Redux/RootRedux';
import { BeneficiaryTypes } from '../Redux/BeneficiaryRedux'
import { DevWorkTypes } from '../Redux/DevelopmentWorkRedux';
import { EventTypes } from '../Redux/EventRedux';
import { FeedbackTypes } from '../Redux/FeedbackRedux';
import { AppointmentTypes } from '../Redux/AppointmentRedux';

import {
  login,
  getOTP,
  // verifyOTP, 
  singupRequest,
  onLogout,
  onResetPasswordAction,
  onVerifyUser,
  getPlacesListForSearch,
  getPositionsList,
  getPanchayatsList,
} from './LoginSaga'
import { getUserDetails, editUserDetails } from './RootSagas';
import { getBeneficiaryList, getBeneficiaryDetails } from './BeneficiarySagas'
import { getDevWorksList, getDevWorkDetails } from './DevelopmentWorkSagas'
import { getEventsList, getEventDetails, getLastWeekEventsList } from './EventSagas';
import { getPlacesListForSearchParam, getDepartmentsList, getFeedbackList, getFeedbackDetails, createFeedback } from './FeedbackSagas';
import { getAppointmentsList, getAppointmentDetails, createAppointment } from './appointmentSagas';
// import { getModuleList, getModuleDetails } from './ModuleSagas';
// import { getAllPositions,  } from './VerifiedSignUpSagas'



import BeneficiaryActions from '../Redux/BeneficiaryRedux';
/* ------------- Connect Types To Sagas ------------- */
export default function* root() {
  yield all([


    // some sagas only receive an action
    takeLatest(LoginTypes.LOGIN_REQUEST, login),
    takeLatest(LoginTypes.OTP_REQUEST, getOTP),
    takeLatest(LoginTypes.SIGNUP_REQUEST, singupRequest),
    takeLatest(LoginTypes.LOGOUT_REQUEST, onLogout),
    takeLatest(LoginTypes.RESET_PASSWORD_REQUEST, onResetPasswordAction),
    takeLatest(LoginTypes.VERIFY_USER, onVerifyUser),
    takeLatest(LoginTypes.GET_POSITIONS_LIST, getPositionsList),
    takeLatest(LoginTypes.GET_PRE_LOGIN_PLACES_LIST, getPlacesListForSearch),
    takeLatest(LoginTypes.GET_PANCHAYAT_LIST, getPanchayatsList),

    // Root Redux
    takeLatest(RootTypes.GET_USER_DETAILS, getUserDetails),
    takeLatest(RootTypes.UPDATE_USER_DETAILS, editUserDetails),
    // Beneficiary Module
    takeLatest(BeneficiaryTypes.BENEFICIARY_ON_LIST_REQUEST, getBeneficiaryList),
    takeLatest(BeneficiaryTypes.BENEFICIARY_ON_DETAIL_REQUEST, getBeneficiaryDetails),

    // Development Module
    takeLatest(DevWorkTypes.DEV_WORK_ON_LIST_REQUEST, getDevWorksList),
    takeLatest(DevWorkTypes.DEV_WORK_ON_DETAIL_REQUEST, getDevWorkDetails),

    // Feedback Module
    takeLatest(FeedbackTypes.GET_PLACES_LIST, getPlacesListForSearchParam),
    takeLatest(FeedbackTypes.GET_DEPARTMENTS_LIST, getDepartmentsList),
    takeLatest(FeedbackTypes.FEEDBACK_ON_LIST_REQUEST, getFeedbackList),
    takeLatest(FeedbackTypes.FEEDBACK_ON_DETAIL_REQUEST, getFeedbackDetails),
    takeLatest(FeedbackTypes.CREATE_FEEDBACK, createFeedback),

    // // Appointment Module
    takeLatest(AppointmentTypes.APPOINTMENT_ON_LIST_REQUEST, getAppointmentsList),
    takeLatest(AppointmentTypes.APPOINTMENT_ON_DETAIL_REQUEST, getAppointmentDetails),
    takeLatest(AppointmentTypes.CREATE_APPOINTMENT, createAppointment),
    // Events
    takeLatest(EventTypes.EVENT_ON_LIST_REQUEST, getEventsList),
    takeLatest(EventTypes.EVENT_ON_DETAIL_REQUEST, getEventDetails),
    takeLatest(EventTypes.OLD_EVENT_ON_LIST_REQUEST, getLastWeekEventsList),

  ])
}
