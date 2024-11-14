<script>
import axios from "axios"
import { store } from "../store"

export default {
    data() {
        return {
            registrationFormIsVisible: false,
            form: {
                name: "",
                surname: "",
                email: "",
                password: "",
                password_confirmation: "",
            },
            errors: {
                login: {},
                registration: {},
                server: {},
            },
            store,
        }
    },
    methods: {
        showRegistrationForm() {
            this.registrationFormIsVisible = !this.registrationFormIsVisible
        },
        closeCanvas() {
            this.$emit("close-canva", false)
        },
        validEmail(email) {
            const re =
                /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\.,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,})$/i
            return re.test(email)
        },
        submitLogin() {
            // Resetta gli errori precedenti
            this.errors.login = {}
            this.errors.server = {}

            let hasError = false

            // Validazione email
            if (!this.form.email) {
                this.errors.login.email = "L'email è obbligatoria."
                hasError = true
            } else if (!this.validEmail(this.form.email)) {
                this.errors.login.email = "Inserisci un'email valida."
                hasError = true
            }

            // Validazione password
            if (!this.form.password) {
                this.errors.login.password = "La password è obbligatoria."
                hasError = true
            }

            if (hasError) {
                return
            }

            axios
                .post(`http://127.0.0.1:8000/api/login`, {
                    email: this.form.email,
                    password: this.form.password,
                })
                .then((response) => {
                    console.log("Login successful:", response.data.message)
                    localStorage.setItem("authToken", response.data.token)
                    store.isAuthenticated = true
                    this.closeCanvas()
                    location.reload()
                })
                .catch((error) => {
                    if (error.response) {
                        this.errors.server = error.response.data
                    }
                    console.error("Login error:", error.response.data)
                })
        },
        submitRegistration() {
            // Resetta gli errori precedenti
            this.errors.registration = {}
            this.errors.server = {}

            let hasError = false

            // Validazione nome
            if (!this.form.name) {
                this.errors.registration.name = "Il nome è obbligatorio."
                hasError = true
            }

            // Validazione cognome
            if (!this.form.surname) {
                this.errors.registration.surname = "Il cognome è obbligatorio."
                hasError = true
            }

            // Validazione email
            if (!this.form.email) {
                this.errors.registration.email = "L'email è obbligatoria."
                hasError = true
            } else if (!this.validEmail(this.form.email)) {
                this.errors.registration.email = "Inserisci un'email valida."
                hasError = true
            }

            // Validazione password
            if (!this.form.password) {
                this.errors.registration.password = "La password è obbligatoria."
                hasError = true
            } else if (this.form.password.length < 6) {
                this.errors.registration.password = "La password deve avere almeno 6 caratteri."
                hasError = true
            }

            // Validazione conferma password
            if (this.form.password !== this.form.password_confirmation) {
                this.errors.registration.password_confirmation = "Le password non corrispondono."
                hasError = true
            }

            if (hasError) {
                return
            }

            axios
                .post(`http://127.0.0.1:8000/api/register`, {
                    name: this.form.name,
                    surname: this.form.surname,
                    email: this.form.email,
                    password: this.form.password,
                    password_confirmation: this.form.password_confirmation,
                })
                .then((response) => {
                    console.log("Registration successful:", response.data)
                    localStorage.setItem("authToken", response.data.token)
                    // Resetta i campi del form
                    this.form.name = ""
                    this.form.surname = ""
                    this.form.email = ""
                    this.form.password = ""
                    this.form.password_confirmation = ""
                    this.registrationFormIsVisible = false
                    this.closeCanvas()
                })
                .catch((error) => {
                    if (error.response && error.response.data.errors) {
                        this.errors.server = {
                            ...this.errors.server,
                            ...error.response.data.errors,
                        }
                    }
                    console.error("Registration error:", error.response.data)
                })
        },
    },
}
</script>

<template>
    <!-- Auth Modal -->
    <div
        class="modal fade show d-flex align-items-center justify-content-center"
        style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 9999">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content p-4">
                <button
                    type="button"
                    class="btn-close position-absolute top-0 end-0 p-3"
                    aria-label="Close"
                    @click="closeCanvas()"></button>
                <div class="modal-body">
                    <!-- Login Form -->
                    <div v-if="!registrationFormIsVisible">
                        <h2 class="text-center mb-4">Accedi</h2>
                        <form @submit.prevent="submitLogin">
                            <!-- Errori del server -->
                            <div v-if="errors.server.message" class="alert alert-danger">
                                {{ errors.server.message }}
                            </div>

                            <!-- Campo Email -->

                            <div class="form-floating mb-3">
                                <input
                                    type="email"
                                    class="form-control"
                                    id="floatingEmailLogin"
                                    v-model="form.email"
                                    required />
                                <label
                                    for="floatingEmailLogin"
                                    :class="{ 'text-danger': errors.login.email }"
                                    ><i class="fa-solid fa-envelope me-2"></i
                                    >{{ errors.login.email ? errors.login.email : "Email" }}</label
                                >
                            </div>

                            <!-- Campo Password -->

                            <div class="form-floating mb-3">
                                <input
                                    type="password"
                                    class="form-control"
                                    id="floatingPasswordLogin"
                                    v-model="form.password"
                                    required />
                                <label
                                    for="floatingPasswordLogin"
                                    :class="{ 'text-danger': errors.login.password }"
                                    ><i class="fa-solid fa-lock me-2"></i
                                    >{{
                                        errors.login.password ? errors.login.password : "Password"
                                    }}</label
                                >
                            </div>

                            <button type="submit" class="btn bg-pink text-white w-100">
                                Accedi
                            </button>
                        </form>
                    </div>

                    <!-- Registration Form -->
                    <div v-else>
                        <h2 class="text-center mb-4">Registrati</h2>
                        <form @submit.prevent="submitRegistration">
                            <!-- Errori del server -->
                            <div v-if="errors.server.message" class="alert alert-danger">
                                {{ errors.server.message }}
                            </div>

                            <!-- Campo Nome -->

                            <div class="form-floating mb-3">
                                <input
                                    type="text"
                                    class="form-control"
                                    id="floatingNameValue"
                                    v-model="form.name"
                                    required />
                                <label
                                    for="floatingNameValue"
                                    :class="{ 'text-danger': errors.registration.name }"
                                    ><i class="fa-solid fa-user me-2"></i
                                    >{{
                                        errors.registration.name ? errors.registration.name : "Nome"
                                    }}</label
                                >
                            </div>

                            <!-- Campo Cognome -->

                            <div class="form-floating mb-3">
                                <input
                                    type="text"
                                    class="form-control"
                                    id="floatingSurnameValue"
                                    v-model="form.surname"
                                    required />
                                <label
                                    for="floatingSurnameValue"
                                    :class="{ 'text-danger': errors.registration.surname }"
                                    ><i class="fa-solid fa-user me-2"></i
                                    >{{
                                        errors.registration.surname
                                            ? errors.registration.surname
                                            : "Cognome"
                                    }}</label
                                >
                            </div>

                            <!-- Campo Email -->

                            <div class="form-floating mb-3">
                                <input
                                    type="email"
                                    class="form-control"
                                    id="floatingEmailValue"
                                    v-model="form.email"
                                    required />
                                <label
                                    for="floatingEmailValue"
                                    :class="{ 'text-danger': errors.registration.email }"
                                    ><i class="fa-solid fa-envelope me-2"></i
                                    >{{
                                        errors.registration.email
                                            ? errors.registration.email
                                            : "Email"
                                    }}</label
                                >
                            </div>

                            <!-- Campo Password -->

                            <div class="form-floating mb-3">
                                <input
                                    type="password"
                                    class="form-control"
                                    id="floatingPasswordValue"
                                    v-model="form.password"
                                    required />
                                <label
                                    for="floatingPasswordValue"
                                    :class="{ 'text-danger': errors.registration.password }"
                                    ><i class="fa-solid fa-lock me-2"></i
                                    >{{
                                        errors.registration.password
                                            ? errors.registration.password
                                            : "Password"
                                    }}</label
                                >
                            </div>

                            <!-- Campo Conferma Password -->

                            <div class="form-floating mb-3">
                                <input
                                    type="password"
                                    class="form-control"
                                    id="floatingPasswordCheckValue"
                                    v-model="form.password_confirmation"
                                    required />
                                <label
                                    for="floatingPasswordCheckValue"
                                    :class="{
                                        'text-danger': errors.registration.password_confirmation,
                                    }"
                                    ><i class="fa-solid fa-lock me-2"></i
                                    >{{
                                        errors.registration.password_confirmation
                                            ? errors.registration.password_confirmation
                                            : "Conferma Password"
                                    }}</label
                                >
                            </div>

                            <button type="submit" class="btn bg-pink text-white w-100">
                                Registrati
                            </button>
                        </form>
                    </div>

                    <p class="text-center mt-3 text-muted">
                        <template v-if="!registrationFormIsVisible">
                            Non hai un account?
                            <a
                                href="#"
                                class="text-primary text-decoration-underline"
                                @click="showRegistrationForm"
                                >Registrati</a
                            >
                        </template>
                        <template v-else>
                            Hai già un account?
                            <a
                                href="#"
                                class="text-primary text-decoration-underline"
                                @click="showRegistrationForm"
                                >Accedi</a
                            >
                        </template>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.modal-content {
    border-radius: 0.75rem;
    position: relative;
    max-width: 700px;
    min-width: 400px;
}

.btn-close {
    top: 1rem;
    right: 1rem;
    font-size: 1.2rem;
}

.input-icon {
    position: relative;
}

.input-icon .icon {
    position: absolute;
    top: 50%;
    left: 0.75rem;
    transform: translateY(-50%);
    color: #6c757d;
    pointer-events: none; /* Evita che l'icona interferisca con l'input */
}

.input-icon .form-control {
    padding-left: 2.5rem;
    box-sizing: border-box;
}

.input-icon .invalid-feedback {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    margin-top: 0.25rem;
    min-height: 1.25rem; /* Riserva spazio per il messaggio di errore */
}

.mb-3 {
    margin-bottom: 1rem !important;
    position: relative;
}

.bg-pink {
    background-color: #e83e8c;
}

.bg-pink:hover {
    background-color: #dc3578;
}

.text-white {
    color: white !important;
}

.text-muted {
    color: #6c757d !important;
}

.text-primary {
    color: #007bff !important;
}

.text-decoration-underline {
    text-decoration: underline !important;
}
</style>
