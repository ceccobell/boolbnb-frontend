<template>
    <div class="card" style="width: 18rem;">
        <img :src="imageUrl" class="card-img-top" alt="Property Image" />
        <div class="card-body">
            <h5 class="card-title">{{ title }}</h5>
            <p class="card-text">{{ description }}</p>
            <ul>
                <li><strong>Rooms:</strong> {{ rooms }}</li>
                <li><strong>Beds:</strong> {{ beds }}</li>
                <li v-if="wifi"><strong>WiFi:</strong> Available</li>
                <li v-if="pool"><strong>Pool:</strong> Available</li>
            </ul>
            <a href="#" class="btn btn-primary">More Info</a>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        imageUrl: String,
        title: String,
        description: String,
        rooms: Number,
        beds: Number,
        wifi: Boolean,
        pool: Boolean,
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