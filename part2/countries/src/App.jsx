import axios from 'axios'
import {useState, useEffect} from 'react'
import Country from './components/Country'
import List from './components/List'
import Weather from './components/Weather'

function App() {
  const [countries, setCountries] = useState([])
  const [value, setValue] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [weatherData, setWeatherData] = useState(null)
  const [icon, setIcon] = useState(null)
  const api_key = import.meta.env.VITE_SOME_KEY

  useEffect(() => {
    axios
    .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
    .then(response => setCountries(response.data))
    .catch(error => console.log('An error occured while fetching the data', error))
  }, [])

  useEffect(() => {

    if (selectedCountry) {
      axios
      .get(`https://api.openweathermap.org/data/2.5/weather?q=${selectedCountry.name.common}&appid=${api_key}&units=metric`)
      .then(response => {
        const data = response.data
        setWeatherData(data)
        const code = data.weather[0].icon
        const iconUrl = `https://openweathermap.org/img/wn/${code}@2x.png`
        setIcon(iconUrl)
      })
      .catch(error => console.log('An error occurred while fetching weather data:', error));
    }
  }, [selectedCountry, api_key])




  
  const handleChange = (event) => {
    setValue(event.target.value)
  }

  
  const handleDetails = (country) => {
    setSelectedCountry(country)
  }

  const filteredCountries = value ? countries.filter(country => country.name.common.toLowerCase().includes(value.toLowerCase())) : []
  const maxDisplay = 10

  useEffect(() => {
    if (filteredCountries.length === 1 && !selectedCountry) {
      setSelectedCountry(filteredCountries[0]);
    } else if (filteredCountries.length === 0) {
      setSelectedCountry(null);
    }
  }, [filteredCountries, selectedCountry])

  return (
    <>
    find countries
    <input value={value} onChange={handleChange} />
    
    {
      selectedCountry ? 
      <>
        <Country country={selectedCountry} />
        <Weather country={selectedCountry} weatherData={weatherData} icon={icon}/>
      </>
      : (<ul>
          {
            filteredCountries.length > maxDisplay 
            ? (<li>Too many matches, specify another filter</li>) 
            : filteredCountries.length === 1
            ? (
              <>
                <Country country={filteredCountries[0]} />
                <Weather country={filteredCountries[0]} weatherData={weatherData} icon={icon}/>
                
              </>)
            : (filteredCountries.map(country => <List key={country.name.official} name={country.name.common} handleDetails={() => handleDetails(country)}/>))
          }
        </ul>)
    }

    </>
  )
}

export default App
