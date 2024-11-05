<script>
import axios from "axios"

export default {
    data() {
        return {
            registrationFormIsVisible: false,
            form: {
                name: "",
                email: "",
                password: "",
                password_confirmation: "",
            },
            errors: {},
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
            axios.defaults.withCredentials = true
            axios
                .post(`https://boolflix-1c2e0e6c24b8.herokuapp.com/api/login`, {
                    email: this.form.email,
                    password: this.form.password,
                })
                .then((response) => {
                    localStorage.setItem("authToken", response.data.access_token)
                    store.isAuthenticated = true
                    this.closeCanvas()
                    axios.defaults.withCredentials = false
                })
                .catch((error) => {
                    if (error.response && error.response.data.errors) {
                        this.errors = error.response.data.errors
                    }
                    console.error("Login error:", error.response.data)
                })
        },
        submitRegistration() {
            axios.defaults.withCredentials = true
            axios
                .post(`https://boolflix-1c2e0e6c24b8.herokuapp.com/api/register`, {
                    name: this.form.name,
                    email: this.form.email,
                    password: this.form.password,
                    password_confirmation: this.form.password_confirmation,
                })
                .then((response) => {
                    console.log("Registration successful:", response.data)
                    localStorage.setItem("authToken", response.data.token)
                    axios.defaults.withCredentials = false
                    this.form.name = ""
                    this.form.email = ""
                    this.form.password = ""
                    this.form.password_confirmation = ""
                })
                .catch((error) => {
                    if (error.response && error.response.data.errors) {
                        this.errors = error.response.data.errors
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
        style="background: rgba(0, 0, 0, 0.5); z-index: 1050">
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
                        <form class="space-y-4">
                            <div class="mb-3 position-relative">
                                <span
                                    class="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted">
                                    <i class="fa-solid fa-envelope"></i>
                                </span>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    class="form-control ps-5"
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
                                    required />
                            </div>
                            <button type="submit" class="btn bg-pink text-white w-100">
                                Accedi
                            </button>
                        </form>
                    </div>
                    <div v-if="registrationFormIsVisible">
                        <h2 class="text-center mb-4">Registrati</h2>
                        <form class="space-y-4">
                            <div class="mb-3 position-relative">
                                <span
                                    class="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted">
                                    <i class="fa-solid fa-person"></i>
                                </span>
                                <input
                                    type="text"
                                    placeholder="Nome"
                                    class="form-control ps-5"
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
                                    required />
                            </div>
                            <div class="mb-3 position-relative">
                                <span
                                    class="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted">
                                    <i class="fa-solid fa-lock"></i>
                                </span>
                                <input
                                    type="password"
                                    placeholder="Conferma Password"
                                    class="form-control ps-5"
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
</style>
