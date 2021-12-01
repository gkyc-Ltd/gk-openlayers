<template lang="">
<slot>

</slot>
</template>

<script>
import {
  inject,
  watch,
  onMounted,
  onUnmounted,
  computed
} from 'vue'
// import DoubleClickZoom from 'ol/interaction/DoubleClickZoom';
import { DoubleClickZoom as defaultInteractions } from 'ol/interaction';

import usePropsAsObjectProperties from '@/composables/usePropsAsObjectProperties'

export default {
  name: 'ol-interaction-defaults',
  setup(props,) {
    const map = inject("map");
    const {
      properties
    } = usePropsAsObjectProperties(props);

    let defaults = computed(() => {
      let s = new defaultInteractions({
        ...properties,
      });
      console.log('------------------------------------');
      console.log(s);
      console.log('------------------------------------');
      return s;
    });

    watch(defaults, (newVal, oldVal) => {
      map.removeInteraction(oldVal);
      map.addInteraction(newVal);
      map.changed()
    })

    onMounted(() => {
      map.addInteraction(defaults.value);

    });

    onUnmounted(() => {
      map.removeInteraction(defaults.value);
    });



    return {
      defaults
    }
  },
  props: {
    // //屏蔽双击放大事件
    // doubleClickZoom: {
    //   type: Boolean,
    //   default: false
    // },
    // //屏蔽双击放大事件
    // pinchRotate: {
    //   type: Boolean,
    //   default: false
    // },
    // condition: {
    //   type: Function,

    // },
    // filter: {
    //   type: Function
    // },
    // features: {
    //   type: [Collection, Object]
    // }
  }

}
</script>

<style lang="">
</style>
