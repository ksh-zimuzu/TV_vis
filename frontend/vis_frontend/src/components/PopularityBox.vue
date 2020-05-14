<template>
  <smart-widget title="近期热度" :loading="loading" :simple="simple">
    <PopularityLine :popularity="popularity" ref="popurityline" />
  </smart-widget>
</template>

<script>
import PopularityLine from "./PopularityLine";
import _ from "lodash";

export default {
  components: {
    PopularityLine
  },
  name: "PopularityBox",
  props: {
    loading: {
      type: Boolean,
      default: true
    },
    simple: {
      type: Boolean
    },
    popularity: {
      type: Array,
      required: true
    }
  },
  methods: {
    resizeEvent: function() {
      this.resizeFunc();
    }
  },
  mounted: function() {
    //防抖动，降低重绘开销，500ms
    this.resizeFunc = _.debounce(this.$refs.popurityline.resize, 500);
    this.resizeFunc(); //绘制完成后修改一下尺寸
    this.$parent.$on("resized", this.resizeEvent); //接收外层resize事件
    this.$parent.$on("container-resized", this.resizeEvent);
  }
};
</script>