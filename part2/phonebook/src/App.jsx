import { useState, useEffect } from "react";
import SearchFilter from "./components/SearchFilter";
import PersonForm from "./components/PersonForm";
import PersonList from "./components/PersonList";
import Notification from "./components/Notification";

import personService from "./services/PersonService";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  // const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    personService.getAll().then((initialPerson) => {
      setPersons(initialPerson);
    });
  }, []);

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const addPerson = (event) => {
    event.preventDefault();
    const existingPerson = persons.find(
      (person) => person.name.toLowerCase() === newName.toLowerCase()
    );

    if (existingPerson) {
      const confirmUpdate = window.confirm(
        `${newName} is already added to the phonebook. Replace the old number with a new one?`
      );

      if (confirmUpdate) {
        const updatedPerson = { ...existingPerson, number: newNumber };
        personService
          .update(existingPerson.id, updatedPerson)
          .then((updatedPerson) => {
            setPersons(
              persons.map((person) =>
                person.id === updatedPerson.id ? updatedPerson : person
              )
            );
            setNewName("");
            setNewNumber("");
            setErrorMessage(
              `Number for ${updatedPerson.name} updated successfully.`
            );
            setTimeout(() => {
              setErrorMessage(null);
            }, 5000);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } else {
      const newPerson = { name: newName, number: newNumber };
      personService
        .create(newPerson)
        .then((createdPerson) => {
          setPersons(persons.concat(createdPerson));
          setNewName("");
          setNewNumber("");
          setErrorMessage(`${createdPerson.name} Added successfully.`);
          setTimeout(() => {
            setErrorMessage(null);
          }, 5000);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage} />
      <SearchFilter
        searchTerm={searchTerm}
        handleSearchChange={handleSearchChange}
      />
      <h3>Add a new</h3>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        addPerson={addPerson}
      />
      <h3>Numbers</h3>
      <PersonList persons={filteredPersons} setPersons={setPersons} />
    </div>
  );
};

export default App;