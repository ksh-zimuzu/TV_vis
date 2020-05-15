<template>
  <div style="width:100%;height:100%"></div>
</template>

<script>
import echarts from "echarts";
import _ from "lodash";

var chart = null;

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
      default: () => ["#f5c518", "#424242", "#f93209", "#27ae60"]
    }
  },
  computed: {
    option: function() {
      return {
        baseOption: {
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
            min: -0.01,
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
          series: _.keys(this.ratings)
            .sort()
            .map(key => ({
              name: key,
              type: "bar",
              data: [this.ratings[key]],
              coordinateSystem: "polar",
              roundCap: true
            })),
          legend: {
            data: _.keys(this.ratings)
          }
        },
        media: [
          {
            query: {
              minHeight: 100,
              minAspectRatio: 3
            },
            option: {
              legend: {
                show: true,
                left: "left",
                orient: "vertical",
                bottom: "auto"
              }
            }
          },
          {
            query: {
              maxHeight: 250,
              maxWidth: 400
            },
            option: {
              legend: {
                show: false
              }
            }
          },
          {
            query: {
              minWidth: 400,
              minHeight: 250
            },
            option: {
              legend: {
                show: true,
                bottom: 0,
                left: "center",
                orient: "horizontal"
              }
            }
          },
          {
            option: {
              legend: {
                show: true,
                bottom: 0,
                left: "center",
                orient: "horizontal"
              }
            }
          }
        ]
      };
    }
  },
  watch: {
    option: function() {
      chart.setOption(this.option);
    }
  },
  mounted: function() {
    chart = echarts.init(this.$el);
    chart.setOption(this.option);
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