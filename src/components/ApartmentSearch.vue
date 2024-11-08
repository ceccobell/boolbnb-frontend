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
                        this.$emit("getApartments", this.apartments)
                        console.log("Risultati ricerca:", response.data)
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
    <div class="container">
        <div class="bg-white rounded-3 shadow p-4">
            <div class="row g-3">
                <div class="col-3 position-relative">
                    <div class="input-group">
                        <span class="input-group-text" id="basic-addon1"
                            ><i class="fa-solid fa-location-dot"></i
                        ></span>
                        <input
                            type="text"
                            class="form-control custom-select"
                            placeholder="Enter city"
                            @input="searchAddress"
                            v-model="searchParams.address" />
                    </div>
                    <ul v-if="results.length">
                        <li
                            v-for="result in results"
                            :key="result.id"
                            @click="selectAddress(result)">
                            {{ result.address.freeformAddress }}
                        </li>
                    </ul>
                </div>
                <div class="col-3">
                    <div class="input-group">
                        <span class="input-group-text bg-light">
                            <i class="fa-solid fa-house"></i>
                        </span>
                        <select class="form-select custom-select" v-model="searchParams.min_rooms">
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
                        <select class="form-select custom-select" v-model="searchParams.min_beds">
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
                <div class="mt-4 d-flex flex-wrap justify-content-start align-items-center gap-4">
                    <div
                        class="col-2 form-check form-switch custom-checkbox"
                        v-for="(service, index) in services"
                        :key="index">
                        <input
                            class="form-check-input"
                            type="checkbox"
                            :checked="searchParams.services_filtered.includes(service.id)"
                            @change="toggleService(service)" />
                        <label class="form-check-label">
                            <i :class="`${service.service_icon} me-1 ms-1 custom-icon`"></i>
                            {{ service.service_name }}
                        </label>
                    </div>

                    <div class="col-12 mt-4">
                        <div class="mb-3">
                            <label for="radius" class="form-label d-block">
                                <i class="fa-solid fa-route me-2"></i>
                                Raggio di ricerca: <span class="radius-value">{{ searchParams.radius }}</span> km
                            </label>
                            <input
                                type="range"
                                class="form-range w-50"
                                id="radius"
                                v-model="searchParams.radius"
                                min="0"
                                max="100"
                                step="1"
                            />
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

.custom-checkbox .form-check-input:checked + .form-check-label {
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
</style>
