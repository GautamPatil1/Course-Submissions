import {useState, useEffect} from 'react'
import countriesServices from './services/countries'


const Countries = ({countries, findCountry, country, handleClickShow, weather}) => {
  if(!countries || findCountry === ''){
    return null
  }

  let weatherData = (<></>)

  if(weather){
    weatherData = (
      <div>
        <p>Temperature: {weather.current.temp_c} C ({weather.current.temp_f} F)</p>
        <p>Condition: {weather.current.condition.text}</p>
        <img src={weather.current.condition.icon}/>
        <p>Wind speed: {weather.current.wind_kph} kph ({weather.current.wind_mph} mph)</p>
      </div>
    )
  }

  if(countries.length > 10){
    return(
      <div>
        Too many results, please be more specific
      </div>
    )
  }else if(countries.length === 1 && country){
    return(
      <div>
        <h1>{country.name.common}</h1>
        <span></span>
        <span></span>
        <div>Capital: {country.capital}</div>
         <div>Area: {country.area}</div>
        <h3>Languages</h3>
        <ul>
          {Object.values(country.languages).map(language => (
              <li key={language}>{language}</li>
          ))}
        </ul>
        <img src={`${(country.flags.png)}`} alt={`${(country.flags.alt)}`} />
        {weatherData}
      </div>
    )
  }else{
    if(country !== null){
      return(
      <>
        <div>
          {countries.map(singleCountry => {
            return(
              <div key={singleCountry.common}>
              {singleCountry.common}
              <span>  </span>
              <button value={singleCountry.common} onClick={handleClickShow}>Show me</button>
              </div>)})}
          </div>
          <div>  
            <h1>{country.name.common}</h1>
            <span></span>
            <span></span>
            <div>Capital: {country.capital}</div>
            <div>Area: {country.area}</div>
            <h3>Languages</h3>
            <ul>
              {Object.values(country.languages).map(language => (
                  <li key={language}>{language}</li>
              ))}
            </ul>
            <img src={`${(country.flags.png)}`} alt={`${(country.flags.alt)}`} />
            {weatherData}
          </div>
        </>
      )
    }else {
      return(
        <div>
          {countries.map(singleCountry => {
            return(
              <div key={singleCountry.common}>
                {singleCountry.common}
                <span>  </span>
                <button value={singleCountry.common} onClick={handleClickShow}>Show me</button>
              </div>
            )
          })}
        </div>
      )
    }
  }
  
}


function App() {
  const [findCountry, setFindCountry] = useState('')
  const [countries, setCountries] = useState(null)
  const [country, setCountry] = useState(null)
  const [countriesList, setCountriesList] = useState(null)
  const [weather, setWeather] = useState(null)
  const [singleCountry, setSingleCountry] = useState(null)


  const handleInputChange = (event) => {
    setFindCountry(event.target.value)
  }


  useEffect(() => {
    countriesServices.getCountries()
                     .then(response => {
                            setCountries(response.map(country => country.name))
                          })
  },[])

  useEffect(() => {
    // setCountry(null)
    if(countries !== null){
      setCountriesList(countries.filter(country => country.common.toLowerCase().includes(findCountry.toLowerCase())))
      setSingleCountry(null)
    }
  }, [findCountry, countries])
  
  useEffect(() => {
    if(countriesList !== null){
      if(countriesList.length === 1){
        countriesServices.getCountry(countriesList[0].common.toLowerCase())
        .then(response => {
          setCountry(response.data)
        })
        .catch(error => null)
      }else{
        setCountry(null)
      }
    }
  }, [countriesList])

  useEffect(() => {
    if(singleCountry){
      countriesServices.getCountry(singleCountry.toLowerCase())
          .then(response => {
            setCountry(response.data)
          })
          .catch(error => null)
    }
  }, [singleCountry])

  useEffect(() => {
    if(country){
      countriesServices.getWeather(country.name.common)
                        .then(data => {
                          setWeather(data)
                        })
                        .catch(error => null)
    }else{
      setWeather(null)
    }
  }, [country])

  if(!countries){
    return null
  }

  const handleClickShow = (event) => {
    event.preventDefault()
    setSingleCountry(event.target.value)
  }

  // setCountriesList(countries.filter(country => {
  //   if(country.common.toLowerCase() === findCountry.toLowerCase()){
  //     return country
  //   }
  // }))

  return (
    <div>
      <span>Find the countries: </span>
      <input value={findCountry} onChange={handleInputChange} />
      <Countries countries={countriesList} findCountry={findCountry} country={country} handleClickShow={handleClickShow} weather={weather} />
    </div>
  );
}

export default App;