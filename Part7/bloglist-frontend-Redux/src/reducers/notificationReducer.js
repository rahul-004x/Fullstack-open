import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: 'notification',
  initialState: {
    message: '',
    type: null
  },
  reducers: {
    setNotification(state, action) {
      state.message = action.payload.message;
      state.type = action.payload.type;
    },
    clearNotification(state) {
      state.message = '';
      state.type = null;
    },
  },
});

export const { setNotification, clearNotification } = notificationSlice.actions;

export const setNotificationWithType = (message, type) => {
  return (dispatch) => {
    dispatch(setNotification({ message, type }));
    setTimeout(() => {
      dispatch(clearNotification());
    }, 3000);
  };
};

export default notificationSlice.reducer;
