<script>
import SearchBar from "./SearchBar.vue"

export default {
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
                </div>
                <div class="mt-3 d-flex justify-content-start align-items-center gap-4">
                    <div class="form-check form-switch custom-checkbox">
                        <input
                            class="form-check-input"
                            type="checkbox"
                            v-model="searchParams.wifi" />
                        <label class="form-check-label custom-icon">
                            <i class="fa-solid fa-wifi me-1"></i> WiFi
                        </label>
                    </div>
                    <div class="form-check form-switch custom-checkbox">
                        <input
                            class="form-check-input"
                            type="checkbox"
                            v-model="searchParams.pool" />
                        <label class="form-check-label">
                            <i class="fa-solid fa-person-swimming me-1 custom-icon"></i> Pool
                        </label>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<style lang="scss"scoped>
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

.custom-checkbox .form-check-input:checked {
    background-color: rgb(239, 106, 157);
    border-color: rgb(239, 106, 157);
    box-shadow: 0 0 0 0.25rem rgb(239 106 157 / 25%);
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3e%3ccircle r='3' fill='rgba%0, 0, 0, 1%29'/%3e%3c/svg%3e");
}

.custom-checkbox .form-check-input:focus{
    border-color: rgb(239, 106, 157);
    box-shadow: 0 0 0 0.25rem rgb(239 106 157 / 25%);
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3e%3ccircle r='3' fill='rgba%0, 0, 0, 1%29'/%3e%3c/svg%3e");
}

.custom-checkbox .form-check-input:checked + .custom-icon {
    color: #EC622B;
}

.custom-checkbox .form-check-input:checked + .form-check-label .custom-icon {
    color: #EC622B;
}
</style>
