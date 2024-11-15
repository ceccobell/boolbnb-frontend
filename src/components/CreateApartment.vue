<script>
import { store } from "../store"
import axios from "axios"
import debounce from "lodash.debounce"

export default {
    data() {
        return {
            store,
            form: {
                title: "",
                property: "",
                address: "",
                description: "",
                n_rooms: 1,
                n_beds: 1,
                n_bathrooms: 1,
                square_meters: "",
                status: "Disponibile",
                main_image: null,
                images: [],
                services: [],
            },
            results: [],
            errors: {},
        }
    },
    methods: {
        // Funzione per la ricerca dell'indirizzo con debounce
        searchAddress: debounce(function () {
            if (this.form.address.length < 3) return

            axios
                .get(
                    "https://api.tomtom.com/search/2/search/" +
                        encodeURIComponent(this.form.address) +
                        ".json",
                    {
                        params: {
                            key: "Qwrc50MvZYOeJvH56v7hQrbf5HSzDfyX",
                            limit: 5,
                        },
                    }
                )
                .then((response) => {
                    this.results = response.data.results
                })
                .catch((error) => {
                    console.error("Errore nella ricerca dell'indirizzo:", error)
                })
        }, 500),
        // Seleziona l'indirizzo suggerito
        selectAddress(result) {
            this.form.address = result.address.freeformAddress
            this.results = []
        },
        // Aggiungi o rimuovi servizi dal filtro
        toggleService(service) {
            const index = this.form.services_filtered.indexOf(service.id)
            if (index === -1) {
                this.form.services_filtered.push(service.id)
            } else {
                this.form.services_filtered.splice(index, 1)
            }
        },
        validateForm() {
            this.errors = {}
            let isValid = true

            // Validazione dei campi obbligatori
            if (!this.form.title) {
                this.errors.title = "Il titolo è obbligatorio."
                isValid = false
            } else if (this.form.title.length > 255) {
                this.errors.title = "Il titolo non può superare i 255 caratteri."
                isValid = false
            }

            if (!this.form.property) {
                this.errors.property = "La proprietà è obbligatoria."
                isValid = false
            }

            if (!this.form.address) {
                this.errors.address = "L'indirizzo è obbligatorio."
                isValid = false
            }

            if (!this.form.description) {
                this.errors.description = "La descrizione è obbligatoria."
                isValid = false
            }

            // Validazione delle immagini
            if (!this.form.main_image) {
                this.errors.main_image = "L'immagine principale è obbligatoria."
                isValid = false
            } else if (!this.isValidImage(this.form.main_image)) {
                this.errors.main_image = "Devi caricare un'immagine principale valida."
                isValid = false
            }

            this.form.images.forEach((image, index) => {
                if (!this.isValidImage(image)) {
                    this.errors.images = this.errors.images || []
                    this.errors.images.push(`Immagine ${index + 1} non valida.`)
                    isValid = false
                }
            })

            // Validazione dei servizi
            if (!this.form.services || this.form.services.length < 1) {
                this.errors.services = "Devi selezionare almeno un servizio."
                isValid = false
            }

            return isValid
        },

        // Controllo validità delle immagini (jpeg, png, jpg, gif)
        isValidImage(image) {
            const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"]
            return allowedTypes.includes(image.type)
        },
        createApartment() {
            if (!this.validateForm()) {
                return // Se la validazione fallisce, non inviare il form
            }
            const formData = new FormData()
            formData.append("title", this.form.title)
            formData.append("property", this.form.property)
            formData.append("address", this.form.address)
            formData.append("description", this.form.description)
            formData.append("n_rooms", this.form.n_rooms)
            formData.append("n_beds", this.form.n_beds)
            formData.append("n_bathrooms", this.form.n_bathrooms)
            formData.append("square_meters", this.form.square_meters)
            formData.append("status", this.form.status)
            formData.append("main_image", this.form.main_image) // Immagine di copertina

            // Aggiungere ogni file di `images` individualmente
            this.form.images.forEach((image, index) => {
                formData.append(`images[${index}]`, image)
            })

            // Aggiungere ogni ID dei servizi selezionati
            this.form.services.forEach((serviceId) => {
                formData.append("services[]", serviceId)
            })
            const token = localStorage.getItem("authToken")
            axios
                .post("http://127.0.0.1:8000/api/addapartment", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((response) => {
                    console.log("Apartment created:", response.data)
                    this.errors = {}
                    this.$router.push("/myapartments")
                    location.reload()
                })
                .catch((error) => {
                    if (error.response && error.response.data.errors) {
                        this.errors = error.response.data.errors // Gestisci gli errori di validazione
                        console.error("Error creating apartment:", this.errors)
                    }
                })
        },
    },
}
</script>

<template>
    <main>
        <div class="container">
            <form @submit.prevent="createApartment">
                <div class="row">
                    <div class="mb-3 col-6">
                        <label for="title" class="form-label"
                            >Titolo annuncio <span class="text-danger">*</span></label
                        >
                        <input type="text" name="title" class="form-control" v-model="form.title" />
                        <div v-if="errors.title" class="invalid-feedback">
                            {{ errors.title }}
                        </div>
                    </div>
                    <div class="mb-3 col-6">
                        <label for="property" class="form-label"
                            >Proprietà <span class="text-danger">*</span></label
                        >
                        <input
                            type="text"
                            name="property"
                            class="form-control"
                            v-model="form.property" />
                        <div v-if="errors.property" class="invalid-feedback">
                            {{ errors.property }}
                        </div>
                    </div>
                    <div class="mb-3 col-12 position-relative">
                        <label for="address" class="form-label"
                            >Città ed indirizzo<span class="text-danger">*</span></label
                        >
                        <input
                            type="text"
                            name="address"
                            class="form-control"
                            v-model="form.address"
                            @input="searchAddress" />
                        <div v-if="errors.address" class="invalid-feedback">
                            {{ errors.address }}
                        </div>
                        <ul v-if="results.length">
                            <li
                                v-for="result in results"
                                :key="result.id"
                                @click="selectAddress(result)">
                                {{ result.address.freeformAddress }}
                            </li>
                        </ul>
                    </div>
                    <div class="mb-3">
                        <label for="description" class="form-label">Descrizione</label>
                        <textarea
                            name="description"
                            class="form-control"
                            v-model="form.description"></textarea>
                        <div v-if="errors.description" class="invalid-feedback">
                            {{ errors.description }}
                        </div>
                    </div>
                    <div class="mb-3 col-3">
                        <label for="n_rooms" class="form-label"
                            >Numero Camere <span class="text-danger">*</span></label
                        >
                        <input
                            type="number"
                            min="1"
                            name="n_rooms"
                            class="form-control"
                            v-model="form.n_rooms" />
                    </div>
                    <div class="mb-3 col-3">
                        <label for="n_beds" class="form-label"
                            >Posti letto <span class="text-danger">*</span></label
                        >
                        <input
                            type="number"
                            min="1"
                            name="n_beds"
                            class="form-control"
                            v-model="form.n_beds" />
                    </div>
                    <div class="mb-3 col-3">
                        <label for="n_bathrooms" class="form-label"
                            >Numero bagni <span class="text-danger">*</span></label
                        >
                        <input
                            type="number"
                            min="1"
                            name="n_bathrooms"
                            class="form-control"
                            v-model="form.n_bathrooms" />
                    </div>
                    <div class="mb-3 col-3">
                        <label for="square_meters" class="form-label"
                            >Metri quadri <span class="text-danger">*</span></label
                        >
                        <input
                            type="number"
                            name="square_meters"
                            class="form-control"
                            v-model="form.square_meters" />
                    </div>
                    <div class="mb-3 col-4">
                        <label for="status" class="form-label"
                            >Status <span class="text-danger">*</span></label
                        >
                        <select name="status" class="form-control" v-model="form.status">
                            <option value="Disponibile">Disponibile</option>
                            <option value="Non Disponibile">Non Disponibile</option>
                        </select>
                    </div>

                    <div class="mb-3 col-4">
                        <label for="main_image" class="form-label">Immagine Copertina</label>
                        <input
                            type="file"
                            name="main_image"
                            class="form-control"
                            @change="form.main_image = $event.target.files" />
                        <div v-if="errors.main_image" class="invalid-feedback">
                            {{ errors.main_image }}
                        </div>
                    </div>
                    <div class="mb-3 col-4">
                        <label for="image[]" class="form-label">Altre Immagini</label>
                        <input
                            type="file"
                            name="image[]"
                            class="form-control"
                            multiple
                            @change="form.images = Array.from($event.target.files)" />
                    </div>

                    <div v-if="errors.services" class="invalid-feedback mb-1">
                        {{ errors.services }}
                    </div>
                    <div
                        class="mb-2 col-3"
                        v-for="(service, index) in store.services"
                        :key="service.id">
                        <div class="form-check">
                            <input
                                type="checkbox"
                                :value="service.id"
                                class="form-check-input"
                                v-model="form.services"
                                :id="'service-' + service.id" />
                            <label class="form-check-label" :for="'service-' + service.id">
                                {{ service.service_name }} <i :class="service.service_icon"></i>
                            </label>
                        </div>
                    </div>
                </div>
                <button type="submit" class="btn btn-success text-white">Crea Appartamento</button>
            </form>
        </div>
    </main>
</template>

<style scoped>
main {
    margin-top: 120px;
}
ul {
    list-style-type: none;
    cursor: pointer;
    background-color: white;
    border-radius: 10px;
    position: absolute;
    width: 100%;
}

li {
    padding: 5px;
    border-bottom: 1px solid #ccc;
}

.invalid-feedback {
    display: block;
    color: red;
    font-size: 0.875em;
}
</style>
