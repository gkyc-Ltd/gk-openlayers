/*
 * @Author: ypc
 * @Date: 2022-05-05 16:16:11
 * @LastEditors: ypc
 * @LastEditTime: 2022-06-16 16:38:43
 * @Description: file content
 * @FilePath: \gk-estor-openlayers\src\main.js
 */
import { createApp } from "vue";
import App from "./App.vue";
import OpenLayersMap from ".";
// import OpenLayersMap from "gk-openlayers";
// import "gk-openlayers/dist/gk-openlayers.css";
console.log("---------------OpenLayersMap---------------------");
console.log(OpenLayersMap);
console.log("------------------------------------");
const app = createApp(App);
app.use(OpenLayersMap);

app.mount("#app");
