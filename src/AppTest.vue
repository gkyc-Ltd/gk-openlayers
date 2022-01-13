<template>
  <div style="position: relative">
    <div
      class="z-index:10008; width:1000px; height:50px ; position:absolute;background:red;top:0"
    >
      <div
        v-for="(item, index) in dataHandleType"
        :key="index"
        style="width: 400px; display: inline"
        class="flex flex-wrap justify-center h-10 ml-5 text-white cursor-pointer z-1000 w-15"
        @click="changeHandleType(item.name, item.type)"
      >
        <g-icon :icon="item.icon" size="24" />

        <span class="w-full text-center">{{ item.name }}</span>
      </div>
      <div @click="saveGeoJson">save</div>
    </div>

    <div
      style="
        z-index: 10008;
        width: 300px;
        height: 300px;
        position: absolute;
        background: red;
        bottom: 0;
        right: 0;
      "
    >
      <div v-for="(item, index) in newFeaturesJson" :key="index">
        <span class="truncate">{{ item.geometry?.type }}</span>

        <span>{{ item.id }}</span>

        <span>{{ item.properties?.name }}</span>

        <span class="flex justify-between col-span-2">
          <button
            style="width: 50px; height: 50px"
            @click="handleFeatureJson('edit', item)"
          >
            x
          </button>

          <button value="删除|svg" @click="handleFeatureJson('delete', item)">
            d
          </button>

          <button value="隐藏|svg" @click="handleFeatureJson('hidden', item)">
            h
          </button>
        </span>
      </div>
    </div>

    <ol-map
      ref="refMap"
      :loadTilesWhileAnimating="true"
      :loadTilesWhileInteracting="true"
      style="height: 800px"
    >
      <ol-view
        ref="view"
        :center="center"
        :rotation="rotation"
        :zoom="zoom"
        :projection="projection"
      />

      <ol-layerswitcherimage-control />

      <ol-tile-layer ref="osmLayer" title="OSM">
        <ol-source-osm url="http://192.168.1.27:5000/global-1-11/{z}/{x}/{y}" />
      </ol-tile-layer>

      <ol-control-bar className="barclass">
        <ol-control-toggle
          :order="0"
          html="<i class='fas fa-map-marker'></i>"
          className="edit"
          title="Point"
          :onToggle="(active) => (drawEnable = false)"
        />
        <ol-control-toggle
          :order="0"
          html="<i class='fas fa-map-marker'></i>"
          className="edit"
          title="Point"
          :onToggle="(active) => changeDrawType(active, 'Point')"
        />
        <ol-control-toggle
          :order="1"
          html="<i class='fas fa-draw-polygon'></i>"
          className="edit"
          title="Polygon"
          :onToggle="(active) => changeDrawType(active, 'Polygon')"
        />
        <ol-control-toggle
          :order="2"
          html="<i class='fas fa-circle'></i>"
          className="edit"
          title="Circle"
          :onToggle="(active) => changeDrawType(active, 'Circle')"
        />
        <ol-control-toggle
          :order="3"
          html="<i class='fas fa-grip-lines'></i>"
          className="edit"
          title="LineString"
          :onToggle="(active) => changeDrawType(active, 'LineString')"
        />
        <ol-control-toggle
          :order="3"
          html="<i class='fas fa-info'></i>"
          className="edit"
          title="LineString"
          :onToggle="(active) => handleClick(active, 'undo')"
        />
        <ol-control-toggle
          :order="3"
          html="<i class='fas fa-info'></i>"
          className="edit"
          title="LineString"
          :onToggle="(active) => handleClick(active, 'redo')"
        />
        <!-- <ol-control-videorecorder :order="4" @stop="videoStopped">
        </ol-control-videorecorder>
        <ol-control-printdialog :order="5" /> -->
      </ol-control-bar>

      <ol-mouseposition-control :target="targetMouse" />
      <ol-fullscreen-control />

      <ol-overviewmap-control>
        <ol-tile-layer>
          <ol-source-osm />
        </ol-tile-layer>
      </ol-overviewmap-control>

      <ol-scaleline-control />
      <ol-rotate-control />
      <!-- <ol-zoom-control />
      <ol-zoomslider-control />
      <ol-zoomtoextent-control
        :extent="[23.906, 42.812, 46.934, 34.597]"
        tipLabel="Fit to Turkey"
      /> -->

      <ol-context-menu :items="contextMenuItems" />

      <!-- 框选 -->
      <!-- <ol-interaction-dragbox />     :condintion="condintionDrawpan  v-if="condintionDrawpan""-->
      <ol-interaction-drawpan ref="drawpanRef" :condition="condintionDrawpan" />

      <ol-interaction-undoredo @undo="onundo" ref="undoredoInteraction" />
      <!-- <ol-interaction-dragrotatezoom /> -->
      <!-- <ol-interaction-defaults></ol-interaction-defaults> -->
      <!-- <ol-interaction-clusterselect @select="featureSelected" :pointRadius="20">
        <ol-style>
          <ol-style-stroke color="green" :width="5"></ol-style-stroke>
          <ol-style-fill color="rgba(255,255,255,0.5)"></ol-style-fill>
          <ol-style-icon :src="markerIcon" :scale="0.05"></ol-style-icon>
        </ol-style>
      </ol-interaction-clusterselect> -->
      <ol-interaction-select
        @select="featureSelected"
        :condition="selectCondition"
        :filter="selectInteactionFilter"
        v-if="!drawEnable"
      >
      </ol-interaction-select>

      <ol-vector-layer
        :updateWhileInteracting="true"
        ref="vectorLayer"
        title="AIRPORTS"
        preview="https://raw.githubusercontent.com/MelihAltintas/vue3-openlayers/main/src/assets/tr.png"
      >
        <ol-interaction-transform />

        <ol-source-vector ref="vectorsource" @change="change">
          <!-- :features="zones" -->
          <!-- <ol-interaction-modify
            v-if="drawEnable"
            @modifyend="modifyend"
            @modifystart="modifystart"
          >
          </ol-interaction-modify> -->

          <ol-interaction-draw
            v-if="drawEnable"
            :type="drawType"
            @drawend="drawend"
            @drawstart="drawstart"
            ref="drawRef"
            :isGuide="true"
          />
          <!-- <ol-interaction-snapguides :drawType="drawType" />
          </ol-interaction-draw> -->

          <!-- <ol-interaction-drawregular v-if="drawEnable && sides" :sides="sides"/> -->

          <ol-interaction-snap v-if="drawEnable" />
        </ol-source-vector>

        <ol-style>
          <ol-style-stroke :color="drawcolor" :width="2"></ol-style-stroke>
          <ol-style-fill :color="drawcolor"></ol-style-fill>
          <ol-style-circle :color="drawcolor" radius="2"></ol-style-circle>
        </ol-style>
      </ol-vector-layer>

      <ol-overlay
        :position="selectedCityPosition"
        v-if="selectedCityName != '' && !drawEnable"
      >
        <template v-slot="slotProps">
          <div class="overlay-content">
            444 {{ selectedCityName }} {{ slotProps }}
          </div>
        </template>
      </ol-overlay>
    </ol-map>
  </div>
</template>

<script>
import { ref, inject, onMounted, watchEffect, reactive, toRefs } from "vue";
import { Collection } from "ol";
import markerIcon from "@/assets/marker.png";
import starIcon from "@/assets/star.png";
import { Fill, Stroke, Style, Text } from "ol/style";
// import DoubleClickZoom from "ol/interaction/DoubleClickZoom";
// import DragPan from "ol/interaction/DragPan";
import * as coordinateX from "ol/coordinate";
import { always, doubleClick } from "ol/events/condition";
// import { create } from 'ol/transform'
// import { circular as circularPolygon } from 'ol/geom/Polygon';

// import { transform } from "ol/proj";
export default {
  setup() {
    const center = ref([-102.13121, 40.2436]);
    const projection = ref("EPSG:4326");
    const zoom = ref(6);
    const rotation = ref(0);
    const format = inject("ol-format");
    const geoJson = new format.GeoJSON();

    const coordinatex = inject("ol-coordinate");
    console.log("-----------------8888-------------------");
    console.log(coordinatex);
    console.log("------------------------------------");

    function saveGeoJson() {
      console.log(state.newFeaturesJson);

      // let data = {
      //   otherProperties: {

      //     sampleId: 23,

      //     center: [13005097, 2357611],

      //     zoom: '23132',

      //     layer: 'test:东沙群岛6G',

      //   },

      //   vector: {

      //     crs: {

      //       type: 'name',

      //       properties: {

      //         name: 'EPSG:4326',

      //       },

      //     },

      //     type: 'FeatureCollection',

      //     features: geoJsonFormat.writeFeaturesObject(newSourceFeature).features,

      //   },

      // };

      // postManSlabSaveApi(data);

      // console.log(geoJsonFormat.writeFeaturesObject(newSourceFeature).features);
    }

    function createLabelAll() {
      state.newFeatures.map((feature) => {
        createLabelStyle(feature);
      });
    }

    /*创建标注样式

     *@param{object}  feature  标注要素

     */

    function createLabelStyle(feature, isSelected) {
      //返回一个样式
      feature.setStyle(
        new Style({
          //文本样式

          text: new Text({
            textAlign: "center", //对齐方式

            textBaseline: "middle", //文本基线

            font: "normal 12px 微软雅黑", //字体样式

            text: feature.get("name"), //文本内容

            // offsetY: -25, // Y轴偏置

            fill: new Fill({
              //填充样式 文本

              color: "#FFFFFF",
            }),

            backgroundFill: new Fill({
              // 填充背景

              color: [0, 0, 0, 0.6],
            }),

            padding: [2, 5, 2, 5],
          }),

          stroke: new Stroke({
            color:
              feature
                .get("color")
                .substring(0, feature.get("color").lastIndexOf(",")) + "1)",

            width: isSelected ? 9 : 2,
          }),

          fill: new Fill({
            //填充样式

            color: feature.get("color"),
          }),

          // 设置层级

          zIndex: 199,
        })
      );
    }

    let state = reactive({
      source: [
        {
          name: "春天",
          children: [
            { name: "花开" },
            { name: "温暖" },
            {
              name: "光芒万丈",
              children: [
                { name: "花开" },
                { name: "温暖" },
                { name: "光芒万丈" },
              ],
            },
          ],
        },
        {
          name: "夏天",
          children: [{ name: "炎热" }, { name: "凉快" }],
        },
      ],
      drawcolor: "black",
      oldFeaturesObject: {},
      newFeatures: [],
      newFeaturesJson: [],
      newFeaturesObject: {},
      listActive: true,
      foldActive: true,
      dataHandleType: [
        { name: "选择", icon: "选择|svg" },

        { name: "点", icon: "点|svg", type: "Point" },

        { name: "线", icon: "线|svg", type: "LineString" },

        { name: "矩形", icon: "矩形|svg", type: "Rectangle" },

        { name: "斜矩形", icon: "斜矩形|svg", type: "Rhomboid" },

        { name: "圆形", icon: "园形|svg", type: "Circle" },

        { name: "多边形", icon: "多边形|svg", type: "Polygon" },

        // { name: '测距', icon: '测距|svg' },

        { name: "颜色", icon: "颜色|svg" },

        { name: "撤销", icon: "撤销|svg" },

        { name: "恢复", icon: "恢复|svg" },

        // { name: '缩小', icon: '缩小|svg' },

        // { name: '放大', icon: '放大|svg' },
        { name: "隐藏", icon: "隐藏|svg" },
      ],
    });

    var geojsonObject = {
      type: "FeatureCollection",
      crs: {
        type: "name",
        properties: {
          name: "EPSG:4326",
        },
      },
      features: [
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [-103.86923852630616, 43.45599322423934],
                [-103.90891107984544, 39.34240191087722],
                [-98.76630637117387, 39.558687199211114],
                [-98.89435771175386, 43.945405844902986],
                [-103.86923852630616, 43.45599322423934],
              ],
            ],
          },
          properties: { color: "rgba(255,255,0,0.3)", name: "xx" },
          id: 151,
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [-103.85636392303468, 38.10970692739486],
                [-103.86770698495866, 33.218572724914544],
                [-98.20654544301988, 33.6532810221672],
                [-98.4408283538437, 38.31894739375114],
                [-103.85636392303468, 38.10970692739486],
              ],
            ],
          },
          properties: { color: "rgba(255,0,0,0.3)", name: "x3x" },
          id: 2,
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [-104.10411678268781, 46.17796288310605],
                [-106.10411678268781, 44.87682371292652],
                [-100.92047838756771, 44.87682371292652],
                [-98.92047838756771, 46.17796288310605],
                [-104.10411678268781, 46.17796288310605],
              ],
            ],
          },
          properties: { color: "rgba(255,0,0,0.3)", name: "x3x" },
          id: "174",
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [-112.33372929814959, 46.463212857427806],
                [-114.33372929814959, 44.539624407282595],
                [-107.0926477238409, 44.539624407282595],
                [-105.0926477238409, 46.463212857427806],
                [-112.33372929814959, 46.463212857427806],
              ],
            ],
          },
          properties: { color: "rgba(255,0,0,0.3)", name: "x3x" },
          id: "1564",
        },
      ],
    };

    const zones = ref([]);
    zones.value = geoJson.readFeatures(geojsonObject);

    function handleFeatureJson(type, item) {
      if (type === "delete") {
        console.log(item.id);
        let feature = vectorsource.value.source.getFeatureById(item.id);

        console.log(feature);
        // console.log(vectorLayer.value);
        vectorsource.value.source.removeFeature(feature);
        console.log(vectorsource.value.source.getFeatures());

        //    vectorsource.value.source.clear();
      }
    }

    const selectedFeatures = ref(new Collection());

    const selectConditions = inject("ol-selectconditions");

    const selectCondition = selectConditions.doubleClick;
    const selectedCityName = ref("");
    const selectedCityPosition = ref([]);

    const extent = inject("ol-extent");

    const Feature = inject("ol-feature");
    const Geom = inject("ol-geom");

    const contextMenuItems = ref([]);
    const vectorLayer = ref(null);
    const vectorsource = ref(null);

    const view = ref(null);
    const undoredoInteraction = ref(null);

    const drawEnable = ref(false);
    const drawType = ref("Point");
    const map = inject("map");

    const drawend = (event) => {
      // zones.value.push(event.feature)
      console.log("00");
      console.log(vectorsource.value.source.getFeatures());

      console.log(event.feature.getGeometry());

      event.feature.setId(event.feature.ol_uid);

      //   console.log(event.feature.getCoordinates())

      selectedFeatures.value.push(event.feature);
    };

    const changeHandleType = (name, type) => {
      console.log(undoredoInteraction);

      if (type) {
        drawEnable.value = true;

        drawType.value = type;
      } else {
        drawEnable.value = false;

        console.log(name);

        if (name === "撤销") {
          console.log(undoredoInteraction.value.undoredo.undo);

          undoredoInteraction.value.undoredo.undo();
        }

        if (name === "恢复") {
          undoredoInteraction.value.undoredo.redo();
        }
      }
    };

    const onundo = (e) => {
      console.log(vectorsource.value.source);
      console.log(e);
    };

    const handleClick = (active, type) => {
      console.log(map);

      console.log(undoredoInteraction.value.undoredo.getStack());

      if (type === "undo") {
        undoredoInteraction.value.undoredo.undo();
      } else {
        undoredoInteraction.value.undoredo.redo();
      }
    };

    const changeDrawType = (active, draw) => {
      drawEnable.value = active;
      drawType.value = draw;
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

    function change(item) {
      state.newFeatures = item;
      state.newFeaturesJson = geoJson.writeFeaturesObject(item).features;
      state.newFeaturesObject = geoJson.writeFeaturesObject(item);

      //   createLabelAll()

      console.log(state.newFeaturesJson);
    }

    const selectInteactionFilter = (feature) => {
      console.log("------------88------------------------");
      console.log(feature.values_.name);
      console.log("------------------------------------");
      return feature.values_.name != undefined;
    };

    const featureSelected = (event) => {
      console.log("我进来了");
      console.log(event.selected.length);
      console.log("rrrr", event.selected[0].getGeometry());
      var coordinate2 = event.selected[0].getGeometry().getCoordinates();
      //move coordinates some distance
      console.log(coordinateX);
      coordinateX.add(coordinate2, center.value[0], center.value[1]);
      // use setGeometry to move it
      // selectedFeatures.value.array_[0].setGeometry(new coordinateX());
      // selectedFeatures.value.array_[0].getGeometry().translate(center.value);
      // refCascader.value.blur();

      if (event.selected.length == 1) {
        selectedCityPosition.value = extent.getCenter(
          event.selected[0].getGeometry().extent_
        );
        // center.value = selectedCityPosition.value;
        selectedFeatures.value = event.target.getFeatures();
        createLabelStyle(event.selected[0], true); //改变当前fetaure样式
        event.selected[0].changed();
        // createLabelAll()
        // let m_center = transform(center.value, 'EPSG:4326', 'EPSG:4326');
        // console.log(m_center);
        // selectedCityPosition.value = m_center
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

    const getRandomInRange = (from, to, fixed) => {
      return (Math.random() * (to - from) + from).toFixed(fixed) * 1;
    };

    const drawstart = (event) => {
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

    watchEffect(() => {
      console.log();
    });
    const refMap = ref(null);

    // async function disableMove() {
    //   refMap.value.map.getInteractions().forEach(function (element) {
    //     // console.log(element);
    //     if (element instanceof DragPan) {
    //       console.log("xxxxx", element);
    //       element.setActive(drapanActive.value);
    //     }
    //   });
    // }

    const targetMouse = ref(null);

    const drawpanRef = ref(null);

    const condintionDrawpan = ref(doubleClick);

    onMounted(() => {
      //   disableMove();
      //   drawpanRef.value.drawpan.setActive(false);

      document.onmousedown = function (e) {
        if (e.button == 2) {
          condintionDrawpan.value = doubleClick;
          console.log("你点了右键");
        } else if (e.button == 0) {
          condintionDrawpan.value = doubleClick;
          console.log("你点了左键");
        } else if (e.button == 1) {
          console.log("你点了滚轮");
          //   drawpanRef.value.drawpan.setActive(true);
          //   refMap.value.map.changed();
          //   console.log(drawpanRef.value.drawpan.getActive());
          condintionDrawpan.value = always;
          //   refMap.value.map.updateSize();
        }
      };
      document.onmouseup = function () {
        console.log("end", doubleClick, always);
        // drawpanRef.value.drawpan.setActive(false);
        // condintionDrawpan.value = doubleClick;
      };

      targetMouse.value = document.getElementById("mouse-position2");
      vectorsource.value.source.addFeatures(zones.value);
      createLabelAll();

      // layerList.value.push(jawgLayer.value.tileLayer);
      // layerList.value.push(osmLayer.value.tileLayer);
      // console.log(layerList.value)
      // console.log(animationPath.value)
    });
    const drawRef = ref();
    return {
      drawRef,
      condintionDrawpan,
      refMap,
      drawpanRef,
      targetMouse,
      saveGeoJson,
      changeHandleType,
      vectorLayer,
      handleFeatureJson,
      ...toRefs(state),
      state,
      change,
      onundo,
      zones,
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
      undoredoInteraction,
      osmLayer,
      starIcon,
      changeDrawType,
      handleClick,
      path,
      animationPath,
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

.barclass {
  background: rgb(0 0 0 / 20%) !important;
  width: 200px !important;
  left: 300px !important;
}
</style>
