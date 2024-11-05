<script>
import AuthForm from "./AuthForm.vue"

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
        }
    },
    methods: {
        closeCanvas(value) {
            this.isAuthFormVisible = value
        },
    },
}
</script>

<template>
    <header>
        <nav class="navbar navbar-expand-lg bg-body-tertiary">
            <div class="container d-flex justify-content-between">
                <a class="navbar-brand" href="#">
                    <img src="/public/boolbnb_logo.png" alt="logo" class="logo" />
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
                            <a href="#" class="btn btn-accedi" @click="isAuthFormVisible = true"
                                ><i class="fa-solid fa-user"></i> Accedi</a
                            >
                        </li>
                    </ul>
                </div>
            </div>
            <transition>
                <div class="overlay" v-if="isAuthFormVisible"></div>
            </transition>
            <transition>
                <AuthForm v-if="isAuthFormVisible" @close-canva="closeCanvas" />
            </transition>
        </nav>
    </header>
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
</style>
