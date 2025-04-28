<template>
    <div class="container py-4">
      <button class="btn btn-secondary mb-3" @click="goBack">← Torna indietro</button>
  
      <div v-if="brewery" class="card p-4">
        <h2>{{ brewery.name }}</h2>
        <p><strong>Tipo:</strong> {{ brewery.brewery_type }}</p>
        <p><strong>Indirizzo:</strong> {{ brewery.street || 'N/A' }}, {{ brewery.city }}, {{ brewery.state }}</p>
        <p><strong>Telefono:</strong> {{ brewery.phone || 'N/A' }}</p>
        <p><strong>Website:</strong> 
          <a v-if="brewery.website_url" :href="brewery.website_url" target="_blank">{{ brewery.website_url }}</a>
          <span v-else>N/A</span>
        </p>
      </div>
  
      <div v-else>
        <p>Caricamento birreria...</p>
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { useRoute, useRouter } from 'vue-router'
  import { useBreweryStore } from '../store/breweryStore.ts'
  import { computed } from 'vue'
  
  const route = useRoute()
  const router = useRouter()
  const breweryStore = useBreweryStore()
  
  const brewery = computed(() => {
    return breweryStore.breweries.find(b => b.id === route.params.id)
  })
  
  const goBack = () => {
    router.back()
  }
  </script>
  
  <style scoped lang="scss">
  </style>
  