import { reactive } from "vue"

export const store = reactive({
    isAuthenticated: false,
    sponsorPackages: [],
    apartmentToSponsor: {},
    selectedPlan: null,
})
