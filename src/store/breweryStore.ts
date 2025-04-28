import { defineStore } from 'pinia'
import axios from 'axios'

export interface Brewery {
  id: string
  name: string
  brewery_type: string
  street: string | null
  city: string
  state: string
  country: string
  postal_code: string
  phone: string | null
  website_url: string | null
  longitude: string | null
  latitude: string | null
}

export const useBreweryStore = defineStore('brewery', {
  state: () => ({
    breweries: [] as Brewery[],
    filteredBreweries: [] as Brewery[],
    filters: {
      country: '',
      state: '',
      city: '',
      type: ''
    }
  }),
  actions: {
    async fetchBreweries() {
      try {
        const response = await axios.get<Brewery[]>('https://api.openbrewerydb.org/v1/breweries')
        this.breweries = response.data
        this.filteredBreweries = response.data
      } catch (error) {
        console.error('Errore nel fetch delle birrerie:', error)
      }
    },
    applyFilters() {
      this.filteredBreweries = this.breweries.filter(brewery => {
        return (!this.filters.country || brewery.country.toLowerCase().includes(this.filters.country.toLowerCase()))
          && (!this.filters.state || brewery.state.toLowerCase().includes(this.filters.state.toLowerCase()))
          && (!this.filters.city || brewery.city.toLowerCase().includes(this.filters.city.toLowerCase()))
          && (!this.filters.type || brewery.brewery_type.toLowerCase().includes(this.filters.type.toLowerCase()))
      })
    },
    setFilter(key: keyof typeof this.filters, value: string) {
      this.filters[key] = value
      this.applyFilters()
    }
  }
})
