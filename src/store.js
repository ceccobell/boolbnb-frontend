import { reactive } from "vue";

export const store = reactive({
    isAuthenticated: false,
    sponsorPackages: [],
    apartmentToSponsor: {},
    selectedPlan: { id: null }, // Cambia selectedPlan da null a un oggetto con id nullo
    apartmentsSponsored: [],
    currentApartment: {},
});
