const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()


app.use(express.json())
app.use(express.static('dist'))
app.use(cors())

morgan.token('post_data', (req) => req.method === 'POST' ? JSON.stringify(req.body) : '')
//app.use(morgan('tiny'))
app.use(morgan(':method :url :status :response-time ms :post_data'))


let persons = [
  { 
    "id": "1",
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": "2",
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": "3",
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": "4",
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]



app.get('/info', (request, response) => {
  response.send(`<h1>Phonebook has info for ${persons.length} people</h1><br/><h1>${new Date()}</h1>`)
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).send({ error: 'no person found' })
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

const generateId = () => {
  return Math.floor(Math.random() * 1000000).toString()
}

app.post('/api/persons/', (request, response) => {
  const body = request.body
  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'name or number missing' })
  } 

  const existingPerson = persons.find(person => person.name === body.name)
  if (existingPerson) {
    return response.status(409).json({ error: 'name must be unique' })
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number
  }
  
  persons = persons.concat(person)
  response.status(201).json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})