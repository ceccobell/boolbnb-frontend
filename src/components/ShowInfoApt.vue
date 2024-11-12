<script>
import axios from "axios"
import { store } from "../store"

export default {
    data() {
        return {
            store,
            form: {
                name: "",
                email: "",
                message: "",
            },
            errors: {
                email: "",
                message: "",
                server: {},
            },
            activeIndex: 0,
        }
    },
    methods: {
        prevSlide() {
            // Go to the previous image, looping back to the last one if at the start
            this.activeIndex =
                this.activeIndex === 0
                    ? this.store.currentApartment.images.length - 1
                    : this.activeIndex - 1
        },
        nextSlide() {
            // Go to the next image, looping back to the first one if at the end
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

            let hasError = false

            // Validazione email
            if (!this.form.email) {
                this.errors.email = "L'email è obbligatoria."
                hasError = true
            } else if (!this.validEmail(this.form.email)) {
                this.errors.email = "Inserisci un'email valida."
                hasError = true
            }

            // Validazione messaggio
            if (!this.form.message) {
                this.errors.message = "Il messaggio è obbligatorio."
                hasError = true
            }

            if (this.form.message.length > 255) {
                this.errors.message = "Il messaggio è troppo lungo.(massimo 255 caratteri)"
                hasError = true
            }

            if (hasError) {
                return
            }

            axios
                .post("http://127.0.0.1:8000/api/messages", {
                    apartment_id: store.currentApartment.id,
                    sender_name: this.form.name,
                    sender_email: this.form.email,
                    sender_message_text: this.form.message,
                })
                .then((response) => {
                    console.log(response.data)
                })
                .catch((error) => {
                    if (error.response) {
                        this.errors.server = error.response.data
                    }
                    console.error("Errore nell'invio del messaggio:", error.response.data)
                })
        },
    },
}
</script>

<template>
    <main>
        <div class="container">
            <!-- Apartment Image and Rating -->
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

                        <!-- Button for the previous slide -->
                        <button @click="prevSlide" class="carousel-control-prev">
                            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Previous</span>
                        </button>

                        <!-- Button for the next slide -->
                        <button @click="nextSlide" class="carousel-control-next">
                            <span class="carousel-control-next-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Next</span>
                        </button>
                    </div>
                </div>

                <!-- Apartment Details -->
                <div class="card-body d-flex flex-wrap">
                    <div class="col-6">
                        <div class="d-flex justify-content-between align-items-center mb-4">
                            <h2 class="h4 font-weight-bold text-dark">
                                {{ store.currentApartment.title }}
                            </h2>
                        </div>

                        <!-- Address and Features -->
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

                        <!-- Description -->
                        <div class="mb-4">
                            <h3 class="h5">Descrizione</h3>
                            <p class="text-muted">
                                {{ store.currentApartment.description }}
                            </p>
                        </div>

                        <!-- Servizi -->
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

                    <!-- Location Map Placeholder -->
                    <div class="mb-4 col-6">
                        <h3 class="h5">Dove sarai</h3>
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2794.4468476204916!2d9.44664597670617!3d45.54133582828815!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4786b505dc5b7c4d%3A0x757e2e0f606bdc6c!2sVia%20Quattro%20Marie%2C%2020060%20Bellinzago%20Lombardo%20MI!5e0!3m2!1sen!2sit!4v1731419147716!5m2!1sen!2sit"
                            allowfullscreen=""
                            loading="lazy"
                            referrerpolicy="no-referrer-when-downgrade"></iframe>
                    </div>

                    <!-- Contact Owner Form -->
                    <div class="bg-light p-4 rounded mt-4 col-12">
                        <h3 class="h5">Contatta il Proprietario</h3>
                        <form @submit.prevent="sendMessage">
                            <div
                                v-if="errors.server && Object.keys(errors.server).length > 0"
                                class="alert alert-danger">
                                {{ errors.server }}
                            </div>
                            <div class="mb-3">
                                <label for="name" class="form-label">Nome (opzionale)</label>
                                <input
                                    type="text"
                                    class="form-control"
                                    id="name"
                                    placeholder="Il tuo nome"
                                    v-model="form.name" />
                            </div>
                            <div class="mb-3">
                                <label
                                    for="email"
                                    class="form-label ms-1"
                                    :class="{ 'text-danger': errors.email }"
                                    ><i class="fa-solid fa-envelope me-2"></i
                                    >{{ errors.email ? errors.email : "Email" }}</label
                                >
                                <input
                                    type="email"
                                    class="form-control"
                                    id="email"
                                    placeholder="La tua email"
                                    v-model="form.email" />
                            </div>
                            <div class="mb-3">
                                <div v-if="errors.message" class="text-danger ms-1 mb-1">
                                    <i class="fa-solid fa-message"></i>
                                    {{ errors.message }}
                                </div>
                                <textarea
                                    class="form-control"
                                    rows="4"
                                    placeholder="Scrivi il tuo messaggio qui..."
                                    v-model="form.message"></textarea>
                            </div>
                            <button
                                type="submit"
                                class="btn btn-submit w-100 d-flex align-items-center justify-content-center">
                                <i class="fas fa-paper-plane me-2"></i> Invia Messaggio
                            </button>
                        </form>
                    </div>

                    <!-- Property Owner Information -->
                    <div class="col-12 d-flex align-items-center mt-4 border-top pt-3">
                        <i class="fas fa-user icon me-2"></i>
                        <div>
                            <small class="text-muted">Propretario Appartamento</small>
                            <p class="font-weight-bold mb-0">
                                {{ store.currentApartment.user.name }}
                                {{ store.currentApartment.user.surname }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<style scoped>
main {
    margin-top: 75px;
    padding-top: 20px;
    position: relative;
}

.icon {
    color: #ec622b;
}
.rating-badge {
    background-color: #ef6a9d;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 1rem;
    display: flex;
    align-items: center;
}
.btn-submit {
    background-color: #ef6a9d;
    color: white;
    transition: background-color 0.3s ease;
}
.btn-submit:hover {
    background-color: #f578a8;
}
iframe {
    height: 100%;
    width: 100%;
}
</style>
