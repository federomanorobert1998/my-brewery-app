import { ref, computed, onMounted } from 'vue';
import { useBreweryStore } from '../store/breweryStore';
import type { Brewery } from '../store/breweryStore';
import { Modal } from 'bootstrap';

export function useHomePageLogic() {
  const breweryStore = useBreweryStore();

  const isLoading = ref(true);
  const isFindingNearby = ref(false);
  const searchedNearby = ref(false);
  const country = ref('');
  const state = ref('');
  const city = ref('');
  const type = ref('');
  const selectedBrewery = ref<Brewery | null>(null);
  const breweryOfTheDay = ref<Brewery | null>(null);
  const nearbyBreweries = ref<(Brewery & { distance: number })[]>([]);
  const visibleNearbyBreweries = ref<(Brewery & { distance: number })[]>([]);
  const isDarkMode = ref(false);

  const onFilterChange = (key: string, value: string) => breweryStore.setFilter(key as any, value);

  const selectBrewery = (brewery: Brewery) => {
    selectedBrewery.value = brewery;
    const modalElement = document.getElementById('breweryModal');
    if (modalElement) new Modal(modalElement).show();
  };

  const pickRandomBrewery = () => {
    if (breweryStore.breweries.length > 0) {
      const randomIndex = Math.floor(Math.random() * breweryStore.breweries.length);
      breweryOfTheDay.value = breweryStore.breweries[randomIndex];
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) * Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const findNearbyBreweries = () => {
    isFindingNearby.value = true;
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      nearbyBreweries.value = breweryStore.breweries
        .filter(b => b.latitude && b.longitude)
        .map(b => ({ ...b, distance: calculateDistance(latitude, longitude, parseFloat(b.latitude!), parseFloat(b.longitude!)) }))
        .sort((a, b) => a.distance - b.distance);
      visibleNearbyBreweries.value = nearbyBreweries.value.slice(0, 5);
      isFindingNearby.value = false;
      searchedNearby.value = true;
    }, () => {
      alert('Errore nella geolocalizzazione.');
      isFindingNearby.value = false;
    });
  };

  const loadMoreNearby = () => {
    const currentLength = visibleNearbyBreweries.value.length;
    visibleNearbyBreweries.value.push(...nearbyBreweries.value.slice(currentLength, currentLength + 5));
  };

  const uniqueCountries = computed(() => Array.from(new Set(breweryStore.breweries.map(b => b.country).filter(Boolean))));
  const uniqueStates = computed(() => Array.from(new Set(breweryStore.breweries.map(b => b.state).filter(Boolean))));
  const uniqueCities = computed(() => Array.from(new Set(breweryStore.breweries.map(b => b.city).filter(Boolean))));
  const uniqueTypes = computed(() => Array.from(new Set(breweryStore.breweries.map(b => b.brewery_type).filter(Boolean))));
  const filteredBreweries = computed(() => breweryStore.filteredBreweries);

  const goHome = () => {
    nearbyBreweries.value = [];
    visibleNearbyBreweries.value = [];
    searchedNearby.value = false;
  };

  const toggleDarkMode = () => {
    document.body.classList.toggle('dark-mode');
    isDarkMode.value = document.body.classList.contains('dark-mode');
  };

  onMounted(async () => {
    await breweryStore.fetchBreweries();
    isLoading.value = false;
    pickRandomBrewery();
  });

  return {
    isLoading, isFindingNearby, searchedNearby,
    country, state, city, type,
    selectedBrewery, breweryOfTheDay,
    nearbyBreweries, visibleNearbyBreweries,
    onFilterChange, selectBrewery, pickRandomBrewery,
    findNearbyBreweries, loadMoreNearby, goHome,
    uniqueCountries, uniqueStates, uniqueCities, uniqueTypes,
    filteredBreweries,
    toggleDarkMode, isDarkMode
  };
}