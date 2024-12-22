import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getAnecdotes, updateAnecdote } from './services/anecdotes'
import { useNotification } from './NotificationContext'

const App = () => {
  const queryClient = useQueryClient()
  const { dispatch } = useNotification()

  const updateAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    },
  })

  const handleVote = (anecdote) => {
    updateAnecdoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 })
    dispatch({ type: 'SHOW', message: `You voted: "${anecdote.content}"` })
  }

  const { data: anecdotes, isLoading, isError } = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
  })

  if (isLoading) return <div>Loading...</div>;
  if (isError) {
    console.error('Error fetching anecdotes:', error)
    return (
      <div style={{ color: 'red', fontWeight: 'bold', marginTop: '20px' }}>
        Anecdote service not available due to problems in the server.
      </div>
    );
  }


  return (
    <div>
      <h3>Anecdote app</h3>
    
      <Notification />
      <AnecdoteForm />
    
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
