import { createRouter, createWebHistory } from "vue-router"

import HomePage from "./components/HomePage.vue"
import MyApartments from "./components/MyApartments.vue"
import ShowInfoApt from "./components/ShowInfoApt.vue"
import CreateApartment from "./components/CreateApartment.vue"
import EditApartment from "./components/EditApartment.vue"

const routes = [
    { path: "/", component: HomePage },
    { path: "/myapartments", component: MyApartments },
    { path: "/apartment-details/:slug", name: "ApartmentDetails", component: ShowInfoApt },
    { path: "/create-apartment", component: CreateApartment },
    { path: "/edit-apartment", component: EditApartment },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
