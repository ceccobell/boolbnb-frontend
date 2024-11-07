<script>
import axios from "axios"
import debounce from "lodash.debounce"

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
        searchApartments() {
            if (this.searchParams.address.length) {
                axios
                    .get("http://127.0.0.1:8000/api/search-apartments", {
                        params: this.searchParams,
                    })
                    .then((response) => {
                        this.apartments = response.data
                        console.log("Risultati ricerca:", this.apartments)
                    })
                    .catch((error) => {
                        console.error("Errore nella ricerca degli appartamenti:", error)
                    })
            } else {
                console.error("Inserisci un indirizzo")
            }
        },
        getServices() {
            axios
                .get("http://127.0.0.1:8000/api/services")
                .then((response) => {
                    this.services = response.data
                })
                .catch((error) => {
                    console.error("error:", error.response.data)
                })
        },
        searchAddress: debounce(function () {
            if (this.searchParams.address.length < 3) return // Evita ricerche troppo brevi

            axios
                .get(
                    "https://api.tomtom.com/search/2/search/" +
                        encodeURIComponent(this.searchParams.address) +
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
        }, 500), // Imposta il debounce a 500ms (mezzo secondo)
        selectAddress(result) {
            this.searchParams.address = result.address.freeformAddress
            this.results = []
        },
        toggleService(service) {
            const index = this.searchParams.services_filtered.indexOf(service.id)
            if (index === -1) {
                // Se il servizio non è già selezionato, aggiungilo
                this.searchParams.services_filtered.push(service.id)
            } else {
                // Se il servizio è già selezionato, rimuovilo
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
                v-model="searchParams.address" />
        </div>
        <ul v-if="results.length">
            <li v-for="result in results" :key="result.id" @click="selectAddress(result)">
                {{ result.address.freeformAddress }}
            </li>
        </ul>
    </div>
    <div class="col-3">
        <div class="input-group">
            <span class="input-group-text bg-light">
                <i class="fa-solid fa-house"></i>
            </span>
            <select class="form-select" v-model="searchParams.min_rooms">
                <option v-for="num in [1, 2, 3, 4, 5]" :key="num" :value="num">
                    {{ num }} Rooms
                </option>
            </select>
        </div>
    </div>
    <div class="col-3">
        <div class="input-group">
            <span class="input-group-text bg-light">
                <i class="fa-solid fa-bed"></i>
            </span>
            <select class="form-select" v-model="searchParams.min_beds">
                <option v-for="num in [1, 2, 3, 4, 5]" :key="num" :value="num">
                    {{ num }} Beds
                </option>
            </select>
        </div>
    </div>
    <div class="col-3">
        <button class="btn bg-pink text-white w-100" @click="searchApartments">
            <i class="fa-solid fa-magnifying-glass"></i> Search
        </button>
    </div>
    <div class="mt-3 d-flex flex-wrap justify-content-start align-items-center gap-4">
        <div class="col-1 form-check form-switch" v-for="(service, index) in services" :key="index">
            <input
                class="form-check-input"
                type="checkbox"
                :checked="searchParams.services_filtered.includes(service.id)"
                @change="toggleService(service)" />
            <label class="form-check-label">
                <i :class="`${service.service_icon} me-1`"></i> {{ service.service_name }}
            </label>
        </div>

        <div class="col-12 mt-4">
            <label for="radius" class="form-label"
                >Raggio di ricerca: {{ searchParams.radius }} km</label
            >
            <input
                id="radius"
                type="range"
                class="form-range w-50"
                v-model="searchParams.radius"
                min="0"
                max="100"
                step="1" />
        </div>
        <div v-if="apartments.length" class="mt-4">
            <h3>Risultati della ricerca:</h3>
            <div class="row">
                <div
                    class="col-12 col-sm-6 col-md-4 col-lg-3"
                    v-for="apartment in apartments"
                    :key="apartment.id">
                    <div class="card">
                        <img
                            v-if="apartment.image"
                            :src="apartment.image"
                            class="card-img-top"
                            alt="Apartment Image" />
                        <div class="card-body">
                            <h5 class="card-title">{{ apartment.title }}</h5>
                            <p class="card-text">Location: {{ apartment.city }}</p>
                            <p class="card-text">Rooms: {{ apartment.rooms }}</p>
                            <p class="card-text">Beds: {{ apartment.beds }}</p>
                            <div class="d-flex justify-content-between">
                                <button class="btn btn-primary">View Details</button>
                                <button class="btn btn-secondary">Contact</button>
                            </div>
                        </div>
                    </div>
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
</style>
