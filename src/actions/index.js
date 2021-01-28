import * as types from './types'

/* User actions */
export const setUser = user => ({
    type: types.SET_USER,
    payload: {
        currentUser: user
    }
})

export const clearUser = () => ({
    type: types.CLEAR_USER
})

/* Channel actions */
export const setCurrentChannel = channel => ({
    type: types.SET_CURRENT_CHANNEL,
    payload: {
        currentChannel: channel
    }
})