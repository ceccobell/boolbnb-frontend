<template>
    <div>
        <input
            type="text"
            v-model="query"
            @input="searchAddress"
            placeholder="Inserisci indirizzo..."
            class="form-control" />
        <ul v-if="results.length">
            <li v-for="result in results" :key="result.id">{{ result.address.freeformAddress }}</li>
        </ul>
    </div>
</template>

<script>
import axios from "axios"

export default {
    data() {
        return {
            query: "",
            results: [],
        }
    },
    methods: {
        searchAddress() {
            // Esegui la ricerca solo se il campo non è vuoto
            if (this.query.length < 3) return

            // Fai la chiamata API a TomTom
            axios
                .get(
                    "https://api.tomtom.com/search/2/search/" +
                        encodeURIComponent(this.query) +
                        ".json",
                    {
                        params: {
                            key: "Qwrc50MvZYOeJvH56v7hQrbf5HSzDfyX",
                            limit: 5, // Limita i risultati a 5
                        },
                    }
                )
                .then((response) => {
                    this.results = response.data.results
                })
                .catch((error) => {
                    console.error("Errore nella ricerca:", error)
                })
        },
    },
}
</script>

<style scoped>
/* Stili opzionali */
.form-control {
    width: 50%;
    padding: 10px;
    margin-top: 20px;
}

ul {
    list-style-type: none;
    width: 50%;
    cursor: pointer;
}

li {
    padding: 5px;
    border-bottom: 1px solid #ccc;
}
</style>
