import axios from 'axios'
const url = "/api/persons"


const getPersons = () => {
    return (axios  
                .get(url)
                .then(response => response.data))
}

const createPersons = (newPersonObject) => {
    return (axios
                .post(url, newPersonObject)
                .then(response => response.data))
}

const deletePerson = (id) => {
    return (axios
                .delete(`${url}/${id}`))
}

const modifyNumber = (newNumber, persons, name) => {
    const currName = persons.find(person => (person.name === name))
    const newProfile = {...currName, number: newNumber}


    return axios.put((`${url}/${newProfile.id}`), newProfile)
}

export default {getPersons, createPersons, deletePerson, modifyNumber}