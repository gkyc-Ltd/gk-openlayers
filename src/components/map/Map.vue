<template lang="">
  <div :ref="(el) => (mapRef = el)">
    <slot></slot>
  </div>
</template>

<script>
import { ref, provide, onMounted, onUnmounted, watch } from "vue";

import Map from "ol/Map";
import usePropsAsObjectProperties from "@/composables/usePropsAsObjectProperties";
import DoubleClickZoom from "ol/interaction/DoubleClickZoom";
import DragPan from "ol/interaction/DragPan";
import { always } from "ol/events/condition";

export default {
  name: "ol-map",
  setup(props, { emit }) {
    const { properties } = usePropsAsObjectProperties(props);

    const mapRef = ref(null);

    let map = new Map(properties);

    watch(properties, () => {
      map.setProperties(properties);
    });

    let drapani = new DragPan({ condition: always });

    onMounted(() => {
      map.setTarget(mapRef.value);

      //   document.onmousedown = function (e) {
      //     if (e.button == 2) {
      //       console.log("你点了右键");
      //     } else if (e.button == 0) {
      //       console.log("你点了左键");
      //     } else if (e.button == 1) {
      //       console.log("你点了滚轮");
      //     }
      //   };
      //   document.onmouseup = function () {
      //     console.log("end");
      //   };
      //   console.log("window.addEventListener", window.addEventListener);
      //   //兼容性写法，该函数也是网上别人写的，不过找不到出处了，蛮好的，所有我也没有必要修改了
      //   //判断鼠标滚轮滚动方向
      //   if (window.addEventListener)
      //     //FF,火狐浏览器会识别该方法
      //     window.addEventListener("DOMMouseScroll", wheel, false);
      //   window.onmousewheel = document.onmousewheel = wheel; //W3C
      //   //统一处理滚轮滚动事件
      //   function wheel(event) {
      //     console.log(event);
      //     var delta = 0;
      //     if (!event) event = window.event;
      //     if (event.wheelDelta) {
      //       //IE、chrome浏览器使用的是wheelDelta，并且值为“正负120”
      //       delta = event.wheelDelta / 120;
      //       if (window.opera) delta = -delta; //因为IE、chrome等向下滚动是负值，FF是正值，为了处理一致性，在此取反处理
      //     } else if (event.detail) {
      //       //FF浏览器使用的是detail,其值为“正负3”
      //       delta = -event.detail / 3;
      //     }
      //     if (delta) handle(delta);
      //   }
      //   //上下滚动时的具体处理函数
      //   function handle(delta) {
      //     if (delta < 0) {
      //       //向下滚动
      //     } else {
      //       //向上滚动
      //     }
      //   }
      map.addInteraction(drapani);
    });

    onUnmounted(() => {
      map.removeInteraction(drapani);
      map.setTarget(null);
      map = null;
    });

    provide("map", map);

    const focus = () => map.focus();
    const forEachFeatureAtPixel = (pixel, callback, options = {}) =>
      map.forEachFeatureAtPixel(pixel, callback, options);
    const forEachLayerAtPixel = (pixel, callback, layerFilter) =>
      map.forEachLayerAtPixel(pixel, callback, layerFilter);
    const getCoordinateFromPixel = (pixel) => map.getCoordinateFromPixel(pixel);
    const refresh = () => map.refresh();
    const render = () => map.render();
    const updateSize = () => map.updateSize();

    map.on("click", (event) => emit("click", event));
    map.on("dblclick", (event) => emit("dblclick", event));
    map.on("singleclick", (event) => emit("singleclick", event));
    map.on("pointerdrag", (event) => emit("pointerdrag", event));
    map.on("pointermove", (event) => emit("pointermove", event));

    map.on("movestart", (event) => emit("movestart", event));
    map.on("moveend", (event) => emit("moveend", event));
    map.on("postrender", (event) => emit("postrender", event));
    map.on("precompose", (event) => emit("precompose", event));
    map.on("postcompose", (event) => emit("postcompose", event));

    // /***
    //  *地图 长按事件
    //  */
    // var longpress = false;
    // //click 事件
    // map.on("click", function (e) {
    //   longpress ? alert("Long Press") : alert("Short Press");
    //   console.log(map.getEventCoordinate(e.pixel));
    // });
    // let startTime = null;

    // let endTime = "";
    // map.on("pointerdown", function () {
    //   startTime = new Date().getTime();
    // });

    // map.on("pointerup", function () {
    //   endTime = new Date().getTime();
    //   console.log(endTime - startTime);
    //   longpress = endTime - startTime < 500 ? false : true;
    // });

    // const xx = (event) => {
    //   console.log(event);
    // };

    // 删除默认的双击事件
    const dblClickInteraction = map
      .getInteractions()
      .getArray()
      .find((interaction) => {
        return interaction instanceof DoubleClickZoom;
      });
    map.removeInteraction(dblClickInteraction);

    // // 删除默认的双击事件
    // const shiftDragZoomInteraction = map
    //   .getInteractions()
    //   .getArray()
    //   .find(interaction => {
    //     return interaction instanceof DoubleClickZoom
    //   })
    // map.removeInteraction(dblClickInteraction)

    // interactions: ol.interaction.defaults({ doubleClickZoom: false,//
    // 取消双击放大功能交互 mouseWheelZoom: false, // 取消滚动鼠标中间的滑轮交互
    // shiftDragZoom: false, // 取消shift+wheel左键拖动交互 }) ————————————————
    // 版权声明：本文为CSDN博主「study_7forever」的原创文章，遵循CC 4.0
    // BY-SA版权协议，转载请附上原文出处链接及本声明。
    // 原文链接：https://blog.csdn.net/study_7forever/article/details/102891308

    return {
      map,
      mapRef,
      focus,
      forEachFeatureAtPixel,
      forEachLayerAtPixel,
      getCoordinateFromPixel,
      refresh,
      render,
      updateSize,
    };
  },
  props: {
    loadTilesWhileAnimating: {
      type: Boolean,
      default: false,
    },
    loadTilesWhileInteracting: {
      type: Boolean,
      default: false,
    },
    moveTolerance: {
      type: Number,
      default: 1,
    },
    pixelRatio: {
      type: Number,
      default: 1,
    },
    controls: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<style lang=""></style>
