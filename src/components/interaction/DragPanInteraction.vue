<template lang="">
  <slot> </slot>
</template>

<script>
import { inject, onMounted, onUnmounted, toRefs, watch } from "vue";

// import usePropsAsObjectProperties from "@/composables/usePropsAsObjectProperties";

import DragPan from "ol/interaction/DragPan";
// import { always } from "ol/events/condition";

export default {
  name: "ol-interaction-drawpan",
  emits: ["drawpan"],
  setup(props) {
    const map = inject("map");

    // const { properties } = usePropsAsObjectProperties(props);

    const { condition } = toRefs(props);

    // let drawpan = computed(() => {
    //   console.log(properties);
    //   let s = new DragPan({
    //     condition: always,
    //   });
    //   s.setActive(false);
    //   s.on("change:active", () => {
    //     console.log("change:activechange:active");

    //     console.log(drawpan.value.getActive());
    //     // map.addInteraction(drawpan.value);
    //     // map.changed();
    //   });

    //   return s;
    // });

    let createDrawPan = () => {
      drawpan = new DragPan({
        condition: condition.value,
      });
      return drawpan;
    };
    let drawpan = createDrawPan();

    onMounted(() => {
      map.addInteraction(drawpan);
    });

    watch([condition], () => {
      map.removeInteraction(drawpan);

      drawpan = createDrawPan();

      console.log(condition.value);
      map.addInteraction(drawpan);

      drawpan.changed();
      map.changed();
    });

    onUnmounted(() => {
      map.removeInteraction(drawpan);
    });

    return {
      drawpan,
    };
  },
  props: {
    condition: {
      type: Function,
      default: () => false,
    },
  },
};
</script>

<style lang=""></style>
