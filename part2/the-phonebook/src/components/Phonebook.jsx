
const Phonebook = ({persons, deletePerson}) => {
  return (
    <>
      <li>
        {persons.name} {persons.number}
        <button onClick={deletePerson}>delete</button>
      </li>
    </>

  )
}

export default Phonebook