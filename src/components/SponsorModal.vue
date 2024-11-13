<script>
import { store } from "../store";
import axios from "axios";

export default {
    data() {
        return {
            store,
        };
    },
    computed: {
        apartmentToSponsor() {
            return store.apartmentToSponsor;
        },
        selectedPlanDetails() {
            return this.store.sponsorPackages.find(plan => plan.id === this.store.selectedPlan?.id) || {};
        },
    },
    methods: {
        openModal() {
            this.resetSelectedPlan();
        },
        resetSelectedPlan() {
            store.selectedPlan = { id: null };
        },
        onPlanChange(event) {
            const selectedPlanId = parseInt(event.target.value);
            const selectedPlan = this.store.sponsorPackages.find(plan => plan.id === selectedPlanId);
            this.store.selectedPlan = selectedPlan || { id: null };
        },
        sponsorApartment() {
            if (!store.selectedPlan || !store.selectedPlan.id) {
                console.error("Nessun piano selezionato. Seleziona un piano prima di procedere.");
                return;
            }
            axios
                .post("http://127.0.0.1:8000/api/sponsor-apartment", {
                    apartment_id: store.apartmentToSponsor.id,
                    package_id: store.selectedPlan.id,
                })
                .then((response) => {
                    console.log("Hai sponsorizzato l'appartamento:", store.apartmentToSponsor);
                })
                .catch((error) => {
                    console.error("Errore nella sponsor:", error);
                });
        },
    },
};
</script>




<template>
    <div
        class="modal fade"
        id="staticBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabindex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
        @shown.bs.modal="openModal">
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
                                v-if="apartmentToSponsor.images && apartmentToSponsor.images[0].url">
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

                        <!-- Dropdown di selezione del piano -->
                        <div class="row mb-3">
                            <div class="col">
                                <label for="planSelect">Seleziona il Piano di Sponsorizzazione</label>
                                <select
                                    id="planSelect"
                                    class="form-select"
                                    v-model="store.selectedPlan.id"
                                    @change="onPlanChange">
                                    <option value="" disabled>Seleziona un piano</option>
                                    <option
                                        v-for="plan in store.sponsorPackages"
                                        :key="plan.id"
                                        :value="plan.id">
                                        {{ plan.package_name }} - {{ plan.price }}€
                                    </option>
                                </select>
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

.btn {
    background-color: #ec622b;
    color: white;
}
</style>



