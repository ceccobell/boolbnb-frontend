<script>
import { store } from "../store"
import axios from "axios"
import dropin from 'braintree-web-drop-in'

export default {
    data() {
        return {
            store,
            loading: true,
            braintreeInstance: null,
        }
    },
    computed: {
        apartmentToSponsor() {
            return store.apartmentToSponsor
        },
        selectedPlanDetails() {
            return (
                this.store.sponsorPackages.find(
                    (plan) => plan.id === this.store.selectedPlan?.id
                ) || {}
            )
        },
    },
    methods: {
        async openModal() {
            this.resetSelectedPlan()
            await this.initializeBraintree()
        },
        resetSelectedPlan() {
            store.selectedPlan = { id: null }
        },
        onPlanChange(event) {
            const selectedPlanId = parseInt(event.target.value)
            const selectedPlan = this.store.sponsorPackages.find(
                (plan) => plan.id === selectedPlanId
            )
            this.store.selectedPlan = selectedPlan || { id: null }
        },
        async initializeBraintree() {
            try {
                const response = await axios.get("http://127.0.0.1:8000/api/braintree/token")
                const token = response.data.token

                if (this.braintreeInstance) {
                    await this.braintreeInstance.teardown()
                }

                this.braintreeInstance = await dropin.create({
                    authorization: token,
                    container: '#dropin-container',
                    card: {
                        vault: {
                            allowVaulting: false
                        }
                    },
                    paypal: {
                        flow: 'checkout',
                        amount: this.selectedPlanDetails.price,
                        currency: 'EUR'
                    }
                })

                this.loading = false
            } catch (error) {
                console.error("Errore inizializzazione Braintree:", error)
                this.loading = false
            }
        },
        async sponsorApartment() {
            if (!store.selectedPlan || !store.selectedPlan.id) {
                alert("Seleziona un piano prima di procedere")
                return
            }

            try {
                this.loading = true

                const { nonce } = await this.braintreeInstance.requestPaymentMethod()

                const response = await axios.post("http://127.0.0.1:8000/api/braintree/payment", {
                    payment_method_nonce: nonce,
                    amount: this.selectedPlanDetails.price,
                    apartment_id: store.apartmentToSponsor.id,
                    package_id: store.selectedPlan.id
                })

                if (response.data.success) {
                    alert("Sponsorizzazione attivata con successo!")
                    const modal = document.getElementById('staticBackdrop')
                    const bootstrapModal = bootstrap.Modal.getInstance(modal)
                    bootstrapModal.hide()
                    location.reload()
                } else {
                    alert("Errore durante il pagamento: " + response.data.message)
                }
            } catch (error) {
                console.error("Errore durante il pagamento:", error)
                alert("Errore durante il pagamento. Riprova.")
            } finally {
                this.loading = false
            }
        },
    },
    mounted() {
        const modal = document.getElementById('staticBackdrop')
        modal.addEventListener('shown.bs.modal', this.openModal)
    },
    beforeDestroy() {
        const modal = document.getElementById('staticBackdrop')
        modal.removeEventListener('shown.bs.modal', this.openModal)
        if (this.braintreeInstance) {
            this.braintreeInstance.teardown()
        }
    }
}
</script>

<template>
    <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="staticBackdropLabel">
                        Sponsorizza il tuo Appartamento
                    </h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="container-fluid">
                        <div class="row mb-2">
                            <div class="col-4" v-if="
                                apartmentToSponsor.images && apartmentToSponsor.images[0].url
                            ">
                                <img :src="apartmentToSponsor.images[0].url" class="card-img-top"
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
                                <select id="planSelect" class="form-select" v-model="store.selectedPlan.id"
                                    @change="onPlanChange">
                                    <option value="" disabled>Seleziona un piano</option>
                                    <option v-for="plan in store.sponsorPackages" :key="plan.id" :value="plan.id">
                                        {{ plan.package_name }} - {{ plan.price }}€
                                    </option>
                                </select>
                            </div>
                        </div>

                        <!-- Form di pagamento Braintree -->
                        <div class="row mb-3">
                            <div class="col">
                                <div v-if="loading" class="text-center">
                                    Caricamento form di pagamento...
                                </div>
                                <div id="dropin-container"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer justify-content-center">
                    <button type="button" class="btn" @click="sponsorApartment" :disabled="loading">
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
    margin-top: 120px;
}

.btn {
    background-color: #ec622b;
    color: white;
}

#dropin-container {
    min-height: 100px;
}
</style>
