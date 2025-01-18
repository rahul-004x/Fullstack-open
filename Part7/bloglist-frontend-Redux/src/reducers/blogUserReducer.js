import { createSlice } from "@reduxjs/toolkit";
import blogService from '../services/blogs'

const userSlice = createSlice({
  name:'user',
  initialState: (null),
  reducers: {
    setUser(state, action) {
      return action.payload
    },
    logout(state, action) {
      return null
    }
  }
})

export const { setUser, logout } = userSlice.actions

export const initializeUser = () => {
  return async (dispatch) => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogUser') 
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUser(user))
      blogService.setToken(user.token)
    }
  }
}

export default userSlice.reducer