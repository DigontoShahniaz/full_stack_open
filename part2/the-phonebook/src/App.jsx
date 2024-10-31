
import {useState} from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  const filteredPersons = persons.filter(person => 
    person.name.toLocaleLowerCase().includes(filter.toLocaleLowerCase())
  )

  const addNumber = (event) => {
    event.preventDefault()

    if (newName.length === 0 || newNumber.length === 0) {
      alert('No name or number')
      return
    }

    const duplicateName = persons.some(person => person.name === newName)
    const duplicateNumber = persons.some(person => person.number === newNumber)



    if (duplicateName) {
      alert(`${newName} is already added to phonebook`)
      setNewName('')
      return
    }

    if (duplicateNumber) {
      alert(`${newNumber} is already added to phonebook`)
      setNewNumber('')
      return
    }

    const numberObject = {
      name: newName,
      number: String(newNumber),
      id: String(persons.length + 1)
    }
    
    setPersons(persons.concat(numberObject))
    setNewName('')
    setNewNumber('')
  }


  const handleFilterChange = (event) => {
    setFilter(event.target.value)
   }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  
  return (
    <div>
      <div>debug: {newName}</div>
      <div>
        <h2>Phonebook</h2>
        filter shown with <input value={filter} onChange={handleFilterChange}/>
      </div>

      <h2>add a new</h2>
      <form onSubmit={addNumber}>
        <div>
          name: <input value={newName} onChange={handleNameChange}/>
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <ul>
        {filteredPersons.map(person => <li key={person.id}>{person.name} {person.number}</li>)}
      </ul>
    </div>
  )
}

export default App