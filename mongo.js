const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const name = process.argv[3]

const number = process.argv[4]

const url = `mongodb+srv://FSODB:${password}@fso.obwhe.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: name,
  number: number
})

if (process.argv.length === 4) {
  console.log('You do not enter either the name or number')
  process.exit(1)
}

if (process.argv.length === 5) {
  person.save().then(res => {
    console.log(`Added ${res.name} number: ${res.number} to phonebook`)
    mongoose.connection.close()
  })
}

if (process.argv.length === 3) {
  Person
    .find({})
    .then(res => {
      console.log('phonebook')
      res.forEach(person => {
        console.log(`${person.name} ${person.number}`)
      })
      mongoose.connection.close()
    })
}

