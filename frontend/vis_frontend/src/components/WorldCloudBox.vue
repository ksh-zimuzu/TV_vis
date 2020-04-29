<template>
  <smart-widget title="词云">
    <WorldCloud :word_freq="word_freq" ref="worldcloud" />
  </smart-widget>
</template>

<script>
import _ from "lodash";
import WorldCloud from "./WorldCloud";

export default {
  components: {
    WorldCloud
  },
  data: () => ({
    word_freq: require("./../assets/word_freq.json")
  }),
  methods: {
    resizeEvent: function() {
      this.resizeFunc();
    }
  },
  mounted: function() {
    //防抖动，降低重绘开销，500ms
    this.resizeFunc = _.debounce(this.$refs.worldcloud.chart.resize, 500);
    this.resizeFunc(); //绘制完成后修改一下尺寸
    this.$parent.$on("resize", this.resizeEvent); //接收外层resize事件
  }
};
</script>