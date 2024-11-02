
import {useState, useEffect} from 'react'
import axios from 'axios'
import Phonebook from './components/Phonebook'
import Form from './components/Form'
import Filter from './components/Filter'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => {
    axios
    .get('http://localhost:3001/persons')
    .then(response => {
      const data = response.data
      setPersons(data)
    })
    .catch(error => alert(`an error occured`, error))
  }, [])

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
   }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

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

    axios
    .post('http://localhost:3001/persons', numberObject)
    .then(response => {
    const data = response.data
      setPersons(persons.concat(data))
      setNewName('')
      setNewNumber('')
    })
    .catch(error => `An error occured: ${error}`)
  }

  
  return (
    <div>
      <Filter filter={filter} handleFilterChange={handleFilterChange}/>
      <Form 
        newName={newName} 
        newNumber={newNumber} 
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        addNumber={addNumber}
      />
      <Phonebook filter={filter} persons={persons} />

    </div>
  )
}

export default App