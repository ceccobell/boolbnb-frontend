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
        getSponsorPackages() {
            axios
                .get("http://127.0.0.1:8000/api/packages")
                .then((response) => {
                    store.sponsorPackages = response.data.packages
                })
                .catch((error) => {
                    console.error("Errore nel recupero dei pacchetti di sponsorizzazione:", error)
                })
        },
    },
    mounted() {
        this.getSponsorPackages()
    },
}
</script>

<template>
    <NavBar />
    <router-view />
</template>

<style scoped></style>
