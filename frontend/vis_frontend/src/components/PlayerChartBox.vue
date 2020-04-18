<template>
  <smart-widget title="演员生涯分析">
    <PlayerChart :chartData="chartData" ref="player_chart" />
  </smart-widget>
</template>

<script>
import PlayerChart from "./PlayerChart";
import _ from "lodash";

export default {
  name: "PlayerChartBox",
  props: {},
  data: function() {
    return {
      chartData: {
        西部世界: {
          name: "Clabs",
          present: [
            7,
            1,
            0,
            3,
            6,
            1,
            0,
            6,
            2,
            11,
            4,
            2,
            0,
            1,
            1,
            0,
            0,
            1,
            0,
            0
          ],
          rating: {
            豆瓣: 7
          }
        },
        绝命毒师: {
          name: "John",
          present: [5, 1, 1, 4, 3, 1, 1, 5, 5, 11],
          rating: {
            豆瓣: 8.5
          }
        },
        权力的游戏: {
          name: "Bob",
          present: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 4, 3, 2, 2, 3, 2, 2, 6, 3],
          rating: {
            豆瓣: 6
          }
        }
      }
    };
  },
  components: {
    PlayerChart
  },
  methods: {
    resizeEvent: function() {
      this.resizeFunc();
    }
  },
  mounted: function() {
    //防抖动，降低重绘开销，500ms
    this.resizeFunc = _.debounce(this.$refs.player_chart.chart.resize, 500);
    this.resizeFunc(); //绘制完成后修改一下尺寸
    this.$parent.$on("resize", this.resizeEvent); //接收外层resize事件
  }
};
</script>

