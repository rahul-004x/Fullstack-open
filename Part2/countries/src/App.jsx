import { useState, useEffect } from 'react'
import './App.css'
import { getAllCountries } from './services/calls'
import Filter from './components/Filter'
import CountryDetails from './components/Country'

function App() {
  const [countries, setCountries] = useState([])
  const [filteredCountries, setFilteredCountries] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)

  useEffect(() => {
    getAllCountries()
      .then(data => {
        setCountries(data)
      })
  }, [])

  return (
    <div>
      <Filter 
        countries={countries} 
        onFilteredCountriesChange={setFilteredCountries} 
      />
      {filteredCountries.length > 10 && <p>Too many matches, specify another filter</p>}
      {filteredCountries.length <= 10 && filteredCountries.length > 1 && (
        <ul>
          {filteredCountries.map(country => (
            <li key={country.cca3}>
              {country.name.common}
              <button onClick={() => setSelectedCountry(country)}>show</button>
            </li>
          ))}
        </ul>
      )}
      {selectedCountry && <CountryDetails country={selectedCountry} />}
      {filteredCountries.length === 1 && <CountryDetails country={filteredCountries[0]} />}
    </div>
  )
}

export default App