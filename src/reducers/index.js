import { combineReducers } from 'redux'
import * as types from '../actions/types'

const initialState = {
    currentUser: null,
    isLoading: true
}

const userReducer = (state = initialState, action) => {
    switch(action.type){
        case types.SET_USER:
            return {
                currentUser: action.payload.currentUser,
                isLoading: false
            }
        case types.CLEAR_USER:
            return {
                currentUser: null,
                isLoading: false
            }
        default:
            return state
    }
}

const rootReducer = combineReducers({
    user: userReducer
})

export default rootReducer