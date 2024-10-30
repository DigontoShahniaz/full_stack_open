
const Header = ({name}) => <h1>{name}</h1>

const Part = ({parts}) => parts.map((part => <p key={part.id}>{part.name} {part.exercises}</p>))


const Content = ({parts}) => {
  return (
    <div>
      <Part parts={parts} />
    </div>
  )
}


const Course = ({course}) => {
  return (
    <>
      <Header name={course.name}/>
      <Content parts={course.parts}/>
    </>
  )
}



const App = () => {
  const course = {
    id: 1,
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10,
        id: 1
      },
      {
        name: 'Using props to pass data',
        exercises: 7,
        id: 2
      },
      {
        name: 'State of a component',
        exercises: 14,
        id: 3
      }
    ]
  }

  return (
    <div>
      <Course course={course} />
    </div>
    
  )

}

export default App