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

import UndoRedo from 'ol-ext//interaction/UndoRedo';

import usePropsAsObjectProperties from '@/composables/usePropsAsObjectProperties'

export default {
  name: 'ol-interaction-undoredo',
  emits: ["undoredo"],
  setup(props, {
    emit
  }) {

    const map = inject("map");

    const {
      properties
    } = usePropsAsObjectProperties(props);

    let undoredo = computed(() => {
      let s = new UndoRedo({
        ...properties,
      });
      s.on('undo', (event) => {
        emit('undoredo', event)
      })

      return s;
    });

    watch(undoredo, (newVal, oldVal) => {

      map.removeInteraction(oldVal);
      map.addInteraction(newVal);

      map.changed()
    })

    onMounted(() => {
      map.addInteraction(undoredo.value);

    });

    onUnmounted(() => {
      map.removeInteraction(undoredo.value);
    });



    return {
      undoredo
    }
  },
  props: {
    // multi: {
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
