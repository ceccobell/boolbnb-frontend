<script>
export default {}
</script>

<template>
    <div class="container mt-4">
        <!-- Apartment Image and Rating -->
        <div class="card shadow-lg mb-4">
            <div class="position-relative">
                <img
                    src="https://via.placeholder.com/800x500"
                    alt="Apartment Title"
                    class="w-100"
                    style="height: 500px; object-fit: cover" />
            </div>

            <!-- Apartment Details -->
            <div class="card-body d-flex flex-wrap">
                <div class="col-6">
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <h2 class="h4 font-weight-bold text-dark">Apartment Title</h2>
                    </div>

                    <!-- Address and Features -->
                    <div class="mb-4">
                        <div class="d-flex align-items-center text-muted mb-3">
                            <i class="fas fa-map-pin icon me-2"></i>
                            <span>123 Main Street, City</span>
                        </div>
                        <div class="row text-center">
                            <div class="col">
                                <i class="fas fa-home icon me-2"></i>
                                <p class="font-weight-bold mb-0">3</p>
                                <small class="text-muted">Rooms</small>
                            </div>
                            <div class="col">
                                <i class="fas fa-bed icon me-2"></i>
                                <p class="font-weight-bold mb-0">2</p>
                                <small class="text-muted">Beds</small>
                            </div>
                            <div class="col">
                                <i class="fas fa-bath icon me-2"></i>
                                <p class="font-weight-bold mb-0">1</p>
                                <small class="text-muted">Bathrooms</small>
                            </div>
                            <div class="col">
                                <i class="fas fa-ruler-combined icon me-2"></i>
                                <p class="font-weight-bold mb-0">120m²</p>
                                <small class="text-muted">Area</small>
                            </div>
                        </div>
                    </div>

                    <!-- Description -->
                    <div class="mb-4">
                        <h3 class="h5">Descrizione</h3>
                        <p class="text-muted">
                            This is a lovely apartment with all the necessary amenities.
                        </p>
                    </div>

                    <!-- Servizi -->
                    <div class="mb-4">
                        <h3 class="h5">Servizi</h3>
                        <div class="row">
                            <div class="col-6 d-flex align-items-center text-muted">
                                <i class="fas fa-wifi icon me-2"></i>
                                <span>Wifi</span>
                            </div>
                            <div class="col-6 d-flex align-items-center text-muted">
                                <i class="fas fa-phone-alt icon me-2"></i>
                                <span>Phone</span>
                            </div>
                            <div class="col-6 d-flex align-items-center text-muted">
                                <i class="far fa-building icon me-2"></i>
                                <span>Parking</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Location Map Placeholder -->
                <div class="mb-4 col-6">
                    <h3 class="h5">Dove sarai</h3>
                    <div
                        class="map-container bg-light d-flex align-items-center justify-content-center">
                        <p>Google Map Placeholder</p>
                    </div>
                </div>

                <!-- Contact Owner Form -->
                <div class="bg-light p-4 rounded mb-4 col-12">
                    <h3 class="h5">Contatta il Proprietario</h3>
                    <form>
                        <div class="mb-3">
                            <textarea
                                class="form-control"
                                rows="4"
                                placeholder="Scrivi il tuo messaggio qui..."></textarea>
                        </div>
                        <button
                            type="submit"
                            class="btn btn-submit w-100 d-flex align-items-center justify-content-center">
                            <i class="fas fa-paper-plane me-2"></i> Invia Messaggio
                        </button>
                    </form>
                </div>

                <!-- Property Owner Information -->
                <div class="col-12 d-flex align-items-center mt-4 border-top pt-3">
                    <i class="fas fa-user icon me-2"></i>
                    <div>
                        <small class="text-muted">Propretario Appartamento</small>
                        <p class="font-weight-bold mb-0">John Doe</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.icon {
    color: #ec622b;
}
.rating-badge {
    background-color: #ef6a9d;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 1rem;
    display: flex;
    align-items: center;
}
.btn-submit {
    background-color: #ef6a9d;
    color: white;
    transition: background-color 0.3s ease;
}
.btn-submit:hover {
    background-color: #f578a8;
}
.map-container {
    height: 300px;
    width: 100%;
}
</style>
