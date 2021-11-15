<template lang="">
<slot>

</slot>
</template>

<script>
import {
  provide,
  inject,
  watch,
  onMounted,
  onUnmounted,
  toRefs,
  reactive
  //computed
} from 'vue'

import Draw from 'ol/interaction/Draw';
//import Style from 'ol/style/Style';
import Polygon from 'ol/geom/Polygon';
import DrawRegular from 'ol-ext//interaction/DrawRegular';
export default {
  name: 'ol-interaction-draw',
  emits: ["drawstart", "drawend"],
  setup(props, {
    emit
  }) {

    const map = inject("map");
    const source = inject("vectorSource");

    const {
      type,
      clickTolerance,
      dragVertexDelay,
      snapTolerance,
      stopClick,
      maxPoints,
      minPoints,
      finishCondition,
      geometryFunction,
      geometryName,
      condition,
      freehand,
      freehandCondition,
      wrapX,
      sides
    } = toRefs(props);

    let state = reactive({
      dtype: '',
      dgeometryFunction: () => {

      },
      dsides: 0
    })

    const getType = () => {
      state.dtype = type.value
      state.dsides = sides.value
      state.dgeometryFunction = type.geometryFunction;

      if (type.value == "Circle") {

        state.dsides = 1

        return true
      } else if (type.value == "Rectangle") {
        state.dsides = 4

        return true
      }
      else if (type.value === "Rhomboid") {
        state.dtype = 'LineString';
        maxPoints.value = 2;
        state.dgeometryFunction = function (coordinates, geometry) {


          // 开始坐标
          var start = coordinates[0];
          // 结束坐标
          var end = coordinates[1];

          //如果geometry对象不存在或者为空，则创建
          if (!geometry) {
            //多面几何图形下设置
            geometry = new Polygon([
              [start, [start[0], end[1]], end, [end[0], start[1]], start]
            ])
          }

          // 根据开始与结束坐标绘制,从起始点，回到起始点
          //   geometry.setCoordinates([[
          //     start, [start[0] - 0.00001, end[1]], end, [end[0] + 0.00001, start[1]], start]
          //   ]);

          geometry.setCoordinates([[
            start, [start[0] - 0.00001, end[1]], end, [end[0] + 0.00001, start[1]], start]
          ]);
          // 返回几何图形坐标进行渲染
          return geometry;
        }
        return false
      }
    }
    let createDraw = () => {
      const isExt = getType()
      console.log(type.value)
      let draw
      if (isExt) {
        draw = new DrawRegular({
          source: source.value,
          sides: state.dsides,
        });
      } else {
        draw = new Draw({
          source: source.value,
          type: state.dtype,
          clickTolerance: clickTolerance.value,
          dragVertexDelay: dragVertexDelay.value,
          snapTolerance: snapTolerance.value,
          stopClick: stopClick.value,
          maxPoints: maxPoints.value,
          minPoints: minPoints.value,
          finishCondition: finishCondition.value,
          geometryFunction: state.dgeometryFunction,
          geometryName: geometryName.value,
          condition: condition.value,
          freehand: freehand.value,
          freehandCondition: freehandCondition.value,
          wrapX: wrapX.value,
        });
      }

      draw.on('drawstart', (event) => {
        emit('drawstart', event)
      })

      draw.on('drawend', (event) => {
        event.feature.set('type', type.value)
        event.feature.setId(event.feature.ol_uid)
        emit('drawend', event)
      })

      return draw;

    };

    let draw = createDraw();



    watch([type,
      clickTolerance,
      dragVertexDelay,
      snapTolerance,
      stopClick,
      maxPoints,
      minPoints,
      finishCondition,
      geometryFunction,
      geometryName,
      condition,
      freehand,
      freehandCondition,
      wrapX
    ], () => {

      map.removeInteraction(draw);
      draw = createDraw();
      map.addInteraction(draw);
      draw.changed()

      map.changed()
    })

    onMounted(() => {
      map.addInteraction(draw);

    });

    onUnmounted(() => {
      map.removeInteraction(draw);
    });

    provide('stylable', draw)
  },
  props: {

    type: {
      type: String,
      required: true
    },
    clickTolerance: {
      type: Number,
      default: 6
    },
    dragVertexDelay: {
      type: Number,
      default: 500
    },
    snapTolerance: {
      type: Number,
      default: 12
    },
    stopClick: {
      type: Boolean,
      default: false
    },
    maxPoints: {
      type: Number,
    },
    minPoints: {
      type: Number,

    },
    finishCondition: {
      type: Function,

    },
    geometryFunction: {
      type: Function,

    },
    geometryName: {
      type: String,

    },
    condition: {
      type: Function,

    },
    freehand: {
      type: Boolean,
      default: false

    },
    freehandCondition: {
      type: Function,

    },
    wrapX: {
      type: Boolean,
      default: false

    },
    sides: {
      type: Number,
      default: 0
    }
  }

}
</script>

<style lang="">
</style>
