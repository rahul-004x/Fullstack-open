import { useReducer, createContext, useContext } from 'react'

export const notificationContext = createContext(null)

const reducer = (state, action) => {
  switch(action.type){
    case 'success':
      return { message: action.payload, error: false }
    case 'error':
      return { message: action.payload, error: true }
    case 'clear':
      return null
    default:
      return state
  }
}

export const NotificationContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, null)
  return (
    <notificationContext.Provider value={[state, dispatch]}>
      {children}
    </notificationContext.Provider>
  )
}

export const useNotification = () => useContext(notificationContext)

