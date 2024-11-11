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
            apartments_filtered: [],
            store,
        }
    },
    methods: {
        handleApartments(apartments) {
            console.log("Dati degli appartamenti:", apartments)
            this.apartments_filtered = apartments
        },
    },
}
</script>

<template>
    <main>
        <div class="container">
            <div class="row g-3">
                <ApartmentSearch @getApartments="handleApartments" />
            </div>
        </div>
    </main>
    <div class="container" v-if="store.apartmentsSponsored.length > 0">
        <div class="row">
            <div class="col-12">
                <h1>Appartamenti in primo piano</h1>
            </div>
            <div class="col-4" v-for="(apartmentSponsored, index) in store.apartmentsSponsored">
                <Card :apartment="apartmentSponsored" :showSponsorButton="false" />
            </div>
        </div>
    </div>
    <div class="container">
        <div class="row">
            <div class="col-4" v-for="(apartment, index) in apartments_filtered" :key="index">
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
