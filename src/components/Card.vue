<template>
    <div class="content">
        <div class="card border-0">
            <img
                v-if="apartment.images.length > 0 && apartment.images[0].url"
                :src="apartment.images[0].url"
                class="card-img-top"
                alt="Property Image" />
            <span
                v-if="apartment.unreadMessages && apartment.unreadMessages.length > 0"
                class="position-absolute top-50 start-50 translate-middle badge rounded-pill bg-danger">
                {{ apartment.unreadMessages.length }}
            </span>
            <div class="card-content">
                <h2>
                    {{ apartment.title }} <span class="city">{{ apartment.city }}</span>
                </h2>
                <p>{{ apartment.description }}</p>
                <button class="button button-details px-2 py-1" @click="goToApartmentDetails(apartment)">
                    Scopri
                    <span class="material-symbols-outlined"> &rarr; </span>
                </button>
            </div>
            <button
                v-if="showSponsorButton"
                type="button"
                class="position-absolute top-0 end-0 m-2"
                @click="sponsor(apartment)"
                data-bs-toggle="modal"
                data-bs-target="#staticBackdrop">
                <span class="btn btn-warning" v-if="apartment.latest_package == null">
                    <i class="fa-solid fa-crown"></i> Sponsor
                </span>
                <span class="btn btn-danger" v-if="apartment.latest_package">
                    <i class="fa-solid fa-business-time"></i>
                    {{ apartment.latest_package.pivot.sponsorship_end }}
                </span>
            </button>
        </div>
    </div>
</template>

<script>
import { store } from "../store"
export default {
    props: {
        apartment: Object,
        showSponsorButton: Boolean,
    },
    data() {
        return {
            store,
        }
    },
    computed: {
        formattedSponsorshipEnd() {
            return this.apartment.latest_package?.pivot?.sponsorship_end.split(" ")[0]
        },
    },

    methods: {
        handleEditClick(apartment) {
            this.store.apartmentToEdit = apartment
            this.$router.push("/edit-apartment") // Naviga programmaticamente
        },
        sponsor(apartment) {
            store.apartmentToSponsor = apartment
        },
        goToApartmentDetails(apartment) {
            store.currentApartment = apartment
            this.$router.push({ name: "ApartmentDetails", params: { slug: apartment.slug } })
        },
    },
}
</script>

<style scoped>
/* .card {
    margin: 15px;
    cursor: pointer;
    transition: transform 0.3s ease;
} */

.card:hover {
    transform: scale(1.05);
    transition: transform 0.5s ease-out;

    img {
        filter: brightness(60%);
        opacity: 0.9;
    }
}

/* .card-img-top {
    height: 300px;
    object-fit: cover;
    border-radius: 8px;
} */

.content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 50px;
    font-family: "Roboto", sans-serif;
}

.card {
    position: relative;
    width: 20rem;
    height: 30rem;
    border-radius: 10px;
    overflow: hidden;
    cursor: pointer;
    color: rgb(240, 240, 240);
    box-shadow: 0 10px 30px 5px rgba(0, 0, 0, 0.2);

    img {
        position: absolute;
        object-fit: cover;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        opacity: 0.9;
        transition: opacity 0.2s ease-out, filter 0.5s ease-in;
    }

    h2 {
        position: absolute;
        inset: auto auto 30px 30px;
        margin: 0;
        transition: inset 0.3s 0.3s ease-out;
        font-family: "Roboto Condensed", sans-serif;
        font-weight: normal;
        text-transform: uppercase;
    }

    p,
    .button {
        position: absolute;
        opacity: 0;
        max-width: 80%;
        transition: opacity 0.3s ease-out;
    }

    p {
        inset: auto auto 80px 30px;
    }

    .button-details {
        inset: auto auto 40px 30px;
        text-decoration: none;
        border: 1px solid black;
        background-color: #ec622b;
        &:hover {
            background-color: #ff8858;
            color: black;
        }
    }

    &:hover h2 {
        inset: auto auto 220px 30px;
        transition: inset 0.3s ease-out;
    }

    &:hover p,
    &:hover .button {
        opacity: 1;
        transition: opacity 0.5s 0.1s ease-in;
    }

    &:hover img {
        transition: opacity 0.3s ease-in;
        opacity: 1;
    }
}

.material-symbols-outlined {
    vertical-align: middle;
}

.sponsor {
    background-color: #ec622b;
    color: white;
}

.city {
    text-transform: lowercas;
    font-size: 15px;
}
</style>
