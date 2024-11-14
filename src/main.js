import { createApp } from "vue"
import "./style.css"
import App from "./App.vue"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import router from "./router"
import vuetify from './plugins/vuetify.js';
import 'vuetify/styles'

createApp(App).use(router).use(vuetify).mount("#app")
