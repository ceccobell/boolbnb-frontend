<script>
import AuthForm from "./AuthForm.vue"
import { store } from "../../store"
import axios from "axios"

export default {
    components: {
        AuthForm,
    },
    data() {
        return {
            itemsNavbar: [
                {
                    nome: "Home",
                    url: "#",
                    active: true,
                },
                {
                    nome: "Come lavoriamo",
                    url: "#",
                    active: false,
                },
                {
                    nome: "Proprietari",
                    url: "#",
                    active: false,
                },
                {
                    nome: "Contatti",
                    url: "#",
                    active: false,
                },
            ],
            isAuthFormVisible: false,
            store,
        }
    },
    methods: {
        closeCanvas(value) {
            this.isAuthFormVisible = false
        },
        logout() {
            const token = localStorage.getItem("authToken")

            axios
                .post(
                    `http://127.0.0.1:8000/api/logout`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
                .then(() => {
                    localStorage.removeItem("authToken")
                    store.isAuthenticated = false
                    this.$emit("close-modal", false)
                })
                .catch((error) => {
                    console.error("Logout error:", error.response.data)
                })
        },
    },
    mounted() {
        store.isAuthenticated = !!localStorage.getItem("authToken")
    },
}
</script>

<template>
    <header>
        <nav class="navbar navbar-expand-lg bg-body-tertiary">
            <div class="container d-flex justify-content-between">
                <a class="navbar-brand" href="#">
                    <img src="/boolbnb_logo.png" alt="logo" class="logo" />
                </a>
                <div class="" id="navbarSupportedContent">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item" v-for="(item, index) in itemsNavbar" :key="index">
                            <a
                                class="nav-link"
                                :class="item.active ? 'active' : ''"
                                aria-current="page"
                                :href="item.url"
                                >{{ item.nome }}</a
                            >
                        </li>
                        <li>
                            <a
                                v-show="!store.isAuthenticated"
                                href="#"
                                class="btn btn-accedi"
                                @click="isAuthFormVisible = true"
                                ><i class="fa-solid fa-user"></i> Accedi</a
                            >
                            <a
                                v-show="store.isAuthenticated"
                                href="#"
                                class="btn btn-accedi"
                                @click="logout"
                                ><i class="fa-solid fa-user"></i> Esci</a
                            >
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    </header>
    <teleport to='body'>
        <transition>
            <div class="overlay" v-if="isAuthFormVisible" @click="closeCanvas"></div>
          </transition>
          <transition>
            <AuthForm v-if="isAuthFormVisible" @close-canva="closeCanvas" />
          </transition>
    </teleport>
</template>

<style scoped>
header nav {
    width: 100%;
    height: 75px;
    position: fixed;
    top: 0;
}

.logo {
    height: 75px;
    width: auto;
}

.btn-accedi {
    background-color: #ef6a9d;
    text-decoration: none;
    color: white;
}

.btn-accedi:hover {
    background-color: #d8598a;
    color: white;
}

.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 9998;
  }
</style>
