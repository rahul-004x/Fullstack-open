
import { useState, useEffect } from 'react'
import { getWeather } from '../services/calls'

const Weather = ({ city }) => {
  const [weather, setWeather] = useState(null)
  const [error, setError] = useState(null)
  const api_key = import.meta.env.VITE_WEATHER_API_KEY

  useEffect(() => {
    getWeather(city, api_key)
      .then(data => {
        setWeather(data)
        setError(null)
      })
      .catch(error => {
        console.log('Error fetching weather:', error)
        setError(error.message)
        setWeather(null)
      })
  }, [city, api_key])

  if (error) return <p>Error: {error}</p>
  if (!weather) return <p>Loading weather data...</p>

  return (
    <div>
      <h3>Weather in {city}</h3>
      <p>Temperature: {weather.main.temp}°C</p>
      <img 
        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
        alt={weather.weather[0].description}
      />
      <p>Wind: {weather.wind.speed} m/s</p>
    </div>
  )
}

export default Weather