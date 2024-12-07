<script>
import AuthForm from "./AuthForm.vue"
import { store } from "../store"
import axios from "axios"

export default {
    components: {
        AuthForm,
    },
    data: () => ({
        itemsNavbar: [
            {
                nome: "Home",
                url: "/",
                active: true,
            },
            {
                nome: "Miei Appartamenti",
                url: "/myapartments",
                active: false,
            },
        ],
        isAuthFormVisible: false,
        store,
        items: [
            { title: "Home", url: "/" },
            { title: "Miei Appartamenti", url: "/myapartments" },
        ],
    }),
    methods: {
        closeCanvas() {
            this.isAuthFormVisible = false
        },
        selectItem(selectedItem) {
            this.itemsNavbar.forEach((item) => {
                item.active = item === selectedItem
            })
        },
        setSelectedNavbarItem() {
            const currentPath = this.$route.path
            this.itemsNavbar.forEach((item) => {
                item.active = item.url === currentPath
            })
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
                    this.$router.push("/")
                    localStorage.removeItem("authToken")
                    store.isAuthenticated = false
                    location.reload()
                    this.$emit("close-modal", false)
                })
                .catch((error) => {
                    console.error("Logout error:", error.response.data)
                })
        },
    },
    watch: {
        $route() {
            this.setSelectedNavbarItem()
        },
    },
    mounted() {
        store.isAuthenticated = !!localStorage.getItem("authToken")
        this.setSelectedNavbarItem()
    },
}
</script>

<template>
    <header>
        <nav class="navbar navbar-expand-lg bg-body-tertiary">
            <div class="container d-flex justify-content-between">
                <a class="navbar-brand" href="/">
                    <img src="/boolbnb_logo.png" alt="logo" class="logo" />
                </a>
                <div class="" id="navbarSupportedContent">
                    <ul class="navbar-nav d-flex me-auto mb-2 mb-lg-0">
                        <li
                            class="nav-item default-menu"
                            v-for="(item, index) in itemsNavbar"
                            :key="index">
                            <router-link
                                v-if="item.nome !== 'Miei Appartamenti' || store.isAuthenticated"
                                class="nav-link position-relative"
                                :class="item.active ? 'active' : ''"
                                aria-current="page"
                                :to="item.url"
                                @click="selectItem(item)"
                                >{{ item.nome
                                }}<span
                                    v-show="item.nome === 'Miei Appartamenti'"
                                    class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                    {{ store.messagesCounter }}
                                </span></router-link
                            >
                        </li>

                        <!-- Dropdown menu with Vuetify components -->
                        <li class="nav-item hamburger-menu">
                            <div class="text-center">
                                <v-menu open-on-hover>
                                    <template v-slot:activator="{ props }">
                                        <v-btn color="#ef6a9d" v-bind="props">
                                            <i class="fa-solid fa-bars"></i>
                                        </v-btn>
                                    </template>

                                    <v-list>
                                        <v-list-item v-for="(item, index) in items" :key="index">
                                            <v-list-item-title
                                                ><router-link
                                                    v-if="
                                                        item.nome !== 'Miei Appartamenti' ||
                                                        store.isAuthenticated
                                                    "
                                                    :to="item.url"
                                                    class="text-decoration-none text-black position-relative"
                                                    >{{ item.title
                                                    }}<span
                                                        v-show="item.nome === 'Miei Appartamenti'"
                                                        class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                                        {{ store.messagesCounter }}
                                                    </span></router-link
                                                ></v-list-item-title
                                            >
                                        </v-list-item>
                                        <v-list-item>
                                            <v-list-item>
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
                                            </v-list-item>
                                        </v-list-item>
                                    </v-list>
                                </v-menu>
                            </div>
                        </li>
                        <li class="nav-item log-in">
                            <a
                                v-show="!store.isAuthenticated"
                                href="#"
                                class="btn btn-accedi ms-4"
                                @click="isAuthFormVisible = true"
                                ><i class="fa-solid fa-user"></i> Accedi</a
                            >
                            <a
                                v-show="store.isAuthenticated"
                                href="#"
                                class="btn btn-accedi ms-4"
                                @click="logout"
                                ><i class="fa-solid fa-user"></i> Esci</a
                            >
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    </header>
    <teleport to="body">
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
    position: fixed;
    top: 0;
    z-index: 10000000;
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

.hamburger-menu {
    display: none;
}

@media (max-width: 991px) {
    .default-menu {
        display: none;
    }

    .log-in {
        display: none;
    }

    .hamburger-menu {
        display: block;
    }
}
</style>
