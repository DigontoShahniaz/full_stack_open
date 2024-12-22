import React, { useEffect } from 'react'
import { useNotification } from '../NotificationContext'

const Notification = () => {
  const { state, dispatch } = useNotification()

  useEffect(() => {
    if (state.visible) {
      const timer = setTimeout(() => {
        dispatch({ type: 'HIDE' })
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [state.visible, dispatch])

  if (!state.visible) return null

  return (
    <div style={{ border: 'solid', padding: 10, borderWidth: 1, marginBottom: 5 }}>
      {state.message}
    </div>
  )
}

export default Notification
