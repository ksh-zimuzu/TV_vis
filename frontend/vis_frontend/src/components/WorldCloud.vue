<template>
  <div style="width:100%;height:100%"></div>
</template>

<script>
import echarts from "echarts";
import "echarts-wordcloud";
import _ from "lodash";

export default {
  name: "WorldCloud",
  data: () => ({
    chart: undefined
  }),
  props: {
    word_freq: Object,
    colors: {
      required: false,
      default: () => ["#E3BA22", "#E6842A", "#137B80", "#8E6C8A", "#978F80"]
    }
  },
  computed: {
    options: function() {
      return {
        series: [
          {
            type: "wordCloud",
            data: _.toPairs(this.word_freq).map(([key, value]) => ({
              name: key,
              value: value
            }))
          }
        ],
        textStyle: {
          normal: {
            color: () => {
              return this.colors[
                Math.round(10 * Math.random()) % this.colors.length
              ];
            }
          }
        }
      };
    }
  },
  mounted: function() {
    this.chart = echarts.init(this.$el);
    this.chart.setOption(this.options);
  }
};
</script>