<template lang="">
  <slot> </slot>
</template>

<script>
import {
  inject,
  watch,
  onMounted,
  onUnmounted,
  toRefs,
  reactive,
  //computed
} from "vue";
import Draw from "ol/interaction/Draw";
import Polygon from "ol/geom/Polygon";
import DrawRegular from "ol-ext//interaction/DrawRegular";
import { rect } from "./helper.js";
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
      isGuide,
      isOpen,
    } = toRefs(props);
    let state = reactive({
      maxPoints: 0,
      dtype: "",
      geometryFunction: () => {},
      dsides: 0,
      _coordinates: [],
    });
    const getType = () => {
      state.dtype = type.value;
      state.dsides = sides.value;
      state.maxPoints = maxPoints.value;
      state.geometryFunction = undefined;
      if (type.value == "Polygon") {
        state.maxPoints = undefined;
      } else if (type.value == "LineString") {
        state.maxPoints = 2;
      } else if (type.value == "Circle") {
        state.dsides = 1;
        return true;
      } else if (type.value == "Rectangle") {
        state.dsides = 4;
        return true;
      } else if (type.value === "Rhomboid") {
        state.maxPoints = 3;
        state.dtype = "Polygon";
        state.geometryFunction = function (coordinates, geometry) {
          let pointers = coordinates[0];
          //非90度自动矫正第三个点
          if (pointers[2]) {
            let arr = rect(pointers[0], pointers[1], pointers[2]);
            pointers = [...arr];
          }
          let newCoordinates = [...pointers];
          newCoordinates.push(newCoordinates[0].slice()); // 添加起始点闭合画图
          if (!geometry) {
            geometry = new Polygon([newCoordinates]);
          } else {
            // 判断是否画图完成
            if (newCoordinates.length == 5) {
              geometry.setCoordinates([newCoordinates]); // 设置线性环的坐标
            }
          }
          // 返回几何图形坐标进行渲染
          return geometry;
        };
        return false;
      }
    };
    let createDraw = () => {
      if (!isOpen.value) {
        return false;
      }
      const isExt = getType();
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
          finishCondition: finishCondition.value,
          geometryFunction: state.geometryFunction,
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

    const undoPoint = () => {
      draw.removeLastPoint();
    };

    const redoPoint = () => {
      draw.appendCoordinates([]);
    };

    const finishDrawing = () => {
      draw.finishDrawing();
    };

    //props的变化会重新初始化
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
        isGuide,
        isOpen,
      ],
      () => {
        if (isOpen.value) {
          map.removeInteraction(draw);
          draw = createDraw();
          map.addInteraction(draw);
          draw.changed();
          map.changed();
        } else {
          map.removeInteraction(draw);
          map.changed();
        }
      }
    );
    onMounted(() => {
      if (draw) {
        map.addInteraction(draw);
      }
    });
    onUnmounted(() => {
      if (draw) {
        map.removeInteraction(draw);
      }
    });
    return {
      draw,
      undoPoint,
      redoPoint,
      finishDrawing,
    };
  },
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    isGuide: {
      type: Boolean,
      default: true,
    },
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
