
const Notification = ({message, isError}) => {
  if (message === null) {
    return null
  }

  const style = {
    color: isError ? 'red' : 'green',
    background: 'lightgrey',
    fontSize: '16px',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px'
  }



  return (
    <>
      <div style={style}>
        {message}
      </div>
    </>
  )
}

export default Notification