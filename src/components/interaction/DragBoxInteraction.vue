<template lang="">
  <slot> </slot>
</template>

<script>
import { inject, watch, onMounted, onUnmounted, computed } from "vue";

import { DragBox } from "ol/interaction";
import usePropsAsObjectProperties from "@/composables/usePropsAsObjectProperties";
import { platformModifierKeyOnly } from "ol/events/condition";

export default {
  name: "ol-interaction-dragbox",
  emits: ["dragbox"],
  setup(props, { emit }) {
    const map = inject("map");

    const { properties } = usePropsAsObjectProperties(props);
    let dragbox = computed(() => {
      let s = new DragBox({
        ...properties,
      });
      s.on("undo", (event) => {
        emit("dragbox", event);
      });

      return s;
    });

    watch(dragbox, (newVal, oldVal) => {
      map.removeInteraction(oldVal);
      map.addInteraction(newVal);

      map.changed();
    });

    onMounted(() => {
      map.addInteraction(dragbox.value);
    });

    onUnmounted(() => {
      map.removeInteraction(dragbox.value);
    });

    return {
      dragbox,
    };
  },
  props: {
    condition: { type: Function, defatult: platformModifierKeyOnly },
  },
};
</script>

<style lang=""></style>
