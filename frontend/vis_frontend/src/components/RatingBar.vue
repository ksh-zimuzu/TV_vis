<template>
  <div style="width:100%;height:100%"></div>
</template>

<script>
import echarts from "echarts";
import _ from "lodash";
export default {
  name: "RatingBar",
  data: () => ({
    chart: undefined
  }),
  props: {
    ratings: {
      type: Object,
      required: true
    },
    color: {
      type: Array,
      default: () => ["#27ae60", "#424242", "#f93209", "#f5c518"]
    }
  },
  computed: {
    option: function() {
      return {
        color: this.color,
        tooltip: {
          show: true
        },
        radiusAxis: {
          type: "category",
          axisLabel: {
            show: false
          },
          inverse: true,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          }
        },
        angleAxis: {
          max: 100,
          axisTick: {
            show: false
          },
          axisLabel: {
            show: false
          },
          splitLine: {
            show: false
          },
          axisLine: {
            show: false
          }
          // startAngle:85
        },
        polar: {},
        series: _.keys(this.ratings).map(key => ({
          name: key,
          type: "bar",
          data: [this.ratings[key]],
          coordinateSystem: "polar",
          roundCap: true
        })),
        legend: {
          show: false,
          data: _.keys(this.ratings)
        }
      };
    }
  },
  watch: {
    option: function() {
      this.chart.setOption(this.option);
    }
  },
  mounted: function() {
    this.chart = echarts.init(this.$el);
    this.chart.setOption(this.option);
  }
};
</script>