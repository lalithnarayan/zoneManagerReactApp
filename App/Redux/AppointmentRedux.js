import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  appointmentOnListRequest: ['accessToken', 'pageNo'],
  appointmentOnListSuccess: ['listData', 'pageNo'],
  appointmentOnListFailure: ['errorCode'],
  appointmentOnListReset: ['payload'],
  appointmentOnDetailRequest: ['accessToken', 'id'],
  appointmentOnDetailSuccess: ['detailData'],
  appointmentOnDetailFailure: ['errorCode'],

});

export const AppointmentTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  data: null,
  fetching: false,
  listData: null,
  listError: null,
  listData: [],
  lastCalledPage: 1,
  detailError: null,
  detailData: {},
})

/* ------------- Selectors ------------- */

export const AppointmentSelectors = {
  getData: state => state.data
}

/* ------------- Reducers ------------- */

// This is called when the list fetch API is called
export const onListRequest = (state) =>
  state.merge({ 
    fetching: true,
  });

// This is called when the list fetch API is Successfull
export const onListFetchSuccess = (state, action) => {
  const { listData, pageNo } = action;
  return state.merge({ 
    fetching: false, 
    listError: null, 
    listData,
    lastCalledPage: pageNo, 
  })
}

// This is called when the list fetch API Fails
export const OnListFetchFail = (state, { errorCode }) => {
  return state.merge({ 
    fetching: false, 
    listError: errorCode, 
    listData: [] 
  });
}


export const onDetailRequest = (state) =>
  state.merge({ 
    fetching: true,
  });

// This is called when the list fetch API is Successfull
export const onDetailFetchSuccess = (state, action) => {
  const { detailData } = action;
  return state.merge({ 
    fetching: false, 
    detailError: null, 
    detailData,
  })
}

// This is called when the list fetch API Fails
export const OnDetailFetchFail = (state, { errorCode }) => {
  return state.merge({ 
    fetching: false, 
    detailError: errorCode, 
    detailData: {},
  });
}

  export const onListReset = state =>
    state.merge(INITIAL_STATE)

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.APPOINTMENT_ON_LIST_REQUEST]: onListRequest,
  [Types.APPOINTMENT_ON_LIST_SUCCESS]: onListFetchSuccess,
  [Types.APPOINTMENT_ON_LIST_FAILURE]: OnListFetchFail,
  [Types.APPOINTMENT_ON_LIST_RESET]: onListReset,

  [Types.APPOINTMENT_ON_DETAIL_REQUEST]: onDetailRequest,
  [Types.APPOINTMENT_ON_DETAIL_SUCCESS]: onDetailFetchSuccess,
  [Types.APPOINTMENT_ON_DETAIL_FAILURE]: OnDetailFetchFail,
  // [Types.MODULE_ON_LIST_RESET]: onListReset,
});
