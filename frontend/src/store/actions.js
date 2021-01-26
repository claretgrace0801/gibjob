import * as actionTypes from './actionTypes'
import axios from 'axios'


// AUTH

export const createUser = (user) => async dispatch => {

  let res = await axios.post('/create', user)
  if (res.data.success) {
    dispatch({
      type: actionTypes.CREATE_USER,
      payload: {
        user: res.data.message
      }
    })
  }
  return res
}

export const loginUser = (info) => async dispatch => {

  let res = await axios.put('/login', info)
  if (res.data.success) {
    dispatch({
      type: actionTypes.CREATE_USER,
      payload: {
        user: res.data.message
      }
    })
  }
  return res
}



// RECRUITER

export const editRecruiter = (recruiter) => async dispatch => {

  let res = await axios.put('/r/profile/edit', recruiter)
  if (res.data.success) {
    dispatch({
      type: actionTypes.EDIT_RECRUITER,
      payload: {
        user: res.data.message
      }
    })
  }
  return res
}


export const rateApplicant = (rating, user_id) => async dispatch => {
  let res = await axios.put(`/r/rateapp/${user_id}`, rating)
  return res
}


export const rejectAll = (user_id, job_id) => async dispatch => {
  let res = await axios.put(`/a/rejectall/${user_id}`, { job_id: job_id })
  return res
}

// APPLICANT

export const getApplicants = () => async dispatch => {
  let res = await axios.get('/a/get')
  dispatch({
    type: actionTypes.GET_APPLICANTS,
    payload: {
      applicants: res.data.message
    }
  })
  return res
}


export const getApplicant = (_id) => async dispatch => {
  let res = await axios.get(`/a/get/${_id}`)
  dispatch({
    type: actionTypes.GET_APPLICANT,
    payload: {
      user: res.data.message
    }
  })
  return res
}


export const editApplicant = (applicant) => async dispatch => {

  let res = await axios.put('/a/profile/edit', applicant)
  console.log("Applicant", res)
  if (res.data.success) {
    dispatch({
      type: actionTypes.EDIT_APPLICANT,
      payload: {
        user: applicant
      }
    })
  }
  return res
}


export const applyForJob = (application, job_id) => async dispatch => {

  let res = await axios.put(`/a/apply/${job_id}`, application)
  return res
}


export const rateJob = (rating, job_id) => async dispatch => {
  let res = await axios.put(`/a/ratejob/${job_id}`, rating)
  return res
}


export const editApplication = (app, job_id) => async dispatch => {
  let res = await axios.put(`/a/editapp/${job_id}`, app)
  return res
}



// JOBS

export const getJobs = () => async dispatch => {
  let res = await axios.get("/job")
  dispatch({
    type: actionTypes.GET_JOBS,
    payload: {
      jobs: res.data.message
    }
  })
  return res
}

export const createJob = (job) => async dispatch => {
  let res = await axios.post('/job', job)
  return res
}

export const deleteJob = (job_id) => async dispatch => {
  let res = await axios.delete(`/job/${job_id}`)
  return res
}

export const editJob = (newValues, job_id) => async dispatch => {
  let res = await axios.put(`/job/${job_id}`, newValues)
  return res
}


// email

export const sendEmail = (details) => async dispatch => {
  let res = await axios.post(`/email/send`, details)
  return res
}