import axios from 'axios'

const getAllCountries = async () => {
  const response = await axios.get('https://studies.cs.helsinki.fi/restcountries/api/all')
  return response.data
}

const getWeather = async (city, api_key) => {
  try {
    const encodedCity = encodeURIComponent(city)
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${encodedCity}&appid=${api_key}&units=metric`)
    return response.data
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new Error(`Weather data not found for ${city}`)
    }
    throw error
  }
}

export { getAllCountries, getWeather }