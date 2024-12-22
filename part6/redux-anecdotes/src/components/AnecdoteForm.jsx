import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'
import { showNotification } from '../reducers/notificationReducer'

const NewAnecdote = () => {
  const dispatch = useDispatch()

  const addAnecdoteHandler = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    dispatch(createAnecdote(content))
    dispatch(showNotification(`You added "${content}"`, 5))
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addAnecdoteHandler}>
        <input name="anecdote" />
        <button type="submit">add</button>
      </form>
    </div>
  )
}

export default NewAnecdote
