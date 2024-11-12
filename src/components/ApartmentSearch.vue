<script>
import axios from "axios"
import debounce from "lodash.debounce"
import { store } from "../store"

export default {
    data() {
        return {
            searchParams: {
                address: "",
                radius: 20,
                min_rooms: 1,
                min_beds: 1,
                services_filtered: [],
            },
            apartments: [],
            results: [],
            services: [],
        }
    },
    methods: {
        // Funzione per eseguire la ricerca degli appartamenti
        searchApartments() {
            if (this.searchParams.address.length) {
                axios
                    .get("http://127.0.0.1:8000/api/search-apartments", {
                        params: this.searchParams,
                    })
                    .then((response) => {
                        this.apartments = response.data
                        // Salva i dati filtrati nel store
                        store.filteredApartments = this.apartments
                        this.$emit("getApartments", this.apartments) // Passa i dati al componente principale
                        console.log("Risultati ricerca:", response.data)
                    })
                    .catch((error) => {
                        console.error("Errore nella ricerca degli appartamenti:", error)
                    })
            } else {
                console.error("Inserisci un indirizzo")
            }
        },
        // Funzione per ottenere i servizi
        getServices() {
            axios
                .get("http://127.0.0.1:8000/api/services")
                .then((response) => {
                    this.services = response.data
                })
                .catch((error) => {
                    console.error("Errore nel recupero dei servizi:", error.response.data)
                })
        },
        // Funzione per la ricerca dell'indirizzo con debounce
        searchAddress: debounce(function () {
            if (this.searchParams.address.length < 3) return

            axios
                .get(
                    "https://api.tomtom.com/search/2/search/" +
                    encodeURIComponent(this.searchParams.address) +
                    ".json",
                    {
                        params: {
                            key: "Qwrc50MvZYOeJvH56v7hQrbf5HSzDfyX",
                            limit: 5,
                        },
                    }
                )
                .then((response) => {
                    this.results = response.data.results
                })
                .catch((error) => {
                    console.error("Errore nella ricerca dell'indirizzo:", error)
                })
        }, 500),
        // Seleziona l'indirizzo suggerito
        selectAddress(result) {
            this.searchParams.address = result.address.freeformAddress
            this.results = []
        },
        // Aggiungi o rimuovi servizi dal filtro
        toggleService(service) {
            const index = this.searchParams.services_filtered.indexOf(service.id)
            if (index === -1) {
                this.searchParams.services_filtered.push(service.id)
            } else {
                this.searchParams.services_filtered.splice(index, 1)
            }
        },
    },
    mounted() {
        this.getServices()
    },
}
</script>

<template>
    <div class="container">
        <div class="bg-white rounded-3 shadow p-4">
            <div class="row g-3">
                <!-- Input per l'indirizzo -->
                <div class="col-3 position-relative">
                    <div class="input-group">
                        <span class="input-group-text" id="basic-addon1"><i class="fa-solid fa-location-dot"></i></span>
                        <input type="text" class="form-control custom-select" placeholder="Enter city"
                            @input="searchAddress" v-model="searchParams.address" />
                    </div>
                    <ul v-if="results.length">
                        <li v-for="result in results" :key="result.id" @click="selectAddress(result)">
                            {{ result.address.freeformAddress }}
                        </li>
                    </ul>
                </div>

                <!-- Filtri per camere e letti -->
                <div class="col-3">
                    <div class="input-group">
                        <span class="input-group-text bg-light">
                            <i class="fa-solid fa-house"></i>
                        </span>
                        <select class="form-select custom-select" v-model="searchParams.min_rooms">
                            <option v-for="num in [1, 2, 3, 4, 5]" :key="num" :value="num">
                                {{ num }} Camere
                            </option>
                        </select>
                    </div>
                </div>
                <div class="col-3">
                    <div class="input-group">
                        <span class="input-group-text bg-light">
                            <i class="fa-solid fa-bed"></i>
                        </span>
                        <select class="form-select custom-select" v-model="searchParams.min_beds">
                            <option v-for="num in [1, 2, 3, 4, 5]" :key="num" :value="num">
                                {{ num }} Letti
                            </option>
                        </select>
                    </div>
                </div>

                <!-- Bottone per avviare la ricerca -->
                <div class="col-3">
                    <button class="btn btn-search-custom w-100" @click="searchApartments">
                        <i class="fa-solid fa-magnifying-glass"></i> Search
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>


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

.custom-checkbox .form-check-input:checked {
    background-color: rgb(239, 106, 157);
    border-color: rgb(239, 106, 157);
    box-shadow: 0 0 0 0.25rem rgb(239 106 157 / 25%);
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3e%3ccircle r='3' fill='rgba%0, 0, 0, 1%29'/%3e%3c/svg%3e");
}

.custom-checkbox .form-check-input:focus {
    border-color: rgb(239, 106, 157);
    box-shadow: 0 0 0 0.25rem rgb(239 106 157 / 25%);
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3e%3ccircle r='3' fill='rgba%0, 0, 0, 1%29'/%3e%3c/svg%3e");
}

.custom-checkbox .form-check-input:checked+.form-check-label {
    color: #ec622b;
}

.custom-input:focus {
    border-color: rgb(239, 106, 157);
    box-shadow: 0 0 0 0.25rem rgb(239 106 157 / 25%);
}

.custom-select:focus {
    border-color: rgb(239, 106, 157);
    box-shadow: 0 0 0 0.25rem rgb(239 106 157 / 25%);
}

.custom-range {
    accent-color: rgb(239, 106, 157);
}

.radius-value {
    font-weight: bold;
    color: #ec622b;
}

.btn-collapse-custom {
    background-color: rgb(239, 106, 157);
    color: white;
}

.btn-collapse-custom:hover {
    background-color: rgb(239 106 157 / 50%);
    color: black;
}

.btn-search-custom {
    background-color: rgb(239, 106, 157);
    color: white;
}

.btn-search-custom:hover {
    background-color: #d8598a;
    color: white;
}

.btn-collapse-custom[aria-expanded="true"] {
    background-color: #ec622b;
    color: black;

    &:hover {
        background-color: #cf5626;
        color: white;
    }
}
</style>
