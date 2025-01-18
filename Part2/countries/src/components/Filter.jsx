
import { useState, useEffect } from 'react'

const Filter = ({ countries, onFilteredCountriesChange }) => {
  const [query, setQuery] = useState('')
  const [filteredCountries, setFilteredCountries] = useState([])

  useEffect(() => {
    const filtered = countries.filter(country =>
      country.name.common.toLowerCase().includes(query.toLowerCase())
    )
    setFilteredCountries(filtered)
    onFilteredCountriesChange(filtered)
  }, [query, countries, onFilteredCountriesChange])

  return (
    <div>
      find countries: <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for a country..."
      />
    </div>
  )
}

export default Filter