import { useState } from 'react'

// statisticLine component
const StatisticLine = (props) => {

  return (
    <tr>
      <td>{props.text}</td>
      <td>{props.value}</td>
    </tr>
  )
}

// statistics component
const Statistics = (props) => {
  const total = props.good + props.neutral + props.bad
  const average = total > 0 ? (props.good - props.bad) / total : 0
  const positive = total > 0 ? (props.good / total) * 100 : 0
  
  if (total > 0) {
    return (
      <div>
        <h2>Statistics</h2>
        <table>
          <tbody>
            <StatisticLine text="good" value={props.good} />
            <StatisticLine text="neutral" value={props.neutral} />
            <StatisticLine text="bad" value={props.bad} />
            <StatisticLine text="all" value={total} />
            <StatisticLine text="average" value={average} />
            <StatisticLine text="positive" value={`${positive}%`} />
          </tbody>
        </table>
      </div>
    )
  }
  return (
    <div>
      <h2>Statistics</h2>
      <p>No feedback given</p>
    </div>
  )
}

// button component
const Button = (props) => {
  return (
    <button onClick={props.onClick}>{props.text}</button>
  )
}

// app component
const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGood = () => setGood(good + 1)
  const handleNeutral = () => setNeutral(neutral + 1)
  const handleBad = () => setBad(bad + 1)

  return (
    <div>
      <h1>give feedback</h1>
      <Button onClick={handleGood} text="good" />
      <Button onClick={handleNeutral} text="neutral" />
      <Button onClick={handleBad} text="bad" />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>

  )
}

export default App