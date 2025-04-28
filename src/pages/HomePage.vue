<script lang="ts" setup>
import { useHomePageLogic } from './HomePageLogic'
import '../style.scss'

const {
  isLoading, isFindingNearby, searchedNearby,
  country, state, city, type,
  selectedBrewery, breweryOfTheDay,
  nearbyBreweries, visibleNearbyBreweries,
  onFilterChange, selectBrewery, pickRandomBrewery,
  findNearbyBreweries, loadMoreNearby, goHome,
  uniqueCountries, uniqueStates, uniqueCities, uniqueTypes,
  filteredBreweries,
  toggleDarkMode, isDarkMode  
} = useHomePageLogic()
</script>

<template>
  <div class="container py-4">
    <!-- Pulsante per switch tema scuro -->
    <div class="text-end mb-3">
        <button class="btn btn-sm btn-outline-dark rounded-pill dark-mode-button" @click="toggleDarkMode">
            <span v-if="!isDarkMode">🌙 Modalità Scura</span>
            <span v-else>☀️ Modalità Chiara</span>
        </button>
   </div>

    <div v-if="isLoading" class="text-center py-5">
      <div class="spinner-border text-warning" role="status">
        <span class="visually-hidden">Caricamento...</span>
      </div>
    </div>

    <div v-else>
      <h1 class="text-center mb-4">🍻 Trova la tua Birreria</h1>

      <div v-if="breweryOfTheDay" class="card p-4 mb-5 text-white brewery-of-day shadow" @click.self="selectBrewery(breweryOfTheDay)" style="cursor: pointer;">
        <h3>✨ Birreria Consigliata ✨</h3>
        <h4 class="mt-2">{{ breweryOfTheDay.name }}</h4>
        <p class="mb-0">{{ breweryOfTheDay.city }}, {{ breweryOfTheDay.state }}</p>
        <small>Tipologia: {{ breweryOfTheDay.brewery_type }}</small>
        <div class="text-center mt-3">
          <button class="btn btn-light btn-sm rounded-pill px-3" @click.stop="pickRandomBrewery">
            🔄 Cambia birreria
          </button>
        </div>
      </div>

      <div class="filters mb-5">
        <div class="row g-3 justify-content-center">
          <div class="col-12 col-md-2">
            <input v-model="country" list="countries" @input="onFilterChange('country', country)" class="form-control rounded-pill" placeholder="Paese" />
            <datalist id="countries">
              <option v-for="c in uniqueCountries" :key="c" :value="c" />
            </datalist>
          </div>
          <div class="col-12 col-md-2">
            <input v-model="state" list="states" @input="onFilterChange('state', state)" class="form-control rounded-pill" placeholder="Stato" />
            <datalist id="states">
              <option v-for="s in uniqueStates" :key="s" :value="s" />
            </datalist>
          </div>
          <div class="col-12 col-md-2">
            <input v-model="city" list="cities" @input="onFilterChange('city', city)" class="form-control rounded-pill" placeholder="Città" />
            <datalist id="cities">
              <option v-for="ci in uniqueCities" :key="ci" :value="ci" />
            </datalist>
          </div>
          <div class="col-12 col-md-2">
            <input v-model="type" list="types" @input="onFilterChange('type', type)" class="form-control rounded-pill" placeholder="Tipologia" />
            <datalist id="types">
              <option v-for="t in uniqueTypes" :key="t" :value="t" />
            </datalist>
          </div>
          <div class="col-12 col-md-2">
            <button class="btn btn-orange w-100 d-flex align-items-center justify-content-center rounded-pill" @click="findNearbyBreweries" :disabled="isFindingNearby">
              <span v-if="isFindingNearby" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              📍 Cerca vicino a me
            </button>
          </div>
        </div>
      </div>

      <div v-if="nearbyBreweries.length > 0" class="brewery-list row">
        <div v-if="searchedNearby" class="text-center mb-3">
          <button class="btn btn-outline-secondary btn-sm rounded-pill" @click="goHome">
            ⬅️ Torna alla lista completa
          </button>
        </div>
        <h3 class="mb-4">🍺 Birrerie Vicine</h3>
        <div v-for="brewery in visibleNearbyBreweries" :key="brewery.id" class="col-12 col-md-6 col-lg-4 mb-4">
          <div class="card p-3 shadow-sm brewery-card fade-in" @click="selectBrewery(brewery)" style="cursor: pointer;">
            <h5>{{ brewery.name }}</h5>
            <p class="mb-0">{{ brewery.city }}, {{ brewery.state }} ({{ brewery.country }})</p>
            <small>Distanza: {{ brewery.distance.toFixed(2) }} km</small>
          </div>
        </div>
        <div v-if="visibleNearbyBreweries.length < nearbyBreweries.length" class="text-center mt-3">
          <button class="btn btn-outline-orange rounded-pill" @click="loadMoreNearby">
            Carica altri risultati
          </button>
        </div>
      </div>

      <div v-else-if="searchedNearby" class="text-center mt-4">
        <p><strong>Nessuna birreria trovata nelle vicinanze.</strong></p>
      </div>

      <div v-else class="brewery-list row">
        <h3 class="mb-4">🍻 Tutte le Birrerie</h3>
        <div v-for="brewery in filteredBreweries" :key="brewery.id" class="col-12 col-md-6 col-lg-4 mb-4">
          <div class="card p-3 shadow-sm brewery-card fade-in" @click="selectBrewery(brewery)" style="cursor: pointer;">
            <h5>{{ brewery.name }}</h5>
            <p class="mb-0">{{ brewery.city }}, {{ brewery.state }} ({{ brewery.country }})</p>
            <small>Tipologia: {{ brewery.brewery_type }}</small>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="breweryModal" tabindex="-1" aria-labelledby="breweryModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="breweryModalLabel">{{ selectedBrewery?.name }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Chiudi"></button>
          </div>
          <div class="modal-body" v-if="selectedBrewery">
            <p><strong>Tipologia:</strong> {{ selectedBrewery.brewery_type }}</p>
            <p><strong>Indirizzo:</strong> {{ selectedBrewery.street || 'Non disponibile' }}, {{ selectedBrewery.city }}, {{ selectedBrewery.state }}</p>
            <p><strong>Telefono:</strong> {{ selectedBrewery.phone || 'Non disponibile' }}</p>
            <p><strong>Website:</strong> 
              <a v-if="selectedBrewery.website_url" :href="selectedBrewery.website_url" target="_blank">Visita il sito</a>
              <span v-else>Non disponibile</span>
            </p>
          </div>
        </div>
      </div>
    </div>

    <footer class="text-center py-4 mt-5 footer-custom">
      <p class="mb-1">Progetto sviluppato in Vue 3 e TypeScript</p>
      <p class="mb-0">
        Realizzato da <strong>Federico Romano</strong> —
        <a href="https://federomanorobert.com" target="_blank" rel="noopener noreferrer">federomanorobert.com</a>
      </p>
    </footer>

  </div>
</template>
