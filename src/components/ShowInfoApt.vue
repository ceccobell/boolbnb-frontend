<script>
import axios from "axios"
import { store } from "../store"
import tt from "@tomtom-international/web-sdk-maps"
import "@tomtom-international/web-sdk-maps/dist/maps.css"

export default {
    data() {
        return {
            store,
            form: {
                name: "",
                surname: "",
                email: "",
                message: "",
                object: "",
            },
            errors: {
                surname: "",
                email: "",
                message: "",
                server: {},
            },
            activeIndex: 0,
            successMessage: "",
            apartmentAddress: "",
            mapUrl: "",
            showModal: true,
            openMessageIndex: null,
        }
    },
    watch: {
        // Quando l'indirizzo dell'appartamento cambia, aggiorniamo la mappa
        "store.currentApartment.address": function (newAddress) {
            this.apartmentAddress = newAddress
            this.updateMapUrl(newAddress)
        },
    },
    methods: {
        deleteApartment() {
            const token = localStorage.getItem("authToken")
            axios
                .delete(`http://127.0.0.1:8000/api/deleteapartment/${store.currentApartment.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((response) => {
                    console.log("Appartamento eliminato", response.data)
                    location.reload()
                })
                .catch((error) => {
                    console.error("Errore nell'eliminazione", error)
                })
        },
        goBack() {
            this.$router.go(-1) // Torna alla pagina precedente
        },
        prevSlide() {
            this.activeIndex =
                this.activeIndex === 0
                    ? this.store.currentApartment.images.length - 1
                    : this.activeIndex - 1
        },
        nextSlide() {
            this.activeIndex =
                this.activeIndex === this.store.currentApartment.images.length - 1
                    ? 0
                    : this.activeIndex + 1
        },
        validEmail(email) {
            const re =
                /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\.,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,})$/i
            return re.test(email)
        },
        sendMessage() {
            this.errors = {}
            this.successMessage = ""

            let hasError = false

            if (!this.form.name) {
                this.errors.name = "Il nome è obbligatorio."
                hasError = true
            }
            if (!this.form.surname) {
                this.errors.surname = "Il cognome è obbligatorio."
                hasError = true
            }
            if (!this.form.email) {
                this.errors.email = "L'email è obbligatoria."
                hasError = true
            } else if (!this.validEmail(this.form.email)) {
                this.errors.email = "Inserisci un'email valida."
                hasError = true
            }
            if (!this.form.object) {
                this.errors.object = "L'oggetto del messaggio è obbligatorio."
                hasError = true
            }
            if (!this.form.message) {
                this.errors.message = "Il messaggio è obbligatorio."
                hasError = true
            }
            if (this.form.message.length > 255) {
                this.errors.message = "Il messaggio è troppo lungo (massimo 255 caratteri)."
                hasError = true
            }

            if (hasError) {
                return
            }

            axios
                .post("http://127.0.0.1:8000/api/messages", {
                    apartment_id: store.currentApartment.id,
                    sender_name: this.form.name,
                    sender_surname: this.form.surname,
                    sender_email: this.form.email,
                    sender_message_text: this.form.message,
                    sender_message_object: this.form.object,
                })
                .then((response) => {
                    console.log(response.data)
                    this.successMessage = "Messaggio inviato con successo!"
                    this.form = { name: "", surname: "", email: "", message: "", object: "" }
                })
                .catch((error) => {
                    if (error.response) {
                        this.errors.server = error.response.data
                    }
                    console.error("Errore nell'invio del messaggio:", error.response.data)
                })
        },
        updateMapUrl(address) {
            // Aggiornamento della URL della mappa tramite l'indirizzo
            const formattedAddress = address.replace(/\s+/g, "+")
            this.mapUrl = `https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${formattedAddress}`
        },
        messageSeen(index) {
            console.log("Index:", index)
            console.log("ID messaggio:", store.currentApartment.unreadMessages[index].id)
            axios
                .post(
                    `http://127.0.0.1:8000/api/messages/${store.currentApartment.unreadMessages[index].id}/read`
                )
                .then((response) => {
                    console.log(response.data.message)
                })
                .catch((error) => {
                    console.error("Errore", error)
                })
            store.currentApartment.readMessages.unshift(
                store.currentApartment.unreadMessages[index]
            )
            store.currentApartment.unreadMessages.splice(index, 1)
            store.messagesCounter -= 1
        },
        toggleMessageDetails(index) {
            this.openMessageIndex = this.openMessageIndex === index ? null : index
        },
        isMessageOpen(index) {
            return this.openMessageIndex === index
        },
        formatDate(dateString) {
            const date = new Date(dateString)
            const options = {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            }
            return date.toLocaleString("it-IT", options) // Formato d-m-Y H:i
        },
    },
    mounted() {
        if (this.store.currentApartment) {
            this.updateMapUrl(this.store.currentApartment.address)
        }
        if (this.store.currentApartment) {
            const latitude = this.store.currentApartment.latitude
            const longitude = this.store.currentApartment.longitude

            // Verifica che le coordinate siano disponibili
            if (latitude && longitude) {
                this.map = tt.map({
                    key: "Qwrc50MvZYOeJvH56v7hQrbf5HSzDfyX", // Sostituisci con la tua chiave API
                    container: "map", // ID del container della mappa
                    center: [longitude, latitude], // Coordinate [lng, lat]
                    zoom: 14, // Livello di zoom iniziale
                })

                // Aggiungi un marker alla posizione dell'appartamento
                const marker = new tt.Marker().setLngLat([longitude, latitude]).addTo(this.map)
            } else {
                console.error("Coordinate mancanti per l'appartamento corrente.")
            }
        }
    },
}
</script>

<template>
    <main>
        <div class="container">
            <div class="card shadow-lg mb-4">
                <div v-if="store.currentApartment && store.currentApartment.images.length > 0">
                    <div class="carousel slide carousel-fade" data-bs-ride="carousel">
                        <div class="carousel-inner">
                            <div
                                v-for="(image, index) in store.currentApartment.images"
                                :key="index"
                                class="carousel-item"
                                :class="{ active: index === activeIndex }">
                                <img
                                    :src="image.url"
                                    class="w-100"
                                    style="height: 500px; object-fit: cover"
                                    alt="Carousel Image" />
                            </div>
                        </div>
                        <button @click="prevSlide" class="carousel-control-prev">
                            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Previous</span>
                        </button>
                        <button @click="nextSlide" class="carousel-control-next">
                            <span class="carousel-control-next-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Next</span>
                        </button>
                    </div>
                </div>

                <div class="card-body d-flex flex-wrap">
                    <div class="col-lg-6 col-sm-12 col-12">
                        <div class="d-flex justify-content-between align-items-center mb-4">
                            <h2 class="h4 font-weight-bold text-dark">
                                {{ store.currentApartment.title }}
                            </h2>
                        </div>
                        <div class="mb-4">
                            <div class="d-flex align-items-center text-muted mb-3">
                                <i class="fas fa-map-pin icon me-2"></i>
                                <span>{{ store.currentApartment.address }}</span>
                            </div>
                            <div class="row text-center">
                                <div class="col d-flex align-items-center justify-content-center">
                                    <i class="fas fa-home icon me-2"></i>
                                    <div>
                                        <p class="font-weight-bold mb-0">
                                            {{ store.currentApartment.n_rooms }}
                                        </p>
                                        <small class="text-muted">Camere</small>
                                    </div>
                                </div>
                                <div class="col d-flex align-items-center justify-content-center">
                                    <i class="fas fa-bed icon me-2"></i>
                                    <div>
                                        <p class="font-weight-bold mb-0">
                                            {{ store.currentApartment.n_beds }}
                                        </p>
                                        <small class="text-muted">Letti</small>
                                    </div>
                                </div>
                                <div class="col d-flex align-items-center justify-content-center">
                                    <i class="fas fa-bath icon me-2"></i>
                                    <div>
                                        <p class="font-weight-bold mb-0">
                                            {{ store.currentApartment.n_bathrooms }}
                                        </p>
                                        <small class="text-muted">Bagni</small>
                                    </div>
                                </div>
                                <div class="col d-flex align-items-center justify-content-center">
                                    <i class="fas fa-ruler-combined icon me-2"></i>
                                    <div>
                                        <p class="font-weight-bold mb-0">
                                            {{ store.currentApartment.square_meters }}m²
                                        </p>
                                        <small class="text-muted">Area</small>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="mb-4">
                            <h3 class="h5">Descrizione</h3>
                            <p class="text-muted">{{ store.currentApartment.description }}</p>
                        </div>

                        <div class="mb-4">
                            <h3 class="h5">Servizi</h3>
                            <div class="row">
                                <div
                                    v-for="(service, index) in store.currentApartment.services"
                                    class="col-4 d-flex align-items-center text-muted">
                                    <i :class="`${service.service_icon} icon me-2`"></i>
                                    <span>{{ service.service_name }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="mb-4 col-lg-6 col-sm-12 col-12">
                        <h3 class="h5">Dove sarai</h3>
                        <div id="map" class="tomtom-map"></div>
                    </div>
                    <div
                        v-if="
                            store.myApartments.some((item) => item.id === store.currentApartment.id)
                        "
                        class="bg-light p-4 rounded mt-4 col-6">
                        <div
                            v-if="
                                store.currentApartment.unreadMessages &&
                                store.currentApartment.unreadMessages.length > 0
                            "
                            class="mt-3">
                            <h3 class="h5 text-orange">Messaggi da leggere</h3>
                            <ul class="list-unstyled">
                                <li
                                    v-for="(message, index) in store.currentApartment
                                        .unreadMessages"
                                    :key="index"
                                    class="message-item">
                                    <div class="message-header d-flex justify-content-between">
                                        <div>
                                            <strong>Inviato da: </strong>
                                            <a
                                                @click.prevent="toggleMessageDetails(index)"
                                                href="#"
                                                class="toggle-link">
                                                {{ message.sender_email }}
                                            </a>
                                        </div>
                                        <div class="date-message">
                                            {{ formatDate(message.created_at) }}
                                        </div>
                                    </div>
                                    <div v-if="isMessageOpen(index)" class="message-details">
                                        <div>
                                            <strong>Nome e cognome:</strong>
                                            {{ message.sender_name }} {{ message.sender_surname }}
                                        </div>
                                        <div>
                                            <strong>Oggetto:</strong>
                                            {{ message.sender_message_object }}
                                        </div>
                                        <div>
                                            <strong>Messaggio:</strong>
                                            {{ message.sender_message_text }}
                                        </div>
                                        <div
                                            class="text-orange mark-read"
                                            @click="messageSeen(index)">
                                            Segna come letto
                                        </div>
                                    </div>
                                    <hr />
                                </li>
                            </ul>
                        </div>
                        <div v-else>
                            <h5 class="text-orange">Non hai messaggi da leggere.</h5>
                            <hr />
                        </div>
                        <div
                            v-if="
                                store.currentApartment.readMessages &&
                                store.currentApartment.readMessages.length > 0
                            "
                            class="mt-3">
                            <h3 class="h5">Messaggi già letti</h3>
                            <ul class="list-unstyled">
                                <li
                                    v-for="(message, index) in store.currentApartment.readMessages"
                                    :key="index"
                                    class="message-item">
                                    <div>
                                        <strong>Inviato da: </strong>
                                        <a
                                            data-bs-toggle="collapse"
                                            :href="'#messageDetails' + index"
                                            role="button"
                                            aria-expanded="false"
                                            aria-controls="'messageDetails' + index">
                                            {{ message.sender_email }}
                                        </a>
                                    </div>
                                    <div :id="'messageDetails' + index" class="collapse mt-2">
                                        <div>
                                            <strong>Nome e cognome:</strong>
                                            {{ message.sender_name }} {{ message.sender_surname }}
                                        </div>
                                        <div>
                                            <strong>Oggetto:</strong>
                                            {{ message.sender_message_object }}
                                        </div>
                                        <div>
                                            <strong>Messaggio:</strong>
                                            {{ message.sender_message_text }}
                                        </div>
                                    </div>

                                    <hr />
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div
                        class="bg-light p-4 rounded mt-4 col-12"
                        v-if="
                            !store.myApartments.some(
                                (item) => item.id === store.currentApartment.id
                            )
                        ">
                        <h3 class="h5">Contatta il Proprietario</h3>
                        <form @submit.prevent="sendMessage">
                            <div
                                v-if="errors.server && Object.keys(errors.server).length > 0"
                                class="alert alert-danger">
                                {{ errors.server }}
                            </div>
                            <div v-if="successMessage" class="alert alert-success mt-3">
                                {{ successMessage }}
                            </div>

                            <div class="form-group mb-3">
                                <label for="name">Nome</label>
                                <input
                                    type="text"
                                    v-model="form.name"
                                    class="form-control"
                                    id="name"
                                    placeholder="Inserisci il tuo nome" />
                                <div v-if="errors.name" class="text-danger">{{ errors.name }}</div>
                            </div>

                            <div class="form-group mb-3">
                                <label for="surname">Cognome</label>
                                <input
                                    type="text"
                                    v-model="form.surname"
                                    class="form-control"
                                    id="surname"
                                    placeholder="Inserisci il tuo cognome" />
                                <div v-if="errors.surname" class="text-danger">
                                    {{ errors.surname }}
                                </div>
                            </div>

                            <div class="form-group mb-3">
                                <label for="email">Email</label>
                                <input
                                    type="email"
                                    v-model="form.email"
                                    class="form-control"
                                    id="email"
                                    placeholder="Inserisci la tua email" />
                                <div v-if="errors.email" class="text-danger">
                                    {{ errors.email }}
                                </div>
                            </div>

                            <div class="form-group mb-3">
                                <label for="object">Oggetto</label>
                                <input
                                    type="text"
                                    v-model="form.object"
                                    class="form-control"
                                    id="object"
                                    placeholder="Oggetto del messaggio" />
                                <div v-if="errors.object" class="text-danger">
                                    {{ errors.object }}
                                </div>
                            </div>

                            <div class="form-group mb-3">
                                <label for="message">Messaggio</label>
                                <textarea
                                    v-model="form.message"
                                    class="form-control"
                                    id="message"
                                    placeholder="Inserisci il tuo messaggio"></textarea>
                                <div v-if="errors.message" class="text-danger">
                                    {{ errors.message }}
                                </div>
                            </div>

                            <button type="submit" class="btn btn-primary">Invia Messaggio</button>
                        </form>
                    </div>
                    <div class="d-flex justify-content-between mt-2 w-100">
                        <div>
                            <button @click="goBack" class="btn btn-secondary mb-3 me-2">
                                <i class="fas fa-arrow-left me-2"></i>Indietro
                            </button>
                        </div>
                        <div
                            v-if="
                                store.myApartments.some(
                                    (item) => item.id === store.currentApartment.id
                                )
                            ">
                            <router-link :to="'/edit-apartment'">
                                <button class="btn btn-warning border-0 me-2 text-white">
                                    Modifica
                                </button>
                            </router-link>
                            <button
                                type="button"
                                class="btn btn-danger text-white"
                                data-bs-toggle="modal"
                                data-bs-target="#staticBackdrop">
                                Elimina
                            </button>

                            <!-- Modal -->
                            <div
                                v-if="showModal"
                                class="modal fade"
                                id="staticBackdrop"
                                data-bs-backdrop="static"
                                data-bs-keyboard="false"
                                tabindex="-1"
                                aria-labelledby="staticBackdropLabel"
                                aria-hidden="true">
                                <div class="modal-dialog modal-dialog-centered">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h1 class="modal-title fs-5" id="staticBackdropLabel">
                                                Sei sicuro di voler eliminare l'appartamento?
                                            </h1>
                                            <button
                                                type="button"
                                                class="btn-close"
                                                data-bs-dismiss="modal"
                                                aria-label="Close"></button>
                                        </div>

                                        <div class="modal-footer">
                                            <button
                                                type="button"
                                                class="btn btn-secondary text-white"
                                                data-bs-dismiss="modal">
                                                Close
                                            </button>
                                            <button
                                                type="button"
                                                class="btn btn-danger text-white"
                                                @click="deleteApartment">
                                                Elimina
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<style scoped>
main {
    margin-top: 120px;
}

.tomtom-map {
    width: 100%;
    height: 400px;
    border: 1px solid #000;
    border-radius: 8px;
}

.card {
    border: 1px solid #ddd;
    border-radius: 8px;
}

.card-body {
    padding: 20px;
}

.icon {
    color: #ec622b;
}

.bg-light {
    background-color: #f8f9fa !important;
}

.mark-read {
    cursor: pointer;
    display: inline-block;

    &:hover {
        text-decoration: underline;
    }
}

.date-message {
    font-size: 12px;
    display: inline-block;
    text-align: end;
    color: #7a7a7a;
}
</style>
