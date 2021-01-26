import * as types from './types'

export const setUser = user => ({
    type: types.SET_USER,
    payload: {
        currentUser: user
    }
})