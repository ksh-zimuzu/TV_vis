<template>
  <smart-widget title="词云">
    <v-skeleton-loader v-if="loading" type="image" height="100%"></v-skeleton-loader>
    <WorldCloud v-else :word_freq="word_freq" ref="worldcloud" />
  </smart-widget>
</template>

<script>
/* eslint-disable */
import _ from "lodash";
import WorldCloud from "./WorldCloud";

import "../utils/require-jieba-js";

import stopwords from "raw-loader!../assets/edited_baidu_stopwords.txt";

export default {
  components: {
    WorldCloud
  },
  props: {
    plot: {
      type: String
    }
  },

  data: () => ({
    word_freq: undefined,
    loading: true,
    stopwords: new Set(
      stopwords
        .trim()
        .split("\n")
        .map(t => t.trim())
    )
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
  },
  watch: {
    plot: function() {
      this.loading = true;
      call_jieba_cut(this.plot, res => {
        console.log(res.map(t => typeof t));
        res = _.filter(
          res,
          word =>
            !this.stopwords.has(word) &&
            typeof word != "function" &&
            !word.startsWith("function")
        );
        var count = _.countBy(res);
        this.word_freq = count;
        console.log(count);
        this.loading = false;
      });
    }
  }
};
</script>