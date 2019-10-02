import { call, put } from 'redux-saga/effects'
import { BASE_URL, API_VERSION, APP_TOKEN } from '../Services/constants';
import AsyncStorage from '@react-native-community/async-storage';
import { NavigationActions } from 'react-navigation';
import { ToastActionsCreators } from 'react-native-redux-toast';
import RootActions from '../Redux/RootRedux';
import LoginActions from '../Redux/LoginRedux';
import request from '../Services/request'

// import { ModuleSelectors } from '../Redux/ModuleRedux'
const moduleURL = 'users';

export function* getUserDetails({ accessToken, pageNo }) {
  try {
    const options = {
      method: 'GET',
    };
    const { status, body } = yield call(request, `${BASE_URL}${API_VERSION}${moduleURL}/me?access_token=${accessToken}`, options);
    switch (status) {
      case undefined: {
        yield put(RootActions.getUserDetailsFail(503));
        yield put(ToastActionsCreators.displayWarning('Check your internet Connection'))
        break;
      }
      case 401: {
        yield put(NavigationActions.navigate({ routeName: 'Login' }))
        yield put(RootActions.getUserDetailsFail(status));
        yield put(ToastActionsCreators.displayWarning('Invalid Access'));
        yield put(LoginActions.logoutRequest(accessToken));
        // TO DO ADD LOGOUT
        break;
      }
      case 200: {
        yield put(RootActions.getUserDetailsSuccess(body))
        if (!(body && body.length)) {
          // yield put(ToastActionsCreators.displayInfo('End of List'));
        }
        break;
      }
      default: {
        yield put(RootActions.getUserDetailsFail(status || 503 ));
        if(body && body.message && typeof body.message === 'string') {
          yield put(ToastActionsCreators.displayInfo(message));
        } else {
          yield put(ToastActionsCreators.displayInfo('oops!!'));
        }
      }
    }

  } catch (error) {
    console.log(error);
    yield put(RootActions.getUserDetailsFail(503));
    yield put(ToastActionsCreators.displayInfo('oops!!'));
  }
}



export function* editUserDetails({ accessToken, user_id, data }) {
  try {
    const headers = new Headers({
      'Content-Type': 'multipart/form-data',
      "cache-control": "no-cache",
    });
    data.append("app_token", APP_TOKEN);
    const options = {
      method: 'PUT',
      headers,
      processData: false,
      contentType: false,
      credentials: 'same-origin',
      body: data,
    };
    const { body, status } = yield call(request, `${BASE_URL}${API_VERSION}users/${user_id}?access_token=${accessToken}`, options);
    const { user, message, errors } = body;
    if ((status >= 200 && status < 300)) {
      if (user && user.access_token) {
        AsyncStorage.setItem('accessToken', user.access_token);
        yield put(RootActions.getUserDetailsSuccess(body));
        yield put(ToastActionsCreators.displayInfo('ವಿವರಗಳನ್ನು ಯಶಸ್ವಿಯಾಗಿ ನವೀಕರಿಸಲಾಗಿದೆ'))
        yield put(NavigationActions.navigate({ routeName: 'Home' }))
      } else {
        yield put(RootActions.updateUserDetailsFail(errors));
      }
    } else {
      yield put(RootActions.updateUserDetailsFail({}))
      yield put(ToastActionsCreators.displayWarning(message))
    }
  } catch (e) {
    yield put(RootActions.updateUserDetailsFail({}))
    yield put(ToastActionsCreators.displayInfo('ವಿನಂತಿಯನ್ನು ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಲು ಸಾಧ್ಯವಿಲ್ಲ'))
  }
}
