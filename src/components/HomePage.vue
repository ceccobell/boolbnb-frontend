<script>
import SearchBar from "./SearchBar.vue"
import ApartmentSearch from "./ApartmentSearch.vue";

export default {
    components: {
        SearchBar,
        ApartmentSearch
    },
    data() {
        return {
            searchParams: {
                city: "",
                rooms: 1,
                beds: 1,
                wifi: false,
                pool: false,
            },
        }
    },
    methods: {
        search() {
            // Aggiungi qui la logica per effettuare la ricerca con i parametri
            console.log("Searching with:", this.searchParams)
        },
    },
}
</script>

<template>
    <main>
        <div class="container">
            <div class="bg-white rounded-3 shadow p-4">
                <div class="row g-3">
                    <SearchBar />
                    <ApartmentSearch />
                </div>
            </div>
        </div>
    </main>
</template>

<style scoped>
main {
    height: calc(100vh - 75px);
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
