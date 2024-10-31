
import {useState} from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    {name: 'Arto Hellas'}
  ])
  const [newName, setNewName] = useState('')

  const addNumber = (event) => {
    event.preventDefault()
    const duplicates = persons.some(person => person.name === newName)
    
    if (duplicates) {
      alert(`${newName} is already added to phonebook`)
      setNewName('')
    }
    else {
      event.preventDefault()
      const numberObject = { name: newName }
      setPersons(persons.concat(numberObject))
      setNewName('')
    }


  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  return (
    <div>
      <div>debug: {newName}</div>
      <h2>Phonebook</h2>
      <form onSubmit={addNumber}>
        <div>
          name: <input value={newName} onChange={handleNameChange}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <ul>
        {persons.map(person => <li key={person.name}>{person.name}</li>)}
      </ul>
    </div>
  )
}

export default App