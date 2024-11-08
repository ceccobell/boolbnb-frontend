<template>
    <div class="card" style="width: 18rem">
        <!-- <img :src="imageUrl" class="card-img-top" alt="Property Image" /> -->
        <div class="card-body">
            <h5 class="card-title">{{ apartment.title }}</h5>
            <p class="card-text">{{ apartment.description }}</p>
            <ul>
                <li><strong>Rooms:</strong> {{ apartment.n_rooms }}</li>
                <li><strong>Beds:</strong> {{ apartment.n_beds }}</li>
            </ul>
            <a href="#" class="btn btn-primary">More Info</a>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        apartment: Object,
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
