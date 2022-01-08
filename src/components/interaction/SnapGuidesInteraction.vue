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
