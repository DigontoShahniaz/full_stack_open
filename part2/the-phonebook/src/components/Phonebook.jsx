
const Phonebook = ({persons, filter}) => {
  const filteredPersons = persons.filter(person => 
    person.name.toLocaleLowerCase().includes(filter.toLocaleLowerCase())
  )

  return (
    <div>
      <h2>Numbers</h2>
      <ul>
        {filteredPersons.map(person => <li key={person.id}>{person.name} {person.number}</li>)}
      </ul>
    </div>

  )

}

export default Phonebook