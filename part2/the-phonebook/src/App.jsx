
import {useState, useEffect} from 'react'
import axios from 'axios'
import Phonebook from './components/Phonebook'
import Form from './components/Form'
import Filter from './components/Filter'
import phonebookService from './servers/phonebooks'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => {
    phonebookService
    .getAll()
    .then(initalPhonebook => {
      setPersons(initalPhonebook)
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

    const existingPerson = persons.find(person => person.name === newName)
    if (existingPerson) {
      const confirmUpdate = window.confirm(`${existingPerson.name} is already in the phonebook. Replace old number with new one?`)
      if (confirmUpdate) {
        const updatedPerson = {...existingPerson, number: newNumber}
        phonebookService
        .update(existingPerson.id, updatedPerson)
        .then(returnedPerson => {
          setPersons(persons.map(person => person.id !== existingPerson.id ? person : returnedPerson))
          setNewName('')
          setNewNumber('')
      })
      }

      
    }
    const duplicateNumber = persons.some(person => person.number === newNumber)
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

    phonebookService
    .create(numberObject)
    .then(returendPhonebook => {
      setPersons(persons.concat(returendPhonebook))
      setNewName('')
      setNewNumber('')
    })
    .catch(error => `An error occured: ${error}`)
  }

  const filteredPersons = persons.filter(person => 
    person.name.toLocaleLowerCase().includes(filter.toLocaleLowerCase())
  )

  const deletePerson = (id) => {
    phonebookService
    .deleteUser(id)
    .then(() => {
      setPersons(persons.filter(p => p.id !== id))
    })
    .catch(error => {
      alert('Error occured while deleting the user', error)
    })

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
      <ul>
        <h2>Numbers</h2>
        {filteredPersons.map(person => 
          <Phonebook key={person.id} person={person} deletePerson={() => deletePerson(person.id)}/>
        )}
        
      </ul>
      

    </div>
  )
}

export default App