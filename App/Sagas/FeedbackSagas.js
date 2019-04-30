/* ***********************************************************
 * A short word on how to use this automagically generated file.
 * We're often asked in the ignite gitter channel how to connect
 * to a to a third party api, so we thought we'd demonstrate - but
 * you should know you can use sagas for other flow control too.
 *
 * Other points:
 *  - You'll need to add this saga to sagas/index.js
 *  - This template uses the api declared in sagas/index.js, so
 *    you'll need to define a constant in that file.
 *************************************************************/


import { call, put, all } from 'redux-saga/effects'
import FeedbackActions from '../Redux/FeedbackRedux'
import request from '../Services/request'
import { NavigationActions } from 'react-navigation'
import { ToastActionsCreators } from 'react-native-redux-toast';
import { BASE_URL, API_VERSION, APP_TOKEN } from '../Services/constants';

export function* getFeedbackList({ accessToken, pageNo, lastCalledPage }) {
  try {
    if (lastCalledPage !== pageNo) {
      const options = {
        method: 'GET',
      };
      const { status, body } = yield call(request, `${BASE_URL}${API_VERSION}feedbacks?access_token=${accessToken}&page=${pageNo}`, options);
      if (status >= 200 && status < 300) {
        if (!(body && body.length)) {
          yield put(ToastActionsCreators.displayInfo('Nothing New to Show'));
          yield put(FeedbackActions.feedbackSuccess([], lastCalledPage));
        } else {
          yield put(FeedbackActions.feedbackSuccess(body))
        }
      } else if (status === 401) {
        yield put(NavigationActions.navigate({ routeName: 'Login' }))
        yield put(ToastActionsCreators.displayWarning('Invalid Session Please Login'))
      } else {
        yield put(FeedbackActions.feedbackFailure())
      }
    } else {
      yield put(ToastActionsCreators.displayInfo('Nothing New to Show'));
      yield put(FeedbackActions.feedbackSuccess([], lastCalledPage));
    }


  } catch (e) {
    yield put(FeedbackActions.feedbackFailure())
  }
}


export function* getPlacesList({ accessToken, searchParam }) {
  try {
    const options = {
      method: 'GET',
    };
    const { status, body } = yield call(request, `${BASE_URL}${API_VERSION}commons/places?app_token=${APP_TOKEN}&search=${searchParam}`, options);
    if (status >= 200 && status < 300) {
      yield put(FeedbackActions.getPlacesListSuccess(body))
    } else if (status === 401) {
      yield put(NavigationActions.navigate({ routeName: 'Login' }))
      yield put(ToastActionsCreators.displayWarning('Invalid Session Please Login'))
    } else {
      yield put(FeedbackActions.getPlacesListFail())
    }
  } catch (e) {
    yield put(FeedbackActions.getPlacesListFail())
  }
}

export function* getDepartmentsList({ accessToken }) {
  try {
    const options = {
      method: 'GET',
    };
    const { departments, statuses } = yield all({
      departments: call(request, `${BASE_URL}${API_VERSION}commons/departments?access_token=${accessToken}`, options),
      statuses: call(request, `${BASE_URL}${API_VERSION}commons/status_list?access_token=${accessToken}&model=Feedback`, options),
    })

    if (departments.status >= 200 && departments.status < 300) {
      const data = {
        departments: departments.body,
        statuses: statuses.body,
      }
      yield put(FeedbackActions.getDepartmentsListSuccess(data))
    } else if (status === 401) {
      yield put(NavigationActions.navigate({ routeName: 'Login' }))
      yield put(ToastActionsCreators.displayWarning('Invalid Session Please Login'))
    } else {
      yield put(FeedbackActions.getDepartmentsListFail())
    }
  } catch (e) {
    yield put(FeedbackActions.getDepartmentsListFail())
  }
}

export function* createFeedback({ accessToken, data }) {
  try {
    const headers = new Headers({
      'Content-Type': 'multipart/form-data',
      "cache-control": "no-cache",
    });
    // data.append("app_token", APP_TOKEN);
    const options = {
      method: 'POST',
      headers,
      processData: false,
      contentType: false,
      credentials: 'same-origin',
      body: data,
    };
    const { body, status } = yield call(request, `${BASE_URL}${API_VERSION}feedbacks?access_token=${accessToken}`, options);
    if (status) {
      const { data, message, errors } = body;
      if ((status >= 200 && status < 300)) {
        if (body && body.id) {
          yield put(FeedbackActions.createFeedbackSuccess(data));
          yield put(NavigationActions.navigate({ routeName: 'Home' }))
          yield put(ToastActionsCreators.displayInfo('Thanks for sharing your feedback'))
          yield put(FeedbackActions.resetStateOnNavigation());
        } else if (status === 401) {
          yield put(NavigationActions.navigate({ routeName: 'Login' }))
          yield put(ToastActionsCreators.displayWarning('Invalid Session Please Login'))
        } else {
          yield put(FeedbackActions.createFeedbackSuccess(errors))
        }
      } else {
        yield put(FeedbackActions.createFeedbackFail({}))
        yield put(ToastActionsCreators.displayWarning(message))
      }
    } else {
      yield put(FeedbackActions.createFeedbackFail({}))
      yield put(ToastActionsCreators.displayWarning('Network Error'))
    }

  } catch (e) {
    yield put(FeedbackActions.createFeedbackFail({}))
    yield put(ToastActionsCreators.displayInfo('Please Make sure you have filled all the fields'))
  }
}
