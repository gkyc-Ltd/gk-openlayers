<template lang="">
  <slot> </slot>
</template>

<script>
import { provide, inject, watch, onMounted, onUnmounted, computed } from "vue";

import Transform from "ol-ext/interaction/Transform";

import CopyPaste from "ol-ext/interaction/CopyPaste";

import usePropsAsObjectProperties from "@/composables/usePropsAsObjectProperties";

export default {
  name: "ol-interaction-transform",
  setup(props) {
    const map = inject("map");
    const vector = inject("vectorLayer");

    const { properties } = usePropsAsObjectProperties(props);

    let transform = computed(() => {
      let interaction = new Transform({
        ...properties,
      });

      return interaction;
    });
    console.log("vectorLayer", vector);
    let copypaste = computed(() => {
      let copypaste = new CopyPaste({
        destination: vector.value.getSource(),
        features: transform.value.getFeatures(),
      });
      // Remove selection if cut
      copypaste.on("cut", function() {
        transform.value.select();
      });

      copypaste.on("paste", function(e) {
        transform.value.select();
        e.features.forEach(function(f) {
          transform.value.select(f, true);
        });
      });
      return copypaste;
    });

    watch(copypaste, (newVal, oldVal) => {
      map.removeInteraction(oldVal);
      map.addInteraction(newVal);

      map.changed();
    });

    watch(transform, (newVal, oldVal) => {
      map.removeInteraction(oldVal);
      map.addInteraction(newVal);

      map.changed();
    });

    onMounted(() => {
      map.addInteraction(transform.value);
      map.addInteraction(copypaste.value);
    });

    onUnmounted(() => {
      map.removeInteraction(transform.value);
      map.removeInteraction(copypaste.value);
    });

    provide("stylable", transform);
    provide("stylable", copypaste);
  },
  props: {
    enableRotatedTransform: {
      type: Boolean,
      default: false,
    },
    condition: {
      type: Function,
    },
    addCondition: {
      type: Function,
    },
    filter: {
      type: Function,
    },
    layers: {
      type: Array,
    },
    hitTolerance: {
      type: Number,
      default: 2,
    },
    translateFeature: {
      type: Boolean,
      default: true,
    },
    scale: {
      type: Boolean,
      default: true,
    },
    rotate: {
      type: Boolean,
      default: true,
    },
    keepAspectRatio: {
      type: Boolean,
      default: false,
    },
    translate: {
      type: Boolean,
      default: true,
    },
    stretch: {
      type: Boolean,
      default: true,
    },
  },
};
</script>

<style lang=""></style>
