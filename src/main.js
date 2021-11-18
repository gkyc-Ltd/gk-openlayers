import { createApp } from "vue";
import App from "./App.vue";

// import OpenLayersMap from ".";

import OpenLayersMap from "gk-openlayers";
import "gk-openlayers/dist/gk-openlayers.css";

console.log("------------------------------------");
console.log(OpenLayersMap);
console.log("------------------------------------");
const app = createApp(App);
app.use(OpenLayersMap);

app.mount("#app");
