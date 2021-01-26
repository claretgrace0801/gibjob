export const loadState = () => {
  console.log("helo")
  try {
    const serialisedState = sessionStorage.getItem('state')
    if (serialisedState == null) { return undefined }
    return JSON.parse(serialisedState)
  } catch { return undefined }
}

export const saveState = (state) => {
  try {
    const serialisedState = JSON.stringify(state)
    sessionStorage.setItem('state', serialisedState)
  } catch { }
}