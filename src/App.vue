<template>
  <ol-map
    ref="map"
    :loadTilesWhileAnimating="true"
    :loadTilesWhileInteracting="true"
    style="height: 800px"
  >
    <!-- :center="[-180.0, 90.0]" -->
    <ol-view
      ref="view"
      :rotation="rotation"
      :projection="projection"
      :center="[110.10111515529255, 0.9045823915335416]"
    />
    <ol-swipe-control
      ref="swipeControl"
      v-if="layerList.length > 0"
      :layerList="layerList"
    />
    <ol-layerswitcherimage-control />
    <ol-zone-control
      :zones="zones"
      :projection="projection"
      :layer="jawgLayer.tileLayer"
      v-if="jawgLayer != null"
    >
    </ol-zone-control>

    <ol-tile-layer ref="osmLayer" title="OSM">
      <ol-source-osm />
    </ol-tile-layer>

    <ol-tile-layer ref="wmtsLayer">
      <ol-source-wmts
        :url="'http://192.168.12.1:8087/geoserver/gwc/service/wmts'"
        format="image/png"
        :layer="'testGF3:GF3_MYN_SL_024294_E127'"
        :matrixSet="'EPSG:4326'"
        :projection="'EPSG:4326'"
      />
    </ol-tile-layer>
    <ol-control-toggle
      :order="0"
      html="<i class='fas fa-map-marker'></i>"
      className="edit"
      title="Point"
      :onToggle="(active) => changeDrawType(active, 'Polygon')"
    />
    <ol-control-toggle
      :order="1"
      html="<i class='fas fa-draw-polygon'></i>"
      className="edit"
      title="Polygon"
      :onToggle="(active) => changeDrawType(active, 'undo')"
    />

    <ol-mouseposition-control />
    <ol-fullscreen-control />
    <ol-overviewmap-control>
      <ol-tile-layer>
        <ol-source-osm />
      </ol-tile-layer>
    </ol-overviewmap-control>

    <ol-scaleline-control />
    <ol-rotate-control />
    <ol-zoom-control />
    <ol-zoomslider-control />
    <ol-interaction-dragrotatezoom />
  </ol-map>
</template>

<script>
import { ref, inject, onMounted } from "vue";
import markerIcon from "@/assets/marker.png";
import starIcon from "@/assets/star.png";
// import { transform, Projection } from "ol/proj";
// import { addProjection, addCoordinateTransforms } from "ol/proj";

// import proj4 from "proj4";
export default {
  setup() {
    const wmtsLayer = ref();
    const map = ref();
    onMounted(() => {
      //   const extent = [
      //     127.69310244008429, 26.29546282130444, 127.83956576645036,
      //     26.409667575564956,
      //   ];
      //   //let extent = [minx, miny, maxx, maxy]
      //   map.value.map.on("moveend", (e) => {
      //     console.log(
      //       "222222222222222222222222222222222",
      //       map.value.map.getView().getZoom(),
      //       map.value.map.getView().getResolution()
      //     );
      //   });
      //   // // // 加入如下代码 处理resolution
      //   // let resolution = view.value.view.getResolutionForExtent(extent);
      //   // console.log("resolution++++++++++++++++++++++++++", resolution);
      //   // view.value.setResolution(resolution);
      //   view.value.view.fit(
      //     [
      //       127.69310244008429, 26.29546282130444, 127.83956576645036,
      //       26.409667575564956,
      //     ],
      //     {
      //       constrainResolution: false,
      //       earest: true,
      //       size: map.value.map.getSize(),
      //       nearest: true,
      //     }
      //   );
      //   //   console.log(''wmtsLayer.value.tileLayer);
      //   var projection_3395 = new Projection({
      //     code: "EPSG:3395",
      //     extent: [-20026376.39, -15496570.74, 20026376.39, 18764656.23],
      //     units: "m",
      //     axisOrientation: "neu",
      //   });
      //   proj4.defs(
      //     "EPSG:3395",
      //     "+proj=merc +lon_0=0 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs"
      //   );
      //   //结合proj4在ol3中自定义坐标系
      //   addProjection(projection_3395);
      //   addCoordinateTransforms(
      //     "EPSG:4326",
      //     "EPSG:3395",
      //     function (coordinate) {
      //       return proj4("EPSG:4326", "EPSG:3395", coordinate);
      //     },
      //     function (coordinate) {
      //       return proj4("EPSG:3395", "EPSG:4326", coordinate);
      //     }
      //   );
      //   addCoordinateTransforms(
      //     "EPSG:3857",
      //     "EPSG:3395",
      //     function (coordinate) {
      //       return proj4("EPSG:3857", "EPSG:3395", coordinate);
      //     },
      //     function (coordinate) {
      //       return proj4("EPSG:3395", "EPSG:3857", coordinate);
      //     }
      //   );
      //   console.log(
      //     "坐标系转换" + transform([118, 32], "EPSG:4326", "EPSG:3395")
      //   );
      //定义3395坐标系，且与其他4326,3857的互相转换
      // proj4.defs("EPSG:3395","+proj=merc +lon_0=0 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs");
      //   var google = new Projection("EPSG:32649"),
      //     latlon = new Projection("EPSG:4326");
      //   console.log(
      //     "+++++++++++++++++++++++++++++++++",
      //     transform(
      //       [392681.723649657, 93672.95605338032],
      //       "EPSG:3857",
      //       "EPSG:4326"
      //     )
      //   );
      // transforming the location to the right coordinate system
      //   var location = new toLonLat(10, 10).
      //   console.log("-------------------------------------", location);
      //   layerList.value.push(osmLayer.value.tileLayer);
      //   console.log(
      //     "---------------------------",
      //     transform(
      //       [392681.723649657, 93672.95605338032],
      //       "EPSG:6326",
      //       "EPSG:4326"
      //     )
      //   );
      //   var proj = new Projection("EPSG:4326");
      //   console.log(layerList.value);
      //   console.log(animationPath.value);
    });

    const center = ref([34, 39.13]);
    const projection = ref("EPSG:4326");
    const zoom = ref(1);
    const rotation = ref(0);
    const format = inject("ol-format");

    const geoJson = new format.GeoJSON();

    const selectConditions = inject("ol-selectconditions");

    const selectCondition = selectConditions.pointerMove;

    const selectedCityName = ref("");
    const selectedCityPosition = ref([]);

    const extent = inject("ol-extent");

    const Feature = inject("ol-feature");
    const Geom = inject("ol-geom");

    const contextMenuItems = ref([]);
    const vectorsource = ref(null);
    const view = ref(null);

    const drawEnable = ref(false);
    const drawType = ref("Polygon");

    let drawRef = ref();
    const changeDrawType = (active, draw) => {
      console.log("------------------------------------");
      console.log(active);
      console.log("------------------------------------");
      //   if (active === "undo") {
      drawRef.value.draw.removeLastPoint();
      //   }
      //   drawEnable.value = active;
      //   drawType.value = draw;
    };

    contextMenuItems.value = [
      {
        text: "Center map here",
        classname: "some-style-class", // add some CSS rules
        callback: (val) => {
          view.value.setCenter(val.coordinate);
        }, // `center` is your callback function
      },
      {
        text: "Add a Marker",
        classname: "some-style-class", // you can add this icon with a CSS class
        // instead of `icon` property (see next line)
        icon: markerIcon, // this can be relative or absolute
        callback: (val) => {
          console.log(val);
          let feature = new Feature({
            geometry: new Geom.Point(val.coordinate),
          });
          vectorsource.value.source.addFeature(feature);
        },
      },
      "-", // this is a separator
    ];

    const featureSelected = (event) => {
      if (event.selected.length == 1) {
        selectedCityPosition.value = extent.getCenter(
          event.selected[0].getGeometry().extent_
        );
        selectedCityName.value = event.selected[0].values_.name;
      } else {
        selectedCityName.value = "";
      }
    };

    const overrideStyleFunction = (feature, style) => {
      let clusteredFeatures = feature.get("features");
      let size = clusteredFeatures.length;

      let color = size > 20 ? "192,0,0" : size > 8 ? "255,128,0" : "0,128,0";
      var radius = Math.max(8, Math.min(size, 20));
      let dash = (2 * Math.PI * radius) / 6;
      let calculatedDash = [0, dash, dash, dash, dash, dash, dash];

      style.getImage().getStroke().setLineDash(dash);
      style
        .getImage()
        .getStroke()
        .setColor("rgba(" + color + ",0.5)");
      style.getImage().getStroke().setLineDash(calculatedDash);
      style
        .getImage()
        .getFill()
        .setColor("rgba(" + color + ",1)");

      style.getImage().setRadius(radius);

      style.getText().setText(size.toString());
    };

    const selectInteactionFilter = (feature) => {
      return feature.values_.name != undefined;
    };

    const getRandomInRange = (from, to, fixed) => {
      return (Math.random() * (to - from) + from).toFixed(fixed) * 1;
    };

    const drawstart = (event) => {
      console.log(event);
    };

    const drawend = (event) => {
      console.log(event);
    };

    const modifystart = (event) => {
      console.log(event);
    };

    const modifyend = (event) => {
      console.log(event);
    };

    const videoStopped = (event) => {
      console.log(event);
    };

    const swipeControl = ref(null);
    const jawgLayer = ref(null);
    const osmLayer = ref(null);
    const layerList = ref([]);
    const path = ref([
      [25.6064453125, 44.73302734375001],
      [27.759765625, 44.75500000000001],
      [28.287109375, 43.32677734375001],
      [30.55029296875, 46.40294921875001],
      [31.69287109375, 43.04113281250001],
    ]);
    const animationPath = ref(null);

    const zones = [
      {
        title: "Turkey",
        extent: [17.952, 46.241, 52.449, 31.222],
      },
      {
        title: "Cyprus",
        extent: [31.2836, 36.1623, 35.5957, 34.1823],
      },
      {
        title: "Brazil",
        extent: [-120.32, 22.76, 17.67, -47.52],
      },
    ];

    const webglPointsStyle = {
      symbol: {
        symbolType: "circle",
        size: [
          "interpolate",
          ["linear"],
          ["get", "population"],
          40000,
          8,
          2000000,
          28,
        ],
        color: "#ffed02",
        rotateWithView: false,
        offset: [0, 0],
        opacity: [
          "interpolate",
          ["linear"],
          ["get", "population"],
          40000,
          0.6,
          2000000,
          0.92,
        ],
      },
    };
    return {
      wmtsLayer,
      drawRef,
      center,
      projection,
      zoom,
      rotation,
      geoJson,
      featureSelected,
      selectCondition,
      selectedCityName,
      selectedCityPosition,
      markerIcon,
      overrideStyleFunction,
      getRandomInRange,
      contextMenuItems,
      vectorsource,
      view,
      map,
      selectInteactionFilter,
      drawstart,
      drawend,
      modifystart,
      modifyend,
      videoStopped,
      drawEnable,
      drawType,
      layerList,
      jawgLayer,
      swipeControl,
      osmLayer,
      starIcon,
      changeDrawType,
      path,
      animationPath,
      zones,
      webglPointsStyle,
    };
  },
};
</script>

<style>
.overlay-content {
  background: red !important;
  color: white;
  box-shadow: 0 5px 10px rgb(2 2 2 / 20%);
  padding: 10px 20px;
  font-size: 16px;
}
</style>
