<template>
  <div style="width:100%;height:100%"></div>
</template>

<script>
import echarts from "echarts";
import _ from "lodash";
var chart = null;
export default {
  name: "SimilarBar",
  data: () => ({
    chart: undefined
  }),
  props: {
    current_tv: {
      type: Object,
      required: true
    },
    similar_tvs: {
      type: Array,
      required: true
    },
    active_color: {
      default: "#e3ba22"
    },
    other_color: {
      default: "#e7e6e6"
    }
  },
  computed: {
    options: function() {
      return {
        yAxis: {
          type: "category",
          data: this.tvs.map(t => t.name),
          axisLabel: {
            interval: 0,
            show: false
          }
        },
        xAxis: {
          type: "value"
        },
        series: [
          {
            data: this.tvs.map((t, i) => ({
              value: t.popularity,
              itemStyle: {
                color: i ? this.other_color : this.active_color
              }
            })),
            type: "bar"
          }
        ],
        tooltip: {
          show: true,
          position: "inside",
          trigger: "axis"
        },
        grid: {
          left: "5%",
          right: "5%",
          top: "5%",
          bottom: "30"
        }
      };
    },
    tvs: function() {
      return _.concat(this.current_tv, this.similar_tvs);
    }
  },
  watch: {
    options: function() {
      chart.setOption(this.options);
    }
  },
  mounted: function() {
    chart = echarts.init(this.$el);
    chart.setOption(this.options);
  },
  beforeDestroy() {
    chart.isDisposed() || chart.dispose();
  },
  methods: {
    resize() {
      chart.resize();
    }
  }
};
</script>