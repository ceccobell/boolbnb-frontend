<script>
import axios from "axios"
import Card from "./Card.vue"
import { store } from "../store"
import SponsorModal from "./SponsorModal.vue"
import CreateApartment from "./CreateApartment.vue"

export default {
    components: {
        Card,
        SponsorModal,
        CreateApartment,
    },
    data() {
        return {
            store,
        }
    },
}
</script>

<template>
    <main>
        <div class="container">
            <div class="row">
                <div class="col-12 mt-4">
                    <router-link to="/create-apartment"
                        ><button class="btn btn-primary">
                            Aggiungi un Appartamento
                        </button></router-link
                    >
                </div>
                <div class="col-4" v-for="(myApartment, index) in store.myApartments" :key="index">
                    <Card :apartment="myApartment" :showSponsorButton="true" />
                </div>
            </div>
            <SponsorModal />
        </div>
    </main>
</template>

<style scoped>
main {
    height: calc(100vh - 75px);
    margin-top: 75px;
}
</style>
