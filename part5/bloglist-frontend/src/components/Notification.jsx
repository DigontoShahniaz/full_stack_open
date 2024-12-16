
const Notification = ({ message, isError }) => {
  const notificationStyle = {
    color: isError ? 'red' : 'green',
    fontStyle: 'italic',
    border: isError? '2px solid red' : '2px solid green',
    borderRadius: '5px',
    backgroundColor: 'lightgrey',
    padding: '10px',
    marginBottom: '10px'
  }

  if (message === null) {
    return null
  }

  return (
    <div className="notification" style={notificationStyle}>
      {message}
    </div>
  )
}


export default Notification