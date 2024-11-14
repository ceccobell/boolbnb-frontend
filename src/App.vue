<script>
import NavBar from "./components/NavBar.vue"
import axios from "axios"
import { store } from "./store"

export default {
    components: {
        NavBar,
    },
    data() {
        return {
            store,
        }
    },
    methods: {
        // Funzione per ottenere i servizi
        getServices() {
            axios
                .get("http://127.0.0.1:8000/api/services")
                .then((response) => {
                    store.services = response.data
                })
                .catch((error) => {
                    console.error("Errore nel recupero dei servizi:", error.response.data)
                })
        },
        getSponsorPackages() {
            axios
                .get("http://127.0.0.1:8000/api/packages")
                .then((response) => {
                    store.sponsorPackages = response.data.packages
                    store.selectedPlan = store.sponsorPackages[1]
                })
                .catch((error) => {
                    console.error("Errore nel recupero dei pacchetti di sponsorizzazione:", error)
                })
        },
        getSponsoredApartments() {
            axios
                .get("http://127.0.0.1:8000/api/sponsoredApartments")
                .then((response) => {
                    store.apartmentsSponsored = response.data.apartments
                })
                .catch((error) => {
                    console.error("Errore nel recupero dei pacchetti di sponsorizzazione:", error)
                })
        },
        getMyApartments() {
            if (localStorage.getItem("authToken")) {
                const token = localStorage.getItem("authToken")
                console.log(token)

                axios
                    .get("http://127.0.0.1:8000/api/myapartments", {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    })
                    .then((response) => {
                        store.myApartments = response.data.apartments
                        store.myApartments.forEach((apartment) => {
                            apartment.messages = []
                            this.getMessages(apartment)
                        })
                    })
                    .catch((error) => {
                        console.error("Errore nel recupero dei tuoi appartamenti:", error)
                    })
            }
        },
        getMessages(apartment) {
            axios
                .get(`http://127.0.0.1:8000/api/apartments/${apartment.id}/messages`)
                .then((response) => {
                    apartment.messages = response.data.message
                    store.messagesCounter += apartment.messages.length
                    console.log("Messaggi recuperati:", response.data.message)
                })
                .catch((error) => {
                    console.error("Errore nel recupero dei messaggi:", error)
                })
        },
    },
    mounted() {
        this.getSponsorPackages()
        this.getSponsoredApartments()
        this.getServices()
        this.getMyApartments()
    },
}
</script>

<template>
    <NavBar />
    <router-view />
</template>

<style scoped></style>
