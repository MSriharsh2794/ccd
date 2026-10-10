import { useDeferredValue, useEffect, useState } from 'react'
import Country from 'country-state-city/lib/country.js'

const countries = Country.getAllCountries().sort((left, right) => left.name.localeCompare(right.name))

function LocationFields() {
  const [countryCode, setCountryCode] = useState('')
  const [cityQuery, setCityQuery] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [cityListOpen, setCityListOpen] = useState(false)
  const [cities, setCities] = useState([])
  const [loadedQuery, setLoadedQuery] = useState('')
  const [cityLoadError, setCityLoadError] = useState('')
  const deferredCityQuery = useDeferredValue(cityQuery.trim().toLocaleLowerCase())
  const requestKey = countryCode ? `${countryCode}:${deferredCityQuery}` : ''
  const matchingCities = loadedQuery === requestKey ? cities : []
  const cityListLoading = Boolean(countryCode && loadedQuery !== requestKey)

  useEffect(() => {
    if (!countryCode) return undefined

    const controller = new AbortController()
    const query = new URLSearchParams({ country: countryCode, q: deferredCityQuery })

    fetch(`/api/cities?${query}`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('Could not load cities.')
        return response.json()
      })
      .then((results) => {
        setCities(results)
        setCityLoadError('')
        setLoadedQuery(requestKey)
      })
      .catch((error) => {
        if (error.name === 'AbortError') return
        setCities([])
        setCityLoadError(error.message || 'Could not load cities.')
        setLoadedQuery(requestKey)
      })

    return () => controller.abort()
  }, [countryCode, deferredCityQuery, requestKey])

  function handleCountryChange(event) {
    const selectedCountry = countries.find((country) => country.isoCode === event.target.value)
    setCountryCode(selectedCountry?.isoCode || '')
    setCityQuery('')
    setSelectedCity('')
    setCityListOpen(false)
    setCityLoadError('')
    setCityLoadError('')
  }

  function handleCityQueryChange(event) {
    setCityQuery(event.target.value)
    setSelectedCity('')
    setCityListOpen(true)
  }

  function selectCity(city) {
    const cityName = city.stateCode ? `${city.name}, ${city.stateCode}` : city.name
    setCityQuery(cityName)
    setSelectedCity(cityName)
    setCityListOpen(false)
  }

  return (
    <>
      <label>
        <span>Country</span>
        <select name="country_code" value={countryCode} onChange={handleCountryChange} required>
          <option value="">Select country</option>
          {countries.map((country) => <option key={country.isoCode} value={country.isoCode}>{country.name}</option>)}
        </select>
        <input type="hidden" name="country" value={Country.getCountryByCode(countryCode)?.name || ''} />
      </label>
      <label className="city-picker-label">
        <span>City</span>
        <input
          type="search"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={cityListOpen && Boolean(countryCode)}
          aria-controls="city-options"
          aria-label="Search and select city"
          autoComplete="off"
          placeholder={countryCode ? 'Type to find a city' : 'Select a country first'}
          value={cityQuery}
          disabled={!countryCode}
          onChange={handleCityQueryChange}
          onFocus={() => setCityListOpen(true)}
          onBlur={() => setCityListOpen(false)}
          required
        />
        <input type="hidden" name="city" value={selectedCity} />
        {cityListOpen && countryCode && (
          <div className="city-options" id="city-options" role="listbox" aria-label="Cities">
            {cityListLoading ? <span className="city-empty-state">Loading cities...</span>
              : cityLoadError ? <span className="city-empty-state">{cityLoadError}</span>
                : matchingCities.length > 0 ? matchingCities.map((city) => {
              const cityName = city.stateCode ? `${city.name}, ${city.stateCode}` : city.name
              return (
                <button
                  key={cityName}
                  type="button"
                  role="option"
                  aria-selected={selectedCity === cityName}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => selectCity(city)}
                >
                  {cityName}
                </button>
              )
            }) : <span className="city-empty-state">No matching cities</span>}
          </div>
        )}
      </label>
    </>
  )
}

export default LocationFields