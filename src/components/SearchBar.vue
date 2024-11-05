<template>
    <div class="col-3 position-relative">
        <div class="input-group">
            <span class="input-group-text" id="basic-addon1"
                ><i class="fa-solid fa-location-dot"></i
            ></span>
            <input
                type="text"
                class="form-control"
                placeholder="Enter city"
                @input="searchAddress"
                v-model="query" />
        </div>
        <ul v-if="results.length">
            <li v-for="result in results" :key="result.id" @click="selectAddress(result)">
                {{ result.address.freeformAddress }}
            </li>
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
        selectAddress(result) {
            this.query = result.address.freeformAddress
            this.results = []
        },
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
                    console.log(this.results)
                })
                .catch((error) => {
                    console.error("Errore nella ricerca:", error)
                })
        },
    },
}
</script>

<style scoped>
ul {
    list-style-type: none;
    cursor: pointer;
    background-color: white;
    border-radius: 10px;
    position: absolute;
}

li {
    padding: 5px;
    border-bottom: 1px solid #ccc;
}

li:hover {
    background-color: rgb(221, 221, 221);
}
</style>
