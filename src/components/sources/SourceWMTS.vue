<template>
  <div v-if="false">

  </div>
</template>

<script>
import WMTS from 'ol/source/WMTS';
import Projection from 'ol/proj/Projection';
import WMTSTileGrid from 'ol/tilegrid/WMTS';
import {
  get as getProjection
} from 'ol/proj';
import {
  getTopLeft,
  getWidth
} from 'ol/extent';
import {
  inject,
  onMounted,
  onUnmounted,
  watch,
  computed
} from 'vue'
import usePropsAsObjectProperties from '@/composables/usePropsAsObjectProperties'
export default {
  name: 'ol-source-wmts',
  setup(props) {

    const tileLayer = inject('tileLayer');
    const {
      properties
    } = usePropsAsObjectProperties(props);

    const extent = computed(() => getProjection(properties.projection).getExtent());
    const origin = computed(() => getTopLeft(extent.value));
    const size = computed(() => getWidth(extent.value) / 256);
    console.log('------------------------------------');
    console.log(size);
    console.log('------------------------------------');
    const getTileGrid = computed(() => {

      //   const resolutions = new Array(25);
      //   const matrixIds = new Array(14);
      //   for (var z = 0; z < 25; ++z) {
      //     resolutions[z] = size.value / Math.pow(2, z);
      //     gridNames[z] = z;
      //   }

      const matrixIds = [
        'EPSG:4326:0',
        'EPSG:4326:1',
        'EPSG:4326:2',
        'EPSG:4326:3',
        'EPSG:4326:4',
        'EPSG:4326:5',
        'EPSG:4326:6',
        'EPSG:4326:7',
        'EPSG:4326:8',
        'EPSG:4326:9',
        'EPSG:4326:10',
        'EPSG:4326:11',
        'EPSG:4326:12',
        'EPSG:4326:13',
        'EPSG:4326:14',
        'EPSG:4326:15',
        'EPSG:4326:16',
        'EPSG:4326:17',
        'EPSG:4326:18',
        'EPSG:4326:19',
        'EPSG:4326:20',
        'EPSG:4326:21',
      ];


      var resolutions = [
        0.703125, 0.3515625, 0.17578125, 0.087890625, 0.0439453125, 0.02197265625, 0.010986328125,
        0.0054931640625, 0.00274658203125, 0.001373291015625, 6.866455078125e-4, 3.4332275390625e-4,
        1.71661376953125e-4, 8.58306884765625e-5, 4.291534423828125e-5, 2.1457672119140625e-5,
        1.0728836059570312e-5, 5.364418029785156e-6, 2.682209014892578e-6, 1.341104507446289e-6,
        6.705522537231445e-7, 3.3527612686157227e-7,
      ];



      return new WMTSTileGrid({
        origin: origin.value,
        resolutions,
        matrixIds
      });
    });

    const source = computed(() => new WMTS({
      ...properties,
      projection: typeof properties.projection == "string" ? properties.projection : new Projection({
        ...properties.projection
      }),
      tileGrid: getTileGrid.value,
    }));

    console.log('------------------------------------');
    console.log(getTileGrid.value);
    console.log('------------------------------------');

    watch(source, () => {
      tileLayer.value.setSource(source.value)

    });

    watch(tileLayer, () => {

      tileLayer.value.setSource(source.value)

    });

    onMounted(() => {
      tileLayer.value.setSource(source.value)

    });

    onUnmounted(() => {
      tileLayer.value.setSource(null)
    });

    return {
      tileLayer,
      source
    }
  },
  props: {
    attributions: {
      type: String
    },
    cacheSize: {
      type: Number
    },
    crossOrigin: {
      type: String
    },
    imageSmoothing: {
      type: Boolean,
      default: true
    },
    projection: {
      type: [String, Object],
      default: 'EPSG:4326'
    },
    reprojectionErrorThreshold: {
      type: Number,
      default: 0.5
    },
    tilePixelRatio: {
      type: Number,
      default: 1
    },
    format: {
      type: String,
      default: 'image/jpeg'
    },
    version: {
      type: String,
      default: '1.0.0'
    },
    matrixSet: {
      type: String
    },
    dimensions: {
      type: Object
    },
    requestEncoding: {
      type: String,
      default: "KVP",
    },
    url: {
      type: String
    },
    urls: {
      type: Array
    },
    wrapX: {
      type: Boolean,
      default: false
    },
    transition: {
      type: Number
    },
    layer: {
      type: String
    },
    style: {
      type: String
    },

  }
}
</script>

<style lang="">
</style>
