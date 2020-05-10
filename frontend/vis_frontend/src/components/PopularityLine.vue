<template>
  <div style="width:100%;height:100%"></div>
</template>

<script>
import echarts from "echarts";

export default {
  props: {
    popularity: {
      type: Array,
      required: true
    },
    color: {
      type: String,
      default: "#137B80"
    }
  },
  data: () => ({
    chart: undefined
  }),
  computed: {
    option: function() {
      return {
        grid: {
          left: "5%",
          right: "5%",
          top: "5%",
          bottom: "30"
        },
        xAxis: {
          type: "time",
          boundaryGap: ["20%", "20%"],
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            align: "center"
          }
        },
        yAxis: {
          type: "value",
          inverse: true,

          min: function(value) {
            return value.min - 100 < 0 ? 0 : value.min - 100;
          },
          max: function(value) {
            return value.max + 100;
          },

          axisLabel: {
            inside: true,
            show: false
          }
        },
        series: [
          {
            data: this.popularity.map(t => {
              var reg = new RegExp("年|月|日", "g");
              return {
                value: [
                  t.date.replace(reg, match => (match == "日" ? "" : "/")),
                  -t.value
                ]
              };
            }),
            type: "line",
            areaStyle: {
              origin: "end",
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: this.color
                },
                {
                  offset: 1,
                  color: "#ffe"
                }
              ])
            },
            itemStyle: {
              color: this.color
            },
            smooth: true,
            symbol: "none"
          }
        ],
        tooltip: {
          show: true,
          trigger: "axis"
        }
      };
    }
  },
  mounted: function() {
    this.chart = echarts.init(this.$el);
    this.chart.setOption(this.option);
  },
  watch: {
    option: function() {
      this.chart.setOption(this.option);
    }
  },
  name: "PopularityLine"
};
</script>