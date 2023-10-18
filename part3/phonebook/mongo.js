const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('Give a password as an argument');
  process.exit(1);
}

const password = process.argv[2];
const person_name = process.argv[3];
const person_number = process.argv[4];



const url = `mongodb+srv://gautampatil:${password}@cluster0.ikqofwt.mongodb.net/Phonebook?retryWrites=true&w=majority&appName=AtlasApp`;

mongoose.set('strictQuery', false);

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    
    const personSchema = new mongoose.Schema({
      name: String,
      number: Number
    });
    personSchema.set('toJSON', {
        transform: (document, returnedObject) => {
          returnedObject.id = returnedObject._id.toString()
          delete returnedObject._id
          delete returnedObject.__v
        }
    })
    
    const Person = mongoose.model('Person', personSchema);
    
    const person = new Person({
      name: person_name,
      number: person_number
    });
    
    if (person_name && person_number ) {
        person.save()
        .then(result => {
            console.log('Person saved!');
            mongoose.connection.close();
        })
        .catch(error => {
            console.error('Error saving Person:', error);
            mongoose.connection.close();
        });
    }
    else {
        console.log("\nDatabase:\n")
        Person.find({}).then(result => {
            result.forEach(person => {
                console.log(person);
            });
            mongoose.connection.close();
        });
    }
    
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error);
  });
