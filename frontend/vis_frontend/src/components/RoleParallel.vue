<template>
  <div style="width:100%;height:100%"></div>
</template>

<script>
import echarts from "echarts";
import _ from "lodash";
var chart = null;
export default {
  name: "RoleParallel",
  mounted: function() {
    chart = echarts.init(this.$el, null);
    this.$EventBus.$on("actor-focus", this.onFocus);
  },
  data: () => ({
    //chart: undefined,
    loaclOption: {}
  }),
  props: {
    chartData: {
      type: Array,
      required: true
    },
    colors: {
      default: () => [
        "#E3BA22",
        "#e58429",
        "#bd2d28",
        "#8e6c8a",
        "#6b99a1",
        "#42a5b3",
        "#0f8c79"
      ]
    }
  },
  computed: {
    option: function() {
      return {
        color: this.colors,
        //parallelAxis: this.parallelAxis,
        series: this.chartData,
        /*
        parallel: {
          // 这是『坐标系』的定义
          left: "5%", // 平行坐标系的位置设置
          right: "13%",
          bottom: "10%",
          top: "20%",
          parallelAxisDefault: {
            // 『坐标轴』的公有属性可以配置在这里避免重复书写
            type: "value",
            nameLocation: "end",
            nameGap: 20
          }
        },
        */
        xAxis: {
          type: "category"
          //data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: "value"
        },
        grid: {
          left: "5%",
          right: "5%",
          top: "10%",
          bottom: "10%"
        },
        tooltip: {
          show: true
        },
        emphasis: {
          itemStyle: {
            // 高亮时点的颜色。
            //color: "blue"
            opacity: 1
          },
          label: {
            show: true
            // 高亮时标签的文字。
            //formatter: "This is a emphasis label."
          }
        }
        /*
        legend: {
          show: true
        }
        */
      };
    }
  },
  watch: {
    option: function() {
      chart.setOption(this.option, true);
    }
  },
  methods: {
    onFocus: function(msg) {
      var character = msg.character;
      if (_.isArray(character)) {
        character = character.join("-");
      }
      if (character.length > 0) {
        chart.dispatchAction({
          type: "highlight",
          seriesName: character
        });
      } else {
        chart.dispatchAction({
          type: "downplay"
        });
      }
    },
    resize: function() {
      chart.resize();
    }
  }
};
</script>