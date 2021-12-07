<template lang="">
  <div :ref="el => (mapRef = el)">
    <slot></slot>
  </div>
</template>

<script>
import { ref, provide, onMounted, onUnmounted, watch } from "vue";

import Map from "ol/Map";
import usePropsAsObjectProperties from "@/composables/usePropsAsObjectProperties";
import DoubleClickZoom from "ol/interaction/DoubleClickZoom";

export default {
  name: "ol-map",
  setup(props, { emit }) {
    const { properties } = usePropsAsObjectProperties(props);

    const mapRef = ref(null);

    let map = new Map(properties);

    watch(properties, () => {
      map.setProperties(properties);
    });

    onMounted(() => {
      map.setTarget(mapRef.value);
    });

    onUnmounted(() => {
      map.setTarget(null);
      map = null;
    });

    provide("map", map);

    const focus = () => map.focus();
    const forEachFeatureAtPixel = (pixel, callback, options = {}) =>
      map.forEachFeatureAtPixel(pixel, callback, options);
    const forEachLayerAtPixel = (pixel, callback, layerFilter) =>
      map.forEachLayerAtPixel(pixel, callback, layerFilter);
    const getCoordinateFromPixel = pixel => map.getCoordinateFromPixel(pixel);
    const refresh = () => map.refresh();
    const render = () => map.render();
    const updateSize = () => map.updateSize();

    map.on("click", event => emit("click", event));
    map.on("dblclick", event => emit("dblclick", event));
    map.on("singleclick", event => emit("singleclick", event));
    map.on("pointerdrag", event => emit("pointerdrag", event));
    map.on("pointermove", event => emit("pointermove", event));

    map.on("movestart", event => emit("movestart", event));
    map.on("moveend", event => emit("moveend", event));
    map.on("postrender", event => emit("postrender", event));
    map.on("precompose", event => emit("precompose", event));
    map.on("postcompose", event => emit("postcompose", event));

    // 删除默认的双击事件
    const dblClickInteraction = map
      .getInteractions()
      .getArray()
      .find(interaction => {
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
      updateSize
    };
  },
  props: {
    loadTilesWhileAnimating: {
      type: Boolean,
      default: false
    },
    loadTilesWhileInteracting: {
      type: Boolean,
      default: false
    },
    moveTolerance: {
      type: Number,
      default: 1
    },
    pixelRatio: {
      type: Number,
      default: 1
    },
    controls: {
      type: Array,
      default: () => []
    }
  }
};
</script>

<style lang=""></style>
