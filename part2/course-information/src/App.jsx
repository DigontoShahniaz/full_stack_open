
// Header Component
const Header = ({name}) => <h1>{name}</h1>

// Part Component
const Part = ({parts}) => (
  parts.map((part) => <p key={part.id}>{part.name} {part.exercises}</p>)
)


// Total Component
const Total = ({parts}) => (
  <p>
    <b>total of {parts.reduce((accumulator, part) => accumulator + part.exercises, 0)} exercises</b>
  </p>
)



// Content Component
const Content = ({parts}) => {
  return (
    <div>
      <Part parts={parts} />
    </div>
  )
}

// Course Component
const Course = ({courses}) => {
  return (
    courses.map(course => 
    <div key={course.id}>
      <Header name={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>)

  )
}


// App Component
const App = () => {
  const courses = [
    {
      name: 'Half Stack application development',
      id: 1,
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
    }, 
    {
      name: 'Node.js',
      id: 2,
      parts: [
        {
          name: 'Routing',
          exercises: 3,
          id: 1
        },
        {
          name: 'Middlewares',
          exercises: 7,
          id: 2
        }
      ]
    }
  ]

  return (
    <div>
      <Course courses={courses} />
    </div>
    
  )

}

export default App