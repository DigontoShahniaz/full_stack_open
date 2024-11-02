
const Phonebook = ({person, deletePerson}) => {

  return (
    <div>
      <li>
        {person.name} {person.number}
        <button onClick={deletePerson}>delete</button>
      </li>
    </div>

  )

}

export default Phonebook