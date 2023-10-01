import { useState, useEffect} from 'react'
import services from './services/note.js'

const Filter = function ({filter, handleFilterChange}) {
  return(
    <>
      Filter name with: <input value={filter} onChange={handleFilterChange} />
    </>
  )
}

const Form = ({newName, newNumber, handleSubmitName, handleChangeInput, handleChangeInputNumber}) => {
  return(
    <>
      <form onSubmit={handleSubmitName}> 
        <div>
          Name: <input value={newName} onChange={handleChangeInput} />
        </div>
        <div>
          Number: <input value={newNumber} onChange={handleChangeInputNumber} />
        </div>
        <div>
          <button type="submit">Add</button>
        </div>
      </form>
    </>
  )
}

const Numbers = function ({persons, filterName, handleDeleteContact}) {
  return(
    <div>
      {(persons.filter(person => (person.name.toLowerCase()).includes(filterName.toLowerCase()))).map(individual => {
        return(
          <form key={individual.id}>
            <div key={individual.id}>
              {individual.name}: {individual.number} 
              <span>    </span>
              <button type="submit" onClick={handleDeleteContact} value={[individual.id, individual.name]}>Delete</button>
            </div>
          </form>
        )
      })}
    </div>
  )
}

const Message = ({message, messageStyleSuccess, messageStyleFailure}) => {
  let messageStyle = {}

  if(message[0] == 0){
    messageStyle = messageStyleSuccess
  }else{
    messageStyle = messageStyleFailure
  }

  if(message[1] !== ''){
    return(
      <div style={messageStyle}>
        <p>{message[1]}</p>
      </div>
    )
  }
}

const App = () => {
  
  useEffect(() => {
    services.getPersons()
    .then(newPersons => {
      setPersons(newPersons)
    })
  }, [])
  
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNumber] = useState('')
  const [filterName, setFilter] = useState('')
  const [message, setMessage] = useState([0, ''])


  const messageStyleSuccess = {
    color: "green",
    padding: "10px",
    backgroundColor: "grey" 
  }

  const messageStyleFailure = {
    color: "red",
    padding: "10px",
    backgroundColor: "grey" 
  }

  const handleSubmitName = (event) => {
    event.preventDefault()
    let repeated = false
    persons.map(person => newName === person.name ? repeated = true : (repeated ? repeated = true : repeated = false))

    if(repeated){
      if(window.confirm(`${newName} is in the phonebook already. Do you want to replace the number?`)){
        services.modifyNumber(newNumber, persons, newName)
                .then(response => {
                  setPersons(persons.map(person => (person.name === newName ? response.data : person)))
                })
      }
    }else if(newName !== ""){
      const person = {
        name: newName,
        number: newNumber,
      }
      services.createPersons(person)
              .then(newPerson => {
                setPersons(persons.concat(newPerson))
              })
      setMessage([0, `${newName} has been successfully added to contact list.`])
      setTimeout(() =>{
        setMessage([0, ''])}, 4000
      )
    }
    setNewName('')
    setNumber('')
  }

  const handleChangeInput = (event) => {
    setNewName(event.target.value)
  }

  const handleChangeInputNumber = (event) => {
    setNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const handleDeleteContact = (event) => {
    const parameters = event.target.value.split(',')
    event.preventDefault()
    if(window.confirm(`Do you want to delete ${parameters[1]}?`)){
      services.deletePerson(Number(parameters[0]))
              .catch(error => {
                setMessage([1, `${parameters[1]} has already been removed from the list.`])
                setTimeout(() =>{
                  setMessage([0, ''])}, 4000
                )
              })
      setPersons(persons.filter(person => {if(person.id !== Number(parameters[0]))
                                        return (person)}))
    }
  }

  return (
    <div className='mainDiv'>
      <h2 className="mainHeader">Phonebook</h2>
      <Message message={message} messageStyleSuccess={messageStyleSuccess} messageStyleFailure={messageStyleFailure} />
      <div>
        <Filter filter={filterName} handleFilterChange={handleFilterChange} />
      </div>
      <h2>Add a new</h2>
      <Form newName={newName} newNumber={newNumber} handleSubmitName={handleSubmitName} handleChangeInput={handleChangeInput} handleChangeInputNumber={handleChangeInputNumber} />
      <h2>Numbers</h2>
      <Numbers persons={persons} filterName={filterName} handleDeleteContact={handleDeleteContact}/>
    </div>
  )
}

export default App