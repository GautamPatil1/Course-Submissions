const express = require('express')
const Person = require('./models/person')
var morgan = require('morgan')
const app = express()
app.use(express.static('dist'))
const cors = require('cors')
// const mongoose = require('mongoose')
app.use(express.json())
app.use(morgan('tiny'))
app.use(morgan('combined'))
app.use(cors())

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}
app.use(errorHandler)
// const url = `mongodb+srv://gautampatil:FslsJMKPfdBkgrsE@cluster0.ikqofwt.mongodb.net/Phonebook?retryWrites=true&w=majority&appName=AtlasApp`;


// let persons = [
//     { 
//       "id": 1,
//       "name": "Arto Hellas", 
//       "number": "040-123456"
//     },
//     { 
//       "id": 2,
//       "name": "Ada Lovelace", 
//       "number": "39-44-5323523"
//     },
//     { 
//       "id": 3,
//       "name": "Dan Abramov", 
//       "number": "12-43-234345"
//     },
//     { 
//       "id": 4,
//       "name": "Mary Poppendieck", 
//       "number": "39-23-6423122"
//     }
// ]


// app.get('/api/persons', (request, response) => {
//   response.json(persons)
// });

app.get('/info', async (req, res) => {
  try {
    const count = await Person.countDocuments({});
    const infoResponse = `
      <p>Phonebook has info of ${count} people</p>
      <p>${new Date()}</p>
    `;
    res.send(infoResponse);
  } catch (error) {
    console.error('Error counting documents:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/api/persons/', (req, res) => {
  Person.find({}).then((result) =>{
    res.json(result)
  })
});

app.get('/api/persons/:id', (req, res) => {
  Person.findById(req.params.id).then((result) => {
    if (result) {
      res.json(result)
    }else{
      res.status(404).end()
    }
  })
  .catch((err) => next(err))
})

// app.delete('/api/persons/:id', (req, res) => {
//     const id = Number(req.params.id)
//     persons = persons.filter(person => person.id !== id)
//     res.status(204).end()
// });

app.delete('/api/persons', (req, res) => {
  Person.deleteMany({}).then((result) => {
    res.status(204).end()
  })
  .catch((err) => next(err))
})

app.post('/api/persons', (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({ error: 'name or number missing' });
  }

  // Regular expression to validate phone numbers as strings
  const phoneNumberPattern = /^(\d{2,3}-\d{7,}|\d{3}-\d{8,})$/;

  if (!phoneNumberPattern.test(body.number)) {
    alert("Invalid phone number format");
    return res.status(400).json({ error: 'Invalid phone number format' });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person
    .save()
    .then((savedPerson) => res.status(201).json(savedPerson))
    .catch((error) => {
      console.error('Error saving person:', error);
      res.status(500).json({ error: 'Something went wrong' });
    });
});


// app.post('/api/persons/', (req, res) => {
//     const person = req.body
//     person.id = Math.floor(Math.random() * 1000000) + 1
//     if ( !person.name || !person.number ) {
//         return res.status(400).json({ 
//             error: 'content missing' 
//         })
//     }

//     if ( persons.find(p => p.name === person.name ) ) {
//         return res.status(400).json({ 
//             error: 'name must be unique' 
//         })
//     }

//     persons.push(person)
//     res.json(person)
//     console.log(persons)

// });

// mongoose.set('strictQuery', false);

// mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => {
//     console.log('Connected to MongoDB');
    
//     const personSchema = new mongoose.Schema({
//       name: String,
//       number: Number
//     });
//     personSchema.set('toJSON', {
//         transform: (document, returnedObject) => {
//           returnedObject.id = returnedObject._id.toString()
//           delete returnedObject._id
//           delete returnedObject.__v
//         }
//     })
    
    // const Person = mongoose.model('Person', personSchema);
    
    // const person = new Person({
    //   name: person_name,
    //   number: person_number
    // });
    
    


    // if (person_name && person_number ) {
    //     person.save()
    //     .then(result => {
    //         console.log('Person saved!');
    //         mongoose.connection.close();
    //     })
    //     .catch(error => {
    //         console.error('Error saving Person:', error);
    //         mongoose.connection.close();
    //     });
    // }
    // else {
    //     console.log("\nDatabase:\n")
    //     Person.find({}).then(result => {
    //         result.forEach(person => {
    //             console.log(person);
    //         });
    //         mongoose.connection.close();
    //     });
    // }
    
//   })
  // .catch(error => {
  //   console.error('Error connecting to MongoDB:', error);
  // });


const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

