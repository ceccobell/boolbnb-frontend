<script>
import ApartmentSearch from "./ApartmentSearch.vue"

export default {
    components: {
        ApartmentSearch,
    },
    methods: {},
}
</script>

<template>
    <main>
        <div class="container">
            <div class="bg-white rounded-3 shadow p-4">
                <div class="row g-3">
                    <ApartmentSearch />
                </div>
            </div>
        </div>
    </main>
</template>

<style scoped>
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
</style>
