<template lang="">
  <slot></slot>
</template>

<script>
import { inject, watch, onMounted, onUnmounted } from "vue";

import usePropsAsObjectProperties from "@/composables/usePropsAsObjectProperties";
import SnapGuides from "ol-ext//interaction/SnapGuides";
import VectorImage from "ol/layer/VectorImage";

export default {
  name: "ol-interaction-snapguides",
  setup(props) {
    const map = inject("map");
    const draw = inject("draw");
    const { properties } = usePropsAsObjectProperties(props);

    let createsnapGuides = () => {
      let s = new SnapGuides({
        vectorClass: VectorImage,
      });
      const { drawType } = properties;
      console.log("+++++++++++++++++++++", drawType);
      s.setDrawInteraction(draw);
      return s;
    };
    let snapGuides = createsnapGuides();

    //绘制引导线
    //   let snapi = new SnapGuides({
    //     vectorClass: VectorImage,
    //   });
    //   snapi.setDrawInteraction(draw);
    //   map.addInteraction(snapi);
    //   console.log(isGuide.value);
    //   if (type.value == "Rectangle" || !isGuide.value) {
    //     map.removeInteraction(snapi);
    //   }
    //   var p1 = transform(
    //     [0 || 0, 1],
    //     "EPSG:4326",
    //     map.getView().getProjection()
    //   );
    //   var p2 = transform(
    //     [0 || 0, -1],
    //     "EPSG:4326",
    //     map.getView().getProjection()
    //   );
    //   snapi.addGuide([p1, p2]);
    // let createSnapGuides = () => {
    //   snapi = new SnapGuides({
    //     vectorClass: VectorImage,
    //   });
    //   snapi.setDrawInteraction(draw);
    //   // snapi.setModifyInteraction(modi);
    // };
    // let snapi = createSnapGuides();

    watch(properties, () => {
      map.removeInteraction(snapGuides);
      snapGuides = createsnapGuides();
      map.addInteraction(snapGuides);
      map.changed();
    });

    onMounted(() => {
      map.addInteraction(snapGuides);
    });

    onUnmounted(() => {
      map.removeInteraction(snapGuides);
    });
  },
  props: {
    drawType: {
      type: String,
      default: "",
    },
  },
};
</script>

<style lang=""></style>
