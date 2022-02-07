const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const url = process.env.MONGODB_URI

mongoose.connect(url)
  .then(res => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.log('Error connecting: ', err.message)
  })

  const numberValidator = number => {
    const regex = /(\d{2,3}-\d{6,8})(\d)?/g;
    let match = regex.exec(number)
    if (!match) {
      return false
    } 
    else if (!match[2]){
      return true
    }
    else { 
      return false
    }
  }

const personSchema = mongoose.Schema({
  name: {
    type: String,
    minlength: [3, `Name '{VALUE}' must be at least 3 characters long.`],
    unique: true,
    require: true
  },
  number: {
    type: String,
    minlength: [9, "Number must be at least 8 characters long."],
    require: true,
    validate: [numberValidator, `'{VALUE}' doesn't meet the contiditios for a number. Check it out`]
  }
})

personSchema.plugin(uniqueValidator)

personSchema.set('toJSON', {
  transform: (document, returnedObj) => {
    returnedObj.id = returnedObj._id
    delete returnedObj._id
    delete returnedObj.__v
  }
})

module.exports = mongoose.model('Person', personSchema)