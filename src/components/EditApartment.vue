<script>
import { store } from "../store"
import axios from "axios"
import debounce from "lodash.debounce"

export default {
    data() {
        return {
            store,
            form: {
                title: store.currentApartment.title,
                property: store.currentApartment.property,
                address: store.currentApartment.address,
                description: store.currentApartment.description,
                n_rooms: store.currentApartment.n_rooms,
                n_beds: store.currentApartment.n_beds,
                n_bathrooms: store.currentApartment.n_bathrooms,
                square_meters: store.currentApartment.square_meters,
                status: store.currentApartment.status,
                main_image: store.currentApartment.main_image,
                images: store.currentApartment.images,
                services: store.currentApartment.services,
            },
            results: [],
            errors: {},
        }
    },
    watch: {
        // Watcher che monitora i cambiamenti di store.currentApartment
        "store.currentApartment": {
            handler(newValue) {
                // Aggiorna form con i nuovi valori
                this.form = {
                    title: newValue.title,
                    property: newValue.property,
                    address: newValue.address,
                    description: newValue.description,
                    n_rooms: newValue.n_rooms,
                    n_beds: newValue.n_beds,
                    n_bathrooms: newValue.n_bathrooms,
                    square_meters: newValue.square_meters,
                    status: newValue.status,
                    main_image: newValue.main_image,
                    images: newValue.images,
                    services: newValue.services,
                }
            },
            deep: true, // Assicura che il watcher funzioni anche se cambiano le proprietà interne dell'oggetto
        },
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
        editApartment() {
            const formData = new FormData()
            formData.append("title", store.currentApartment.title)
            formData.append("property", store.currentApartment.property)
            formData.append("address", store.currentApartment.address)
            formData.append("description", store.currentApartment.description)
            formData.append("n_rooms", store.currentApartment.n_rooms)
            formData.append("n_beds", store.currentApartment.n_beds)
            formData.append("n_bathrooms", store.currentApartment.n_bathrooms)
            formData.append("square_meters", store.currentApartment.square_meters)
            formData.append("status", store.currentApartment.status)
            formData.append("main_image", store.currentApartment.main_image) // Immagine di copertina

            // Aggiungere ogni file di `images` individualmente
            store.currentApartment.images.forEach((image, index) => {
                formData.append(`images[${index}]`, image)
            })

            // Aggiungere ogni ID dei servizi selezionati
            store.currentApartment.services.forEach((serviceId) => {
                formData.append("services[]", serviceId)
            })

            const token = localStorage.getItem("authToken")
            axios
                .put(
                    `http://127.0.0.1:8000/api/editapartment/${store.currentApartment.id}`,
                    store.currentApartment,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
                .then((response) => {
                    console.log("Apartment created:", response.data)
                    this.errors = {}
                })
                .catch((error) => {
                    if (error.response && error.response.data.errors) {
                        this.errors = error.response.data.errors // Gestisci gli errori di validazione
                        console.error("Error edit apartment:", this.errors)
                    }
                })
        },
    },
}
</script>

<template>
    <main>
        <div class="container">
            <form @submit.prevent="editApartment">
                <div class="row">
                    <div class="mb-3 col-6">
                        <label for="title" class="form-label"
                            >Titolo annuncio <span class="text-danger">*</span></label
                        >
                        <input
                            type="text"
                            name="title"
                            class="form-control"
                            v-model="store.currentApartment.title" />
                        <div v-if="errors.title" class="invalid-feedback">
                            {{ errors.title[0] }}
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
                            v-model="store.currentApartment.property" />
                        <div v-if="errors.property" class="invalid-feedback">
                            {{ errors.property[0] }}
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
                            v-model="store.currentApartment.address"
                            @input="searchAddress" />
                        <div v-if="errors.address" class="invalid-feedback">
                            {{ errors.address[0] }}
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
                            v-model="store.currentApartment.description"></textarea>
                        <div v-if="errors.description" class="invalid-feedback">
                            {{ errors.description[0] }}
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
                            v-model="store.currentApartment.n_rooms" />
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
                            v-model="store.currentApartment.n_beds" />
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
                            v-model="store.currentApartment.n_bathrooms" />
                    </div>
                    <div class="mb-3 col-3">
                        <label for="square_meters" class="form-label"
                            >Metri quadri <span class="text-danger">*</span></label
                        >
                        <input
                            type="number"
                            name="square_meters"
                            class="form-control"
                            v-model="store.currentApartment.square_meters" />
                    </div>
                    <div class="mb-3 col-4">
                        <label for="status" class="form-label"
                            >Status <span class="text-danger">*</span></label
                        >
                        <select
                            name="status"
                            class="form-control"
                            v-model="store.currentApartment.status">
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
                            @change="form.main_image = $event.target.files[0]" />
                        <div v-if="errors.main_image" class="invalid-feedback">
                            {{ errors.main_image[0] }}
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
                        {{ errors.services[0] }}
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
                                v-model="store.currentApartment.services"
                                :id="'service-' + service.id" />
                            <label class="form-check-label" :for="'service-' + service.id">
                                {{ service.service_name }} <i :class="service.service_icon"></i>
                            </label>
                        </div>
                    </div>
                </div>
                <button type="submit" class="btn btn-success">Aggiorna Appartamento</button>
            </form>
        </div>
    </main>
</template>

<style scoped>
main {
    margin-top: 90px;
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
