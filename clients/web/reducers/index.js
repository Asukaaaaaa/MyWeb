import { createStore } from "redux"

const appReducer = (state = initialState, action) => {
    return state
}, store = createStore(appReducer, {
    user: {}
})

export default store