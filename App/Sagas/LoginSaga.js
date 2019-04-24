import { put, call } from 'redux-saga/effects'
import LoginActions from '../Redux/LoginRedux'
import request from '../Services/request'
import AsyncStorage from '@react-native-community/async-storage';
import { ToastActionsCreators } from 'react-native-redux-toast';
import { NavigationActions } from 'react-navigation'
import { debug } from 'util';
import { BASE_URL, API_VERSION, APP_TOKEN } from '../Services/constants';


export function* login({ phone, password }) {
  try {
    const headers = new Headers({
      'Content-Type': 'multipart/form-data',
      "cache-control": "no-cache",
    });
    var form = new FormData();
    form.append("phone", phone);
    form.append("password", password);
    form.append("app_token", APP_TOKEN);
    const options = {
      method: 'POST',
      body: form,
      headers,
      processData: false,
      contentType: false,
      credentials: 'same-origin'

    };
    const token = yield call(request, `${BASE_URL}${API_VERSION}users/sign_in`, options);
    yield put(LoginActions.loginSuccess(token))
    yield put(NavigationActions.navigate({ routeName: 'Home' }))

  } catch (e) {
    console.log(e);
    yield put(ToastActionsCreators.displayWarning('Invalid User Phone / password!'))
    yield put(LoginActions.loginFailure('WRONG'))
  }
}

export function* getOTP({ phone }) {
  try {
    const headers = new Headers({
      // "Content-Type": "application/x-www-form-urlencoded",
      'Content-Type': 'multipart/form-data',
      "cache-control": "no-cache",
    });
    var form = new FormData();
    form.append("phone", phone);
    form.append("app_token", "4ec581692ba08f69d91254fe91314da083591675fa7173c87a88890b621aa9f1");
    const options = {
      method: 'POST',
      body: form,
      headers,
      processData: false,
      contentType: false,
      credentials: 'same-origin'
    };
    const response = yield call(request, `${BASE_URL}${API_VERSION}users/otp`, options);
    yield put(ToastActionsCreators.displayInfo(response.message))
    yield put(LoginActions.otpSuccess(response));
    

  } catch (e) {
    const response = { message: "Oops Please try again" };
    yield put(ToastActionsCreators.displayInfo(response.message))
    yield put(LoginActions.otpFailure(response))
  }
}

export function* verifyOTP({ phone, otp }) {
  try {
    const headers = new Headers({
      // "Content-Type": "application/x-www-form-urlencoded",
      'Content-Type': 'multipart/form-data',
      "cache-control": "no-cache",
    });
    var form = new FormData();
    form.append("phone", phone);
    form.append("otp", otp);
    form.append("app_token", "4ec581692ba08f69d91254fe91314da083591675fa7173c87a88890b621aa9f1");
    const options = {
      method: 'POST',
      body: form,
      headers,
      processData: false,
      contentType: false,
      credentials: 'same-origin'
    };
    const response = yield call(request, `${BASE_URL}${API_VERSION}users/otp_verify`, options);
    yield put(LoginActions.verifyOtpSuccess(response))
    const { user } = response;
    if(user) {
      yield put(NavigationActions.navigate({ routeName: 'Home'}, { user } ))
    }
  } catch (e) {
    const response = { message: "Oops Please try" };
    yield put(LoginActions.verifyOtpFailure(response))
  }
}


export function* singupRequest({ data }) {
  try {
    const headers = new Headers({
      'Content-Type': 'multipart/form-data',
      "cache-control": "no-cache",
    });
    data.append("app_token", APP_TOKEN);
    const options = {
      method: 'POST',
      headers,
      processData: false,
      contentType: false,
      credentials: 'same-origin',
      body: data,
    };
    const response = yield call(request, `${BASE_URL}${API_VERSION}users`, options);
    yield put(LoginActions.signupSuccess(response));
  } catch (e) {
    yield put(LoginActions.signupFailure({}))
    yield put(ToastActionsCreators.displayInfo('Please Make sure you have filled all the fields'))
  }
}

export function* onLogout({ accessToken }) {
  try {
    const headers = new Headers({
      "cache-control": "no-cache",
    });
    const options = {
      method: 'DELETE',
      headers,
    };
    yield call(request, `${BASE_URL}${API_VERSION}users/sign_out?access_token=${accessToken}`, options);

  } catch (e) {
    // yield put(LoginActions.logoutRequest(accessToken))
    yield put(ToastActionsCreators.displayInfo('Unable to logout Currently'))
  }
}

