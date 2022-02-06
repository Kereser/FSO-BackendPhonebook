require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(express.static('build'))
app.use(express.json())
app.use(cors())

morgan.token('body', (req) => {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


// const requestLogger = (request, response, next) => {
//   console.log('Method:', request.method)
//   console.log('Path:  ', request.path)
//   console.log('Body:  ', request.body)
//   console.log('---')
//   next()
// }

// app.use(requestLogger)

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-6587459'
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '040-6587459'
  },
  {
    id: 3,
    name: 'Karinchi',
    number: '040-5687459'
  },
  {
    id: 4,
    name: 'Poshickis',
    number: '040-7458963'
  }
]

app.get('/api/persons', (req, res) => {
  Person
    .find({})
    .then(returnedPeople => {
      res.json(returnedPeople)
    })
})

app.get('/info', (req, res) => {
  const date = new Date()
  res.send(`
    <h2>Phonebook has info for ${persons.length} people</h2>
    <p>${date}</p>  
  `)
})

app.get('/api/persons/:id', (req, res) => {
  Person
    .findById(req.params.id)
    .then(returnedPerson => {
      res.json(returnedPerson)
    })
})

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (!body.name || !body.number) {
    return res.status(404).json({
      error: 'You have to enter both name and number'
    })
  }
  else {
    const person = new Person({
      name: body.name,
      number: body.number
    })

    person
      .save()
      .then(createdPerson => {
        res.json(createdPerson)
      })
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => {
    return person.id !== id
  })

  res.status(204).end()
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`server running on port: ${PORT} `);
})