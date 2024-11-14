<script>
import ApartmentSearch from "./ApartmentSearch.vue"
import Card from "./Card.vue"
import { store } from "../store"

export default {
    components: {
        ApartmentSearch,
        Card,
    },
    data() {
        return {
            apartments_filtered: store.filteredApartments, // Usa direttamente gli appartamenti filtrati dal store
            store,
        }
    },
    methods: {
        handleApartments(apartments) {
            console.log("Dati degli appartamenti:", apartments)
            this.apartments_filtered = apartments
            store.filteredApartments = apartments // Salva gli appartamenti filtrati nel store
        },
    },
    mounted() {
        // Quando la pagina viene caricata, usa gli appartamenti già filtrati
        if (store.filteredApartments.length > 0) {
            this.apartments_filtered = store.filteredApartments
        }
    }
}
</script>

<template>
    <main>
        <div class="container">
            <div class="row g-3">
                <!-- Componente di ricerca appartamenti -->
                <ApartmentSearch @getApartments="handleApartments" />
            </div>
        </div>
    </main>

    <!-- Sezione appartamenti sponsorizzati -->
    <div class="container" v-if="store.apartmentsSponsored.length > 0">
        <div class="row">
            <div class="col-12">
                <h1>Appartamenti in Evidenza</h1>
            </div>
            <div class="col-4" v-for="(apartmentSponsored, index) in store.apartmentsSponsored" :key="index">
                <Card :apartment="apartmentSponsored" :showSponsorButton="false" />
            </div>
        </div>
    </div>

    <!-- Sezione appartamenti filtrati -->
    <div class="container-fluid">
        <div class="row justify-content-center">
            <h1 class="text-center mt-3">Appartamenti Disponibili</h1>
            <div class="col-xxl-3 col-lg-4 col-md-6 col-sm-12" v-for="(apartment, index) in apartments_filtered"
                :key="index">
                <Card :apartment="apartment" :showSponsorButton="false" />
            </div>
        </div>
    </div>
</template>

<style scoped>
main {
    height: calc(70vh - 75px);
    margin-top: 75px;
    background-image: url(https://images.unsplash.com/photo-1545324418-cc1a3fa10c00);
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
