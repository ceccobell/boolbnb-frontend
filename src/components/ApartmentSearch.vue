<script>
import axios from "axios";
import SearchBar from "./SearchBar.vue";

export default {
    name: "ApartmentSearch",
    components: {
        SearchBar,
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
            apartments: [],
        };
    },
    methods: {
        async search() {
            try {
                const response = await axios.get("/search-apartments", {
                    params: this.searchParams,
                });
                this.apartments = response.data;
                console.log("Risultati ricerca:", this.apartments);
            } catch (error) {
                console.error("Errore nella ricerca degli appartamenti:", error);
            }
        },
    },
};
</script>

<template>
    <div class="col-3">
        <div class="input-group">
            <span class="input-group-text bg-light">
                <i class="fa-solid fa-house"></i>
            </span>
            <select class="form-select" v-model="searchParams.rooms">
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
            <select class="form-select" v-model="searchParams.beds">
                <option v-for="num in [1, 2, 3, 4, 5]" :key="num" :value="num">
                    {{ num }} Beds
                </option>
            </select>
        </div>
    </div>
    <div class="col-3">
        <button class="btn bg-pink text-white w-100" @click="search">
            <i class="fa-solid fa-magnifying-glass"></i> Search
        </button>
    </div>
    <div class="mt-3 d-flex justify-content-start align-items-center gap-4">
        <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" v-model="searchParams.wifi" />
            <label class="form-check-label">
                <i class="fa-solid fa-wifi me-1"></i> WiFi
            </label>
        </div>
        <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" v-model="searchParams.pool" />
            <label class="form-check-label">
                <i class="fa-solid fa-person-swimming me-1"></i> Pool
            </label>
        </div>
        <div class="col-12 mt-4">
            <label for="radius" class="form-label">Raggio di ricerca: {{ searchParams.radius }} km</label>
            <input id="radius" type="range" class="form-range w-50" v-model="searchParams.radius" min="0" max="100"
                step="1" />
        </div>
        <div v-if="apartments.length" class="mt-4">
            <h3>Risultati della ricerca:</h3>
            <div class="row">
                <div class="col-12 col-sm-6 col-md-4 col-lg-3" v-for="apartment in apartments" :key="apartment.id">
                    <div class="card">
                        <img v-if="apartment.image" :src="apartment.image" class="card-img-top" alt="Apartment Image" />
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
