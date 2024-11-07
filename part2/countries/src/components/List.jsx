
const List = ({name, handleDetails}) => {
  return(
    <>
      {
        <li>
          {name}
          <button onClick={handleDetails}>show</button>
        </li>
      }
    </>
  )
}

export default List