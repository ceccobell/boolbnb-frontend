import { createRouter, createWebHistory } from "vue-router"

import HomePage from "./components/HomePage.vue"
import MyApartments from "./components/MyApartments.vue"

const routes = [
    { path: "/", component: HomePage },
    { path: "/myapartments", component: MyApartments },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
