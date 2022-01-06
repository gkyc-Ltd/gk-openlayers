import { createApp } from "vue";
import App from "./APP.vue";

import OpenLayersMap from ".";
// import OpenLayersMap from "gk-openlayers";
// import "gk-openlayers/dist/gk-openlayers.css";

console.log("---------------OpenLayersMap---------------------");
console.log(OpenLayersMap);
console.log("------------------------------------");
const app = createApp(App);
app.use(OpenLayersMap);

app.mount("#app");
