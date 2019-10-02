import { put, call } from 'redux-saga/effects';
import LoginActions from '../Redux/LoginRedux';
import AsyncStorage from '@react-native-community/async-storage';
import BeneficiaryActions from '../Redux/BeneficiaryRedux';
import DevelopmentWorkActions from '../Redux/DevelopmentWorkRedux';
import EventActions from '../Redux/EventRedux';
import FeedbackActions from '../Redux/FeedbackRedux';
import RootActions from '../Redux/RootRedux';

import request from '../Services/request'
import { ToastActionsCreators } from 'react-native-redux-toast';
import { NavigationActions } from 'react-navigation'
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
    const { body, status } = yield call(request, `${BASE_URL}${API_VERSION}users/sign_in`, options);
    if (status) {
      const { user, message } = body;
      if (status >= 200 && status < 300) {
        AsyncStorage.setItem('accessToken', user.access_token);
        yield put(LoginActions.loginSuccess(user, message));
        yield put(LoginActions.resetStateOnNavigation());
      } else {
        yield put(LoginActions.loginFailure())
        yield put(ToastActionsCreators.displayWarning(message))
      }
    } else {
      yield put(LoginActions.loginFailure())
      yield put(ToastActionsCreators.displayWarning("Please Check your Internet Connection"))
    }
  } catch (e) {
    yield put(LoginActions.loginFailure('WRONG'))
  }
}

export function* getOTP({ phone, shouldBeNewUser }) {
  try {
    const headers = new Headers({
      'Content-Type': 'multipart/form-data',
      "cache-control": "no-cache",
    });
    var form = new FormData();
    form.append("phone", phone);
    form.append("app_token", APP_TOKEN);
    const options = {
      method: 'POST',
      body: form,
      headers,
      processData: false,
      contentType: false,
      credentials: 'same-origin'
    };

    const verifyNumberOptions = {
      method: 'GET',
    };
    const verifyNumberResponse = yield call(request, `${BASE_URL}${API_VERSION}/users/exists?app_token=${APP_TOKEN}&phone=${phone}`, verifyNumberOptions);
    if (shouldBeNewUser) {
      if (verifyNumberResponse.status === 404) {
        const { body, status } = yield call(request, `${BASE_URL}${API_VERSION}users/otp`, options);
        if (status >= 200 && status < 300) {
          const { message } = body;
          yield put(ToastActionsCreators.displayInfo(message))
          yield put(LoginActions.otpSuccess(body));
        } else {
          yield put(ToastActionsCreators.displayInfo(message))
          yield put(LoginActions.otpFailure(body))
        }
      } else if (verifyNumberResponse.status === 200) {
        yield put(ToastActionsCreators.displayInfo('User already registered with this number Please Login or use forgot password option'));
        yield put(NavigationActions.navigate({ routeName: 'Login' }));
        yield put(LoginActions.resetStateOnNavigation());
        yield put(LoginActions.otpFailure({}))
      } else {
        yield put(LoginActions.otpFailure({}))
      }
    } else {
      if (verifyNumberResponse.status === 404) {
        yield put(ToastActionsCreators.displayInfo('This number is not registered. Please Check the number or use Sign Up Option'));
        yield put(NavigationActions.navigate({ routeName: 'Login' }));
        yield put(LoginActions.resetStateOnNavigation());
        yield put(LoginActions.otpFailure({}))
      } else if (verifyNumberResponse.status === 200) {
        const { body, status } = yield call(request, `${BASE_URL}${API_VERSION}users/otp`, options);
        if (status >= 200 && status < 300) {
          const { message } = body;
          yield put(ToastActionsCreators.displayInfo(message))
          yield put(LoginActions.otpSuccess(body));
        } else {
          yield put(ToastActionsCreators.displayInfo(message))
          yield put(LoginActions.otpFailure(body))
        }
      } else {
        yield put(LoginActions.otpFailure({}))
      }
    }


  } catch (e) {
    console.log(e);
    const response = { message: "Oops Please try again" };
    yield put(ToastActionsCreators.displayInfo(response.message))
    yield put(LoginActions.otpFailure(response))
    yield put(LoginActions.resetStateOnNavigation());
  }
}

// export function* verifyOTP({ phone, otp }) {
//   try {
//     const headers = new Headers({
//       'Content-Type': 'multipart/form-data',
//       "cache-control": "no-cache",
//     });
//     var form = new FormData();
//     form.append("phone", phone);
//     form.append("otp", otp);
//     form.append("app_token", APP_TOKEN);
//     const options = {
//       method: 'POST',
//       body: form,
//       headers,
//       processData: false,
//       contentType: false,
//       credentials: 'same-origin'
//     };
//     const { body, status } = yield call(request, `${BASE_URL}${API_VERSION}users/otp_verify`, options);

//     if (status >= 200 && status < 300) {
//       const { message, user } = body;
//       yield put(ToastActionsCreators.displayInfo(message))
//       yield put(LoginActions.verifyOtpSuccess(response))
//       yield put(NavigationActions.navigate({ routeName: 'Home' }, { user }))
//     } else {
//       yield put(ToastActionsCreators.displayInfo(message))
//       yield put(LoginActions.verifyOtpFailure(body))
//     }
//   } catch (e) {
//     const response = { message: "Oops Please try" };
//     yield put(LoginActions.verifyOtpFailure(response))
//   }
// }


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
    const { body, status } = yield call(request, `${BASE_URL}${API_VERSION}users`, options);
    const { user, message, errors } = body;
    if ((status >= 200 && status < 300)) {
      if (user && user.access_token) {
        AsyncStorage.setItem('accessToken', user.access_token);
        yield put(LoginActions.signupSuccess(user));
        yield put(NavigationActions.navigate({ routeName: 'Home' }))
        yield put(LoginActions.resetStateOnNavigation());
      } else {
        yield put(LoginActions.signupFailure(errors));
      }
    } else {
      yield put(LoginActions.resetPasswordFailure({}))
      yield put(ToastActionsCreators.displayWarning(message))
    }
  } catch (e) {
    yield put(LoginActions.signupFailure({}))
    yield put(ToastActionsCreators.displayInfo('Please Make sure you have filled all the fields'))
  }
}

export function* onLogout({ accessToken }) {
  AsyncStorage.removeItem('accessToken');
  try {
    const headers = new Headers({
      "cache-control": "no-cache",
    });
    const options = {
      method: 'DELETE',
      headers,
    };
    yield call(request, `${BASE_URL}${API_VERSION}users/sign_out?access_token=${accessToken}`, options);
    yield put(BeneficiaryActions.beneficiaryOnListReset());
    yield put(DevelopmentWorkActions.devWorkOnListReset());
    yield put(EventActions.eventOnListReset());
    yield put(FeedbackActions.feedbackOnListReset());
    yield put(RootActions.onReset());
  } catch (e) {
    console.log(e);
    yield put(ToastActionsCreators.displayWarning('Please Refresh the app'));
  }

}

export function* onResetPasswordAction({ data }) {
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
    const { status, body } = yield call(request, `${BASE_URL}${API_VERSION}users/reset_password`, options);
    const { user, message, errors } = body;
    if ((status >= 200 && status < 300)) {
      if (user && user.access_token) {
        yield put(LoginActions.resetPasswordSuccess(user));
        AsyncStorage.setItem('accessToken', user.access_token);
        yield put(NavigationActions.navigate({ routeName: 'Home' }))
        yield put(LoginActions.resetStateOnNavigation());
      } else {
        yield put(LoginActions.resetPasswordFailure(errors))
        yield put(ToastActionsCreators.displayWarning(message))
      }

    } else {
      yield put(LoginActions.resetPasswordFailure({}))
      yield put(ToastActionsCreators.displayWarning(message))
    }

  } catch (e) {
    yield put(NavigationActions.navigate({ routeName: 'NetworkError' }))
    yield put(LoginActions.resetPasswordFailure({}))
    yield put(LoginActions.resetStateOnNavigation());
    yield put(ToastActionsCreators.displayInfo('Please try again'))
  }
}

export function* onVerifyUser({ phone }) {
  try {
    const options = {
      method: 'GET',
    };
    const { status, body } = yield call(request, `${BASE_URL}${API_VERSION}users/exists?app_token=${APP_TOKEN}&phone=${phone}`, options);
    yield put(LoginActions.otpRequest(phone))
    if (!(status >= 200 && status < 300)) {
      yield put(NavigationActions.navigate({ routeName: 'RegisterScreen' }, { phone }))
      yield put(ToastActionsCreators.displayInfo('Oops Looks like you are new, Please Register first'))
    }
  } catch (e) {
    yield put(LoginActions.verifyUserFail())
    yield put(
      NavigationActions.navigate({ routeName: 'NetworkError' })
    )
    yield put(ToastActionsCreators.displayInfo('Oops Looks like you are new, Please Register first'))
  }
}


export function* getPlacesListForSearch({ searchParam }) {
  try {
    const options = {
      method: 'GET',
    };
    const { status, body } = yield call(request, `${BASE_URL}${API_VERSION}commons/places?search=${searchParam}&app_token=${APP_TOKEN}`, options);
    if (status >= 200 && status < 300) {
      yield put(LoginActions.getPreLoginPlacesListSuccess(body))
    } else if (status === 401) {
      yield put(NavigationActions.navigate({ routeName: 'Login' }))
      yield put(ToastActionsCreators.displayWarning('Invalid Session Please Login'))
    } else {
      yield put(LoginActions.getPreLoginPlacesListFail())
    }
  } catch (e) {
    yield put(LoginActions.getPreLoginPlacesListFail())
  }
}

export function* getPositionsList({ searchParam }) {
  try {
    const options = {
      method: 'GET',
    };
    const { status, body } = yield call(request, `${BASE_URL}${API_VERSION}users/positions?app_token=${APP_TOKEN}`, options);
    if (status >= 200 && status < 300) {
      yield put(LoginActions.getPositionsListSuccess(body))
    } else if (status === 401) {
      yield put(NavigationActions.navigate({ routeName: 'Login' }))
      yield put(ToastActionsCreators.displayWarning('Invalid Session Please Login'))
    } else {
      yield put(LoginActions.getPositionsListFail())
    }
  } catch (e) {
    yield put(LoginActions.getPositionsListFail())
  }
}

export function* getPanchayatsList({ accessToken }) {
  try {
    const options = {
      method: 'GET',
    };
    const { status, body } = yield call(request, `${BASE_URL}${API_VERSION}commons/panchayats?access_token=${accessToken}`, options);
    switch (status) {
      case undefined: {
        yield put(LoginActions.getPanchayatListFail(503));
        yield put(ToastActionsCreators.displayWarning('Check your internet Connection'))
        break;
      }
      case 401: {
        yield put(NavigationActions.navigate({ routeName: 'Login' }))
        yield put(LoginActions.getPanchayatListFail(status));
        yield put(ToastActionsCreators.displayWarning('Invalid Access'));
        yield put(LoginActions.logoutRequest(accessToken));
        // TO DO ADD LOGOUT
        break;
      }
      case 200: {
        yield put(LoginActions.getPanchayatListSuccess(body))
        break;
      }
      default: {
        yield put(LoginActions.getPanchayatListFail(status || 503));
        if (body && body.message && typeof body.message === 'string') {
          yield put(ToastActionsCreators.displayInfo(message));
        } else {
          yield put(ToastActionsCreators.displayInfo('oops!!'));
        }
      }
    }

  } catch (error) {
    console.log(error);
    yield put(LoginActions.getPanchayatListFail(503));
    yield put(ToastActionsCreators.displayInfo('oops!!'));
  }
}
