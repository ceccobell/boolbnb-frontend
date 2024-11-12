<script>
import { store } from "../store"
import axios from "axios"
import braintree from "braintree-web"

export default {
    data() {
        return {
            store,
        }
    },
    computed: {
        apartmentToSponsor() {
            return store.apartmentToSponsor
        },
    },
    methods: {
        selectPlan(plan) {
            store.selectedPlan = plan
        },
        sponsorApartment() {
            axios
                .post("http://127.0.0.1:8000/api/sponsor-apartment", {
                    apartment_id: store.apartmentToSponsor.id,
                    package_id: store.selectedPlan.id,
                })
                .then((response) => {
                    console.log("Hai sponsorizzato l'appartamento:", store.apartmentToSponsor)
                })
                .catch((error) => {
                    console.error("Errore nella sponsor:", error)
                })
        },
    },
}
</script>

<template>
    <div
        class="modal fade"
        id="staticBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabindex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="staticBackdropLabel">
                        Sponsorizza il tuo Appartamento
                    </h1>
                    <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="container-fluid">
                        <div class="row mb-2">
                            <div
                                class="col-4"
                                v-if="
                                    apartmentToSponsor.images && apartmentToSponsor.images[0].url
                                ">
                                <img
                                    :src="apartmentToSponsor.images[0].url"
                                    class="card-img-top"
                                    alt="Property Image" />
                            </div>
                            <div class="col-8">
                                <h5 class="card-title">{{ apartmentToSponsor.title }}</h5>
                                <p class="card-text">{{ apartmentToSponsor.description }}</p>
                            </div>
                        </div>
                        <div class="row">
                            <div
                                class="col-4"
                                v-for="(plan, index) in store.sponsorPackages"
                                :key="plan.id">
                                <div
                                    class="card h-100 text-center"
                                    :class="{
                                        'border-primary':
                                            store.selectedPlan && store.selectedPlan.id === plan.id,
                                    }"
                                    @click="selectPlan(plan)">
                                    <div class="card-body">
                                        <h5 class="card-title">{{ plan.package_name }}</h5>
                                        <p class="card-text display-4">{{ plan.price }}&euro;</p>
                                        <p class="card-text">{{ plan.hours }} ore</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer justify-content-center">
                    <button type="button" class="btn" @click="sponsorApartment">
                        Procedi al pagamento
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.modal {
    --bs-modal-width: 80% !important;
    margin: 0 auto;
    z-index: 3243;
}

.card {
    cursor: pointer;
}

.btn {
    background-color: #ec622b;
    color: white;
}
</style>
