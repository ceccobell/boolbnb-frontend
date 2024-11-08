<script>
import axios from "axios"
import { store } from "../../store"

export default {
  data() {
    return {
      registrationFormIsVisible: false,
      rightPanelActive: false,
      loginForm: {
        email: "",
        password: "",
      },
      registrationForm: {
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
    togglePanel(showRegistration) {
      this.rightPanelActive = showRegistration
      // Resetta gli errori
      this.errors.login = {}
      this.errors.registration = {}
      this.errors.server = {}
      // Resetta i campi del form
      if (showRegistration) {
        this.loginForm.email = ""
        this.loginForm.password = ""
      } else {
        this.registrationForm.name = ""
        this.registrationForm.surname = ""
        this.registrationForm.email = ""
        this.registrationForm.password = ""
        this.registrationForm.password_confirmation = ""
      }
    },
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
      if (!this.loginForm.email) {
        this.errors.login.email = "L'email è obbligatoria."
        hasError = true
      } else if (!this.validEmail(this.loginForm.email)) {
        this.errors.login.email = "Inserisci un'email valida."
        hasError = true
      }

      // Validazione password
      if (!this.loginForm.password) {
        this.errors.login.password = "La password è obbligatoria."
        hasError = true
      }

      if (hasError) {
        return
      }

      axios
        .post(`http://127.0.0.1:8000/api/login`, {
          email: this.loginForm.email,
          password: this.loginForm.password,
        })
        .then((response) => {
          console.log("Login successful:", response.data)
          localStorage.setItem("authToken", response.data.access_token)
          store.isAuthenticated = true
          this.closeCanvas()
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
      if (!this.registrationForm.name) {
        this.errors.registration.name = "Il nome è obbligatorio."
        hasError = true
      }

      // Validazione cognome
      if (!this.registrationForm.surname) {
        this.errors.registration.surname = "Il cognome è obbligatorio."
        hasError = true
      }

      // Validazione email
      if (!this.registrationForm.email) {
        this.errors.registration.email = "L'email è obbligatoria."
        hasError = true
      } else if (!this.validEmail(this.registrationForm.email)) {
        this.errors.registration.email = "Inserisci un'email valida."
        hasError = true
      }

      // Validazione password
      if (!this.registrationForm.password) {
        this.errors.registration.password = "La password è obbligatoria."
        hasError = true
      } else if (this.registrationForm.password.length < 6) {
        this.errors.registration.password =
          "La password deve avere almeno 6 caratteri."
        hasError = true
      }

      // Validazione conferma password
      if (
        this.registrationForm.password !==
        this.registrationForm.password_confirmation
      ) {
        this.errors.registration.password_confirmation =
          "Le password non corrispondono."
        hasError = true
      }

      if (hasError) {
        return
      }

      axios
        .post(`http://127.0.0.1:8000/api/register`, {
          name: this.registrationForm.name,
          surname: this.registrationForm.surname,
          email: this.registrationForm.email,
          password: this.registrationForm.password,
          password_confirmation: this.registrationForm.password_confirmation,
        })
        .then((response) => {
          console.log("Registration successful:", response.data)
          localStorage.setItem("authToken", response.data.token)
          // Resetta i campi del form
          this.togglePanel(false)
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
    <div class="modal fade show d-flex align-items-center justify-content-center" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 9998">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content p-4">
                <button
                    id="btn-close-modal"
                    type="button"
                    class="btn-close position-absolute top-0 end-0 p-3"
                    aria-label="Close"
                    @click="closeCanvas()"><i class="fa-solid fa-xmark position-absolute"></i></button>
                <div
                  class="container"
                  :class="{ 'right-panel-active': rightPanelActive }"
                  id="container"
                >
                  <!-- Form di Registrazione -->
                  <div class="form-container sign-up-container">
                    <form @submit.prevent="submitRegistration">
                      <h2>Registrati</h2>
                      <!-- Errori del server -->
                      <div v-if="errors.server.message" class="alert alert-danger">
                        {{ errors.server.message }}
                      </div>
                      <input type="text" placeholder="Nome" v-model="registrationForm.name" />
                      <input type="text" placeholder="Cognome" v-model="registrationForm.surname" />
                      <input type="email" placeholder="Email" v-model="registrationForm.email" />
                      <input type="password" placeholder="Password" v-model="registrationForm.password" />
                      <input
                        type="password"
                        placeholder="Conferma Password"
                        v-model="registrationForm.password_confirmation"
                      />
                      <button type="submit" class="bg-pink-custom">Registrati</button>
                    </form>
                  </div>
              
                  <!-- Form di Login -->
                  <div class="form-container sign-in-container">
                    <form @submit.prevent="submitLogin">
                      <h2>Accedi</h2>
                      <!-- Errori del server -->
                      <div v-if="errors.server.message" class="alert alert-danger">
                        {{ errors.server.message }}
                      </div>
                      <input type="email" placeholder="Email" v-model="loginForm.email" />
                      <input type="password" placeholder="Password" v-model="loginForm.password" />
                      <button type="submit" class="bg-pink-custom">Accedi</button>
                    </form>
                  </div>
              
                  <!-- Overlay -->
                  <div class="overlay-container">
                    <div class="overlay">
                      <div class="overlay-panel overlay-left">
                        <h2>Bentornato/a!</h2>
                        <p>
                          Per rimanere connesso/a con noi, accedi con le tue informazioni personali
                        </p>
                        <button class="ghost" @click="togglePanel(false)">Accedi</button>
                      </div>
                      <div class="overlay-panel overlay-right">
                        <h2>Ciao, Amico/a!</h2>
                        <p>Inserisci i tuoi dati personali e inizia il tuo viaggio con noi</p>
                        <button class="ghost" @click="togglePanel(true)">Registrati</button>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
        </div>
    </div>
  </template>
  

  <style scoped>
  @import url('https://fonts.googleapis.com/css?family=Montserrat:400,800');
  @import url('https://use.fontawesome.com/releases/v6.5.1/css/all.css');

  .modal-content {
    border-radius: 0.75rem;
    position: relative;
    max-width: 700px;
    min-width: 400px;
}

#btn-close-modal {
    top: 1rem;
    right: 1rem;
    font-size: 1.2rem;
    border-color: #0D6EFD;
    color: white;
    z-index: 9999;
    opacity: 1;
    background-color: #0D6EFD;
    border-radius: 0;
}

#btn-close-modal i {
    top: 1rem;
    right: 1rem;
}

  h2 {
    font-weight: bold;
    margin: 0;
  }
  
  p {
    font-size: 14px;
    font-weight: 100;
    line-height: 20px;
    letter-spacing: 0.5px;
    margin: 20px 0 30px;
  }
  
  span {
    font-size: 12px;
  }
  
  a {
    color: #333;
    font-size: 14px;
    text-decoration: none;
    margin: 15px 0;
  }
  
  .container {
    position: relative;
    width: 768px;
    max-width: 100%;
    min-height: 480px;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.2),
      0 10px 10px rgba(0, 0, 0, 0.2);
    overflow: hidden;
    font-family: 'Montserrat', sans-serif;
  }
  
  .form-container {
    position: absolute;
    top: 0;
    height: 100%;
    transition: all 0.6s ease-in-out;
  }
  
  .sign-in-container {
    left: 0;
    width: 50%;
    z-index: 2;
  }
  
  .sign-up-container {
    left: 0;
    width: 50%;
    z-index: 1;
  }
  
  .form-container form {
    height: 100%;
    background: #fff;
    padding: 0 50px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  
  .form-container input {
    width: 100%;
    background: #eee;
    border: none;
    padding: 12px 15px;
    margin: 8px 0;
  }
  
  button {
    background: #ff445c;
    color: #fff;
    border: 1px solid #ff4b2b;
    border-radius: 20px;
    font-size: 12px;
    font-weight: bold;
    padding: 12px 45px;
    letter-spacing: 1px;
    text-transform: uppercase;
    transition: transform 80ms ease-in;
  }
  
  button:active {
    transform: scale(0.95);
  }
  
  button:focus {
    outline: none;
  }
  
  button.ghost {
    background: transparent;
    border-color: #fff;
  }
  
  .overlay-container {
    position: absolute;
    z-index: 100;
    width: 50%;
    height: 100%;
    top: 0;
    left: 50%;
    overflow: hidden;
    transition: transform 0.6s ease-in-out;
  }
  
  .overlay {
    position: relative;
    height: 100%;
    width: 200%;
    left: -100%;
    background: linear-gradient(to right, #ec622b, #ef6a9d) no-repeat 0 0 / cover;
    color: #fff;
    transform: translateY(0);
    transition: transform 0.6s ease-in-out;
  }
  
  .overlay-panel {
    position: absolute;
    top: 0;
    height: 100%;
    width: 50%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0 40px;
    text-align: center;
    transform: translateY(0);
    transition: transform 0.6s ease-in-out;
  }
  
  .overlay-right {
    right: 0;
    transform: translateY(0);
  }
  
  .overlay-left {
    transform: translateY(-20%);
  }
  
  .container.right-panel-active .sign-in-container {
    transform: translateX(-100%);
  }

  .container.right-panel-active .overlay-container {
    transform: translateX(-100%);
}
  
  .container.right-panel-active .sign-up-container {
    transform: translateX(100%);
    opacity: 1;
    z-index: 5;
  }
  
  .container.right-panel-active .overlay {
    transform: translateX(50%);
  }
  
  .container.right-panel-active .overlay-right {
    transform: translateY(20%);
  }
  
  .container.right-panel-active .overlay-left {
    transform: translateY(0);
  }

  @media screen and (min-width: 768px) {
    .modal-dialog {
        max-width: 768px;
    }
  }

  .bg-pink-custom {
    background-color: #ef6a9d;
    border-color: #ef6a9d;
  }
  </style>
  