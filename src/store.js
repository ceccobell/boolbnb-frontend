import { reactive } from "vue"
import MyApartments from "./components/MyApartments.vue"

export const store = reactive({
    isAuthenticated: false,
    sponsorPackages: [],
    apartmentToSponsor: {},
    myApartments: [],
    selectedPlan: { id: null }, // Cambia selectedPlan da null a un oggetto con id nullo
    apartmentsSponsored: [],
    currentApartment: {},
    filteredApartments: [],
    services: [],
})
