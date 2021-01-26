import * as actionTypes from './actionTypes'
import { v1 as uuid } from 'uuid'

const reducer = (state = {}, action) => {
  switch (action.type) {

    case actionTypes.CREATE_USER:
      return {
        ...state,
        user: action.payload.user
      }

    case actionTypes.LOGIN:
    case actionTypes.GET_APPLICANT:
      return {
        ...state,
        user: action.payload.user
      }

    case actionTypes.EDIT_RECRUITER:
    case actionTypes.EDIT_APPLICANT:
      return {
        ...state,
        user: { ...state.user, ...action.payload.user }
      }

    case actionTypes.GET_APPLICANTS:
      return {
        ...state,
        applicants: action.payload.applicants
      }

    case actionTypes.GET_JOBS:
      return {
        ...state,
        jobs: action.payload.jobs
      }

    default:
      return state
  }
}

export default reducer
