<template>
    <div class="card">
        <img
            v-if="apartment.images.length > 0 && apartment.images[0].url"
            :src="apartment.images[0].url"
            class="card-img-top"
            alt="Property Image" />
        <div class="card-body">
            <h5 class="card-title">{{ apartment.title }}</h5>
            <p class="card-text">{{ apartment.description }}</p>
            <ul>
                <li><strong>Rooms:</strong> {{ apartment.n_rooms }}</li>
                <li><strong>Beds:</strong> {{ apartment.n_beds }}</li>
            </ul>
            <a href="#" class="btn btn-primary">More Info</a>
        </div>
        <button
            type="button"
            class="btn btn-warning position-absolute top-0 end-0 m-2"
            @click="sponsor(apartment)">
            <i class="fa-solid fa-crown"></i> Sponsor
        </button>
    </div>
</template>

<script>
export default {
    props: {
        apartment: Object,
    },
    methods: {
        sponsor(apartment) {},
    },
}
</script>

<style scoped>
.card {
    margin: 15px;
}

.card-img-top {
    height: 200px;
    object-fit: cover;
}
</style>
