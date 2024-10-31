
// Header Component
const Header = ({name}) => <h1>{name}</h1>

// Part Component
const Part = ({parts}) => parts.map((part => <p key={part.id}>{part.name} {part.exercises}</p>))


// Total Component
const Total = ({parts}) => <p><b>total of {parts.reduce((accumulator, part) => accumulator + part.exercises, 0)} exercises</b></p>



// Content Component
const Content = ({parts}) => {
  return (
    <div>
      <Part parts={parts} />
    </div>
  )
}

// Course Component
const Course = ({course}) => {
  return (
    <>
      <Header name={course.name}/>
      <Content parts={course.parts}/>
      <Total parts={course.parts} />
    </>
  )
}


// App Component
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
      },
      {
        name: 'Redux',
        exercises: 11,
        id: 4
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