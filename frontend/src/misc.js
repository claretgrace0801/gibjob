import validator from 'validator'

export const getApplyStatus = (status) => {
  const messageColors = ["black", "#ffc219", "blue", "green", "red", "red"]
  const message = ["None", "Applied", "Shortlisted", "Accepted", "Rejected", "Full"]
  let messageStyle = {
    color: messageColors[status]
  }
  return (
    <span style={messageStyle}>{message[status]}</span>
  )
}

export const required = (vals) => {
  let result = true
  for (let i = 0; i < vals.length; i++) {
    if (vals[i] == null) {
      return false
    }
    result = result & !!vals[i].toString().trim().length
  }
  return result
}


export const validate = (fns, vals) => {
  let result = true
  for (let i = 0; i < fns.length; i++) {
    result = result & fns[i](vals[i])
  }
  return result
}


export const verifyEmail = (val) => {
  return validator.isEmail(val.toString().trim()) ? true : false
}


export const verifyNumber = (val) => {
  let result = true
  let newVal = val.toString().trim()
  for (let i = 0; i < newVal.length; i++) {
    result = result & (newVal[i] >= '0' && newVal[i] <= '9')
  }
  return result
}


export const displayDate = (dateString) => {
  let date = new Date(dateString)
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}`
}