
const Weather = ({country, weatherData, icon}) => {
  console.log(icon)

  return (
    <div>
      {weatherData ? 
       (<div>
          <h2>Weather in {country.capital}</h2>
          <p>Temperature: {weatherData.main.temp} Celcius</p>
          <img src={icon} alt={weatherData.weather[0].description} />
          <p>Wind Speed {weatherData.wind.speed} m/s</p>
        </div>)
        : 
        <p>Loading weather data...</p>
      }
    </div>
  )
}

export default Weather