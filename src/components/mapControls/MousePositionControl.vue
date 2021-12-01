<template lang="">
<div v-if="false">

</div>
</template>

<script>

import {
  MousePosition
} from 'ol/control';
import useControl from '@/composables/useControl'
import { createStringXY } from 'ol/coordinate';

export default {
  name: 'ol-mouseposition-control',
  setup(props, context) {
    const {
      control
    } = useControl(MousePosition, props, context);
    return {
      control
    }
  },
  props: {
    className: {
      type: String,
      default: 'ol-mouse-position'
    },
    coordinateFormat: {
      type: Function,
      default: createStringXY(0)
    },
    projection: {
      type: String,

    },
    render: {
      type: Function,
    },
    target: {
      type: HTMLElement,
    },
    undefinedHTML: {
      type: String,
      default: '&#160;'
    }
  }
}
</script>

<style lang="">
</style>
