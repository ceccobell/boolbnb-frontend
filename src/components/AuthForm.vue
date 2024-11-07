<script>
import axios from "axios"
import { store } from "../../store"

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
            errors: {},
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
        submitLogin() {
            console.log("Login data:", this.form)
            axios
                .post(`http://127.0.0.1:8000/api/login`, {
                    email: this.form.email,
                    password: this.form.password,
                })
                .then((response) => {
                    console.log("Login successful:", response.data)
                    localStorage.setItem("authToken", response.data.access_token)
                    store.isAuthenticated = true
                    this.closeCanvas()
                })
                .catch((error) => {
                    if (error.response) {
                        this.errors = error.response.data
                    }
                    console.error("Login error:", error.response.data)
                })
        },
        submitRegistration() {
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
                    this.form.name = ""
                    this.form.surname = ""
                    this.form.email = ""
                    this.form.password = ""
                    this.form.password_confirmation = ""
                })
                .catch((error) => {
                    if (error.response && error.response.data.errors) {
                        this.errors = error.response.data.errors
                    }
                    console.error("Registration error:", error.response.data)
                    console.log("errori:", this.errors)
                })
        },
    },
}
</script>

<template>
    <!-- Auth Modal -->
    <div
        class="modal fade show d-flex align-items-center justify-content-center"
        style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 9999;">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content p-4">
                <button
                    type="button"
                    class="btn-close position-absolute top-0 end-0 p-3"
                    aria-label="Close"
                    @click="closeCanvas()"></button>
                <div class="modal-body">
                    <div v-if="!registrationFormIsVisible">
                        <h2 class="text-center mb-4">Accedi</h2>
                        <form @submit.prevent="submitLogin" class="space-y-4">
                            <span v-if="this.errors.message" class="error-message mb-1 text-white">
                                {{ this.errors.message }}
                            </span>
                            <div class="mb-3 position-relative">
                                <span
                                    class="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted">
                                    <i class="fa-solid fa-envelope"></i>
                                </span>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    class="form-control ps-5"
                                    v-model="form.email"
                                    required />
                            </div>
                            <div class="mb-3 position-relative">
                                <span
                                    class="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted">
                                    <i class="fa-solid fa-lock"></i>
                                </span>
                                <input
                                    type="password"
                                    placeholder="Password"
                                    class="form-control ps-5"
                                    v-model="form.password"
                                    required />
                            </div>
                            <button type="submit" class="btn bg-pink text-white w-100">
                                Accedi
                            </button>
                        </form>
                    </div>
                    <div v-if="registrationFormIsVisible">
                        <h2 class="text-center mb-4">Registrati</h2>
                        <form @submit.prevent="submitRegistration" class="space-y-4">
                            <span v-if="this.errors.name" class="error-message">
                                {{ this.errors.name[0] }}
                            </span>
                            <div class="mb-3 position-relative">
                                <span
                                    class="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted">
                                    <i class="fa-solid fa-person"></i>
                                </span>
                                <input
                                    type="text"
                                    placeholder="Nome"
                                    class="form-control ps-5"
                                    v-model="form.name"
                                    required />
                            </div>
                            <div class="mb-3 position-relative">
                                <span
                                    class="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted">
                                    <i class="fa-solid fa-person"></i>
                                </span>
                                <input
                                    type="text"
                                    placeholder="Cognome"
                                    class="form-control ps-5"
                                    v-model="form.surname"
                                    required />
                            </div>
                            <div class="mb-3 position-relative">
                                <span
                                    class="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted">
                                    <i class="fa-solid fa-envelope"></i>
                                </span>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    class="form-control ps-5"
                                    v-model="form.email"
                                    required />
                            </div>
                            <span v-if="this.errors.email" class="error-message">
                                {{ this.errors.email[0] }}
                            </span>
                            <span v-if="this.errors.password" class="error-message">
                                {{ this.errors.password[0] }}
                            </span>
                            <div class="mb-3 position-relative">
                                <span
                                    class="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted">
                                    <i class="fa-solid fa-lock"></i>
                                </span>
                                <input
                                    type="password"
                                    placeholder="Password"
                                    class="form-control ps-5"
                                    v-model="form.password"
                                    required />
                            </div>
                            <span v-if="this.errors.password_confirmation" class="error-message">
                                {{ this.errors.password_confirmation[0] }}
                            </span>
                            <div class="mb-3 position-relative">
                                <span
                                    class="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted">
                                    <i class="fa-solid fa-lock"></i>
                                </span>
                                <input
                                    type="password"
                                    placeholder="Conferma Password"
                                    class="form-control ps-5"
                                    v-model="form.password_confirmation"
                                    required />
                            </div>
                            <button type="submit" class="btn bg-pink text-white w-100">
                                Registrati
                            </button>
                        </form>
                    </div>
                    <p class="text-center mt-3 text-muted">
                        Don't have an account?
                        <a
                            href="#"
                            class="text-primary text-decoration-underline"
                            @click="showRegistrationForm"
                            >Registrati</a
                        >
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
}

.form-control {
    padding-left: 2.5rem;
}

.btn-close {
    top: 1rem;
    right: 1rem;
    font-size: 1.2rem;
}

.position-relative .position-absolute {
    font-size: 1rem;
}

.error-message {
    font-size: 12px;
    display: block;
    margin-top: 5px;
    background-color: #e63b44;
    padding: 10px;
    border-radius: 5px;
}
</style>
