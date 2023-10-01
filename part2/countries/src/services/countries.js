import axios from 'axios'

const url = 'https://studies.cs.helsinki.fi/restcountries/api/'


const getWeather  =(location) => {
    const options = {
        method: 'GET',
        url: 'https://weatherapi-com.p.rapidapi.com/current.json',
        params: {q: location},
        headers: {
          'X-RapidAPI-Key': 'ab48191ae1msh7eaff8b2cd8c03ap1ac406jsn2fdf06ac0b14',
          'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
        }
      };
      
      return(axios.request(options)
                    .then(response => response.data))
}

const getCountries = () => {
    return(axios.get(`${url}all`)
                .then(response => response.data))
}

const getCountry = (country)=> {
    return(axios.get(`${url}name/${country}`))
}


export default {getCountries, getCountry, getWeather}