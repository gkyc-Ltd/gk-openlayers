<template lang="">
  <slot> </slot>
</template>

<script>
import {
  provide,
  inject,
  watch,
  onMounted,
  onUnmounted,
  toRefs,
  reactive,
  //computed
} from "vue";

import Draw from "ol/interaction/Draw";
//import Style from 'ol/style/Style';
import Polygon from "ol/geom/Polygon";
import DrawRegular from "ol-ext//interaction/DrawRegular";

export default {
  name: "ol-interaction-draw",
  emits: ["drawstart", "drawend"],
  setup(props, { emit }) {
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
      sides,
    } = toRefs(props);

    let state = reactive({
      maxPoints: 0,
      dtype: "",
      dgeometryFunction: () => {},
      dsides: 0,
    });

    const getType = () => {
      state.dtype = type.value;
      state.dsides = sides.value;
      state.dgeometryFunction = type.geometryFunction;

      if (type.value == "Circle") {
        state.dsides = 1;

        return true;
      } else if (type.value == "Rectangle") {
        state.dsides = 4;
        return true;
      } else if (type.value === "Rhomboid") {
        state.dtype = "Polygon";
        state.maxPoints = 3;
        state.dgeometryFunction = function(coordinates, geometry) {
          let pointers = coordinates[0];
          // 第一个点
          let x1 = pointers[0] ? pointers[0][0] : null;
          let y1 = pointers[0] ? pointers[0][1] : null;
          // 第二个点
          let x2 = pointers[1] ? pointers[1][0] : null;
          let y2 = pointers[1] ? pointers[1][1] : null;
          // 第三个点
          let x3 = pointers[2] ? pointers[2][0] : null;
          let y3 = pointers[2] ? pointers[2][1] : null;
          // 第四个点
          let x4 = null;
          let y4 = null;
          x4 = x1 - x2 + (x3 - x4);
          y4 = y1 - y2 + y3;

          let newCoordinates = [...pointers];
          newCoordinates.push([x4, y4]); // 添加及计算的第四个点。
          newCoordinates.push(newCoordinates[0].slice()); // 添加起始点闭合画图
          console.log(newCoordinates);
          if (!geometry) {
            geometry = new Polygon([newCoordinates]);
          } else {
            // 判断是否画图完成
            if (newCoordinates.length == 5) {
              geometry.setCoordinates([newCoordinates]); // 设置线性环的坐标
            }
          }
          //   // 开始坐标
          //   var start = coordinates[0];
          //   // 结束坐标
          //   var end = coordinates[1];

          //   //如果geometry对象不存在或者为空，则创建
          //   if (!geometry) {
          //     //多面几何图形下设置
          //     geometry = new Polygon([
          //       [start, [start[0], end[1]], end, [end[0], start[1]], start]
          //     ]);
          //   }
          //   // 根据开始与结束坐标绘制,从起始点，回到起始点
          //   //   geometry.setCoordinates([[
          //   //     start, [start[0] - 0.00001, end[1]], end, [end[0] + 0.00001, start[1]], start]
          //   //   ]);
          //   const view = map.getView();
          //   const zoom = view.getZoom();
          //   let grade = 0.00001;

          //   if (zoom < 10) {
          //     grade = 10;
          //   } else if (zoom > 10 && zoom < 15) {
          //     grade = 0.1;
          //   } else if (zoom > 15 && zoom <= 20) {
          //     grade = 0.001;
          //   } else if (zoom > 20 && zoom <= 25) {
          //     grade = 0.0001;
          //   }

          //   console.log("------------------------------------");
          //   console.log(zoom);
          //   console.log("------------------------------------");

          //   geometry.setCoordinates([
          //     [
          //       start,
          //       [start[0] + grade / zoom, end[1]],
          //       end,
          //       [end[0] - grade / zoom, start[1]],
          //       start
          //     ]
          //   ]);

          // 返回几何图形坐标进行渲染
          return geometry;
        };
        return false;
      }
    };
    let createDraw = () => {
      const isExt = getType();
      console.log(type.value);
      let draw;
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
          maxPoints: state.maxPoints,
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

      draw.on("drawstart", (event) => {
        emit("drawstart", event);
      });

      draw.on("drawend", (event) => {
        const view = map.getView();
        const zoom = view.getZoom();
        event.feature.set("zoom", zoom);
        event.feature.set("type", type.value);
        event.feature.setId(event.feature.ol_uid);
        emit("drawend", event);
      });

      return draw;
    };

    let draw = createDraw();

    watch(
      [
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
      ],
      () => {
        state.maxPoints = maxPoints;
        map.removeInteraction(draw);
        draw = createDraw();
        map.addInteraction(draw);
        draw.changed();

        map.changed();
      }
    );

    onMounted(() => {
      map.addInteraction(draw);
    });

    onUnmounted(() => {
      map.removeInteraction(draw);
    });

    provide("stylable", draw);
  },
  props: {
    type: {
      type: String,
      required: true,
    },
    clickTolerance: {
      type: Number,
      default: 6,
    },
    dragVertexDelay: {
      type: Number,
      default: 500,
    },
    snapTolerance: {
      type: Number,
      default: 12,
    },
    stopClick: {
      type: Boolean,
      default: false,
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
      default: false,
    },
    freehandCondition: {
      type: Function,
    },
    wrapX: {
      type: Boolean,
      default: false,
    },
    sides: {
      type: Number,
      default: 0,
    },
  },
};
</script>

<style lang=""></style>
