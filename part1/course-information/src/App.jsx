// Header component
const Header = (props) => {
  //console.log('props received by Header Component: ', props)
  return (
    <h1>{props.course}</h1>
  )
}

// Part Component
const Part = (props) => {
  //console.log('props received by Part Component: ', props)
  return (
    <p>{props.part} {props.exercise}</p>
  )
}

// Content Component
const Content = (props) => {
  //console.log('props received by Content Component: ', props)
  return (
    <div>
      <Part part={props.parts[0].name} exercise={props.parts[0].exercises}/>
      <Part part={props.parts[1].name} exercise={props.parts[1].exercises}/>
      <Part part={props.parts[2].name} exercise={props.parts[2].exercises}/>
    </div>
  )
}

// Total Component
const Total = (props) => {
  //console.log('props received by Total Component: ', props)
  return (
    <p>Number of exercises {props.parts[0].exercises + props.parts[1].exercises + props.parts[2].exercises}</p>
  )
}

// App Component
const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }
  
  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />

    </div>
  )
}

export default App