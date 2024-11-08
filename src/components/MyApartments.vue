<script>
import axios from "axios"
import Card from "./Card.vue"

export default {
    components: {
        Card,
    },
    data() {
        return {
            myApartments: [],
        }
    },
    methods: {
        getMyApartments() {
            const token = localStorage.getItem("authToken")
            console.log(token)

            axios
                .get("http://127.0.0.1:8000/api/myapartments", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((response) => {
                    console.log(response.data)
                    this.myApartments = response.data.apartments
                })
                .catch((error) => {
                    console.error("Errore nel recupero dei tuoi appartamenti:", error)
                })
        },
    },
    mounted() {
        this.getMyApartments()
    },
}
</script>

<template>
    <main>
        <div class="container">
            <div class="row">
                <div class="col-4" v-for="(myApartment, index) in myApartments" :key="index">
                    <Card :apartment="myApartment" />
                </div>
            </div>
        </div>
    </main>
</template>

<style scoped>
main {
    height: calc(100vh - 75px);
    margin-top: 75px;
}
</style>
