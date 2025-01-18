import React from 'react'
import { useSelector } from 'react-redux'

const Notification = () => {
  const notification = useSelector(state => state.notification)
  
  const inlineStyle = {
    color: notification?.type === 'error' ? 'red' : 'green',
    backgroundColor: 'lightgrey',
    fontSize: '20px',
    padding: '10px',
    borderRadius: '5px',
    marginBottom: '10px',
  }

  if (!notification.message) {
    return null
  }

  return (
    <div style={inlineStyle}>
      {notification.message}
    </div>
  )
}

export default Notification