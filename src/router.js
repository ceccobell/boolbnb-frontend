import { createRouter, createWebHistory } from "vue-router"

import HomePage from "./components/HomePage.vue"
import MyApartments from "./components/MyApartments.vue"
import ShowInfoApt from "./components/ShowInfoApt.vue"

const routes = [
    { path: "/", component: HomePage },
    { path: "/myapartments", component: MyApartments },
    { path: "/apartment-details/:slug", name: "ApartmentDetails", component: ShowInfoApt },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
