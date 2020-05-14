<template>
  <smart-widget v-if="non === 0" title="演员生涯分析">
    <PlayerChart :chartData="chartData" ref="player_chart" />
  </smart-widget>
  <smart-widget v-else-if="non === 1" title="演员生涯分析">
    <img class="img" src="../../public/error.jpg" />
  </smart-widget>
</template>

<script>
import PlayerChart from "./PlayerChart";
import _ from "lodash";
import se from "../services/searchtv";

export default {
  name: "PlayerChartBox",
  props: {
    actorid: String
  },
  data: function() {
    return {
      chartData: {
        示例数据1: {
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
        示例数据2: {
          name: "John",
          present: [5, 1, 1, 4, 3, 1, 1, 5, 5, 11],
          rating: {
            豆瓣: 8.5
          }
        },
        示例数据3: {
          name: "Bob",
          present: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 4, 3, 2, 2, 3, 2, 2, 6, 3],
          rating: {
            豆瓣: 6
          }
        }
      },
      da: {},
      non: 0
    };
  },
  components: {
    PlayerChart
  },
  methods: {
    resizeEvent: function() {
      this.resizeFunc();
    },
    getdata: function(actor_id) {
      var load_data = se.fetch(actor_id);
      load_data.then(res => {
        console.log("result:");
        console.log(res.data);
        this.da = res.data;
      });
    },
    cha: async function(da) {
      for (var b in da) {
        var p = await se.pop(b);
        if (p == undefined) {
          da[b].rating = {
            豆瓣: 0
          };
        } else {
          da[b].rating = {
            豆瓣: p
          };
        }
      }
      this.chartData = da;
      console.log("chartData");
      console.log(this.chartData);
    },
    refresh_data: async function() {
      //防抖动，降低重绘开销，500ms
      this.non = 0;
      await this.getdata(this.actorid);
      var load_data = se.fetch(this.actorid);
      await load_data
        .then(res => {
          console.log("result:");
          console.log(res.data);
          this.da = res.data;
        })
        .catch(err => {
          this.non = 1;
          console.log(err);
          alert("该演员生涯分析缺失，制作组正在征集数据噢awa");
        });
      console.log("da");
      console.log(this.da);
      for (var a in this.da) {
        delete this.da[a].time;
      }
      console.log("da2:");
      console.log(this.da);
      await this.cha(this.da);
    }
  },
  mounted: async function() {
    this.resizeFunc = _.debounce(this.$refs.player_chart.resize, 500);
    this.resizeFunc(); //绘制完成后修改一下尺寸
    this.$parent.$on("resize", this.resizeEvent); //接收外层resize事件
    this.$parent.$on("container-resized", this.resizeEvent);
    await this.refresh_data();
  },
  watch: {
    chartData: {
      handler: function(val) {
        console.log(val);
        this.resizeFunc = _.debounce(this.$refs.player_chart.resize, 500);
        console.log("重绘");
        this.resizeFunc(); //绘制完成后修改一下尺寸
        this.$parent.$on("resize", this.resizeEvent); //接收外层resize事件
        this.$parent.$on("container-resized", this.resizeEvent);
      },
      deep: true
    },
    actorid: async function() {
      await this.refresh_data();
    }
  }
};
</script>

