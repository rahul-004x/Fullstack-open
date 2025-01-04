import React from 'react'

const Notification = ({ message, error }) => {
  const inlineStyle = {
    color: error ? 'red' : 'green',
    backgroundColor: 'lightgrey',
    fontSize: '20px',
    padding: '10px',
    borderRadius:'5px',
    marginBottom: '10px',
  }

  if (message === null) {
    return null
  }

  return (
    <div style={inlineStyle}>
      {message}
    </div>
  )
}

export default Notification