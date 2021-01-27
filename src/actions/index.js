import * as types from './types'

export const setUser = user => ({
    type: types.SET_USER,
    payload: {
        currentUser: user
    }
})

export const clearUser = () => ({
    type: types.CLEAR_USER
})