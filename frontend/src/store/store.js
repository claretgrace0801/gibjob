import { createStore, applyMiddleware, compose } from 'redux'
import reducer from './reducer'
import thunk from 'redux-thunk'
import { loadState, saveState } from './localStorage'

const persistedState = loadState()
const initialState = { ...persistedState }

const middleware = [thunk]

const store = createStore(reducer, initialState, applyMiddleware(...middleware))

store.subscribe(() => {
  saveState(store.getState())
})

export default store
