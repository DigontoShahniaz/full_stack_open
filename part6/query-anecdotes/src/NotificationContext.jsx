import React, { createContext, useReducer, useContext } from 'react'

const NotificationContext = createContext()

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SHOW':
      return { message: action.message, visible: true }
    case 'HIDE':
      return { message: '', visible: false }
    default:
      return state
  }
}

export const NotificationContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, { message: '', visible: false })

  return (
    <NotificationContext.Provider value={{ state, dispatch }}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotification = () => useContext(NotificationContext)
