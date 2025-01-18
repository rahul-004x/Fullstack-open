import { configureStore } from "@reduxjs/toolkit";
import notificationReducer from './reducers/notificationReducer'
import blogReducer from './reducers/blogReducer'
import userReducer from './reducers/blogUserReducer.js'


const store = configureStore({
  reducer: {
    notification: notificationReducer,
    blog: blogReducer,
    user: userReducer
  }
})

export default store