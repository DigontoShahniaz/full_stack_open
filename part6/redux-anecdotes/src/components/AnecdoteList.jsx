import { useDispatch, useSelector } from 'react-redux'

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(state => state.anecdotes)
  const filter = useSelector((state) => state.filter)

  const filteredAnecdotes = anecdotes.filter((anecdote) => 
    anecdote.content.toLowerCase().includes(filter.toLowerCase())
  )

  const vote = (id) => {
    dispatch({
      type: 'VOTE',
      payload: { id }
    })
  }

  const sortedAnecdotes = [...filteredAnecdotes].sort((a, b) => b.votes - a.votes)

  return (
    <div>
      {sortedAnecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>has {anecdote.votes}<button onClick={() => vote(anecdote.id)}>vote</button></div>
        </div>
      )}
    </div>
  )
}

export default AnecdoteList