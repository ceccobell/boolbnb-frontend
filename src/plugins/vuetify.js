// src/plugins/vuetify.js
import { createVuetify } from 'vuetify';
import 'vuetify/styles'; // Importa gli stili globali di Vuetify

// Importa i componenti che desideri utilizzare
import { VBtn, VList, VListItem, VListItemTitle, VMenu } from 'vuetify/components';

// Crea Vuetify e registri i componenti
export default createVuetify({
    components: {
        VBtn,
        VList,
        VListItem,
        VListItemTitle,
        VMenu,
    },
});
