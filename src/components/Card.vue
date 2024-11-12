<template>
    <div class="card" @click="goToApartmentDetails(apartment)">
        <img v-if="apartment.images.length > 0 && apartment.images[0].url" :src="apartment.images[0].url"
            class="card-img-top" alt="Property Image" />
        <div class="card-body">
            <h5 class="card-title">{{ apartment.title }}</h5>
            <p class="card-text">{{ apartment.description }}</p>
            <ul>
                <li><strong>Rooms:</strong> {{ apartment.n_rooms }}</li>
                <li><strong>Beds:</strong> {{ apartment.n_beds }}</li>
            </ul>
        </div>
        <button v-if="showSponsorButton" type="button" class="btn position-absolute top-0 end-0 m-2"
            @click="sponsor(apartment)" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
            <i class="fa-solid fa-crown"></i> Sponsor
        </button>
    </div>
</template>

<script>
import { store } from "../store"
export default {
    props: {
        apartment: Object,
        showSponsorButton: Boolean,
    },
    data() {
        return {
            store,
        }
    },

    methods: {
        sponsor(apartment) {
            store.apartmentToSponsor = apartment
        },
        goToApartmentDetails(apartment) {
            store.currentApartment = apartment
            this.$router.push({ name: "ApartmentDetails", params: { slug: apartment.slug } })
        },
    },
}
</script>

<style scoped>
.card {
    margin: 15px;
    cursor: pointer;
    transition: transform 0.3s ease;
}

.card:hover {
    transform: scale(1.05);
}

.card-img-top {
    height: 200px;
    object-fit: cover;
}

.btn {
    background-color: #ec622b;
    color: white;
}
</style>
