
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

export default Course