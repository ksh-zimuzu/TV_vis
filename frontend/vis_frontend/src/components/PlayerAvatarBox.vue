<template>
  <smart-widget title="演员">
    <PlayerAvatarChart :players="players" ref="avatarChart" />
  </smart-widget>
</template>

<script>
import PlayerAvatarChart from "./PlayerAvatarChart";
import _ from "lodash";

export default {
  components: {
    PlayerAvatarChart
  },
  data: function() {
    return {
      players: [
        {
          name: "Evan Rachel Wood",
          id: 38940,
          character: "Dolores Abernathy"
        },
        {
          name: "Thandie Newton",
          id: 9030,
          character: "Maeve Millay"
        },
        {
          name: "Jeffrey Wright",
          id: 2954,
          character: "Bernard Lowe"
        },
        {
          name: "Tessa Thompson",
          id: 62561,
          character: "Charlotte Hale"
        },
        {
          name: "Ed Harris",
          id: 228,
          character: "Man in Black"
        }
      ]
    };
  },
  methods: {
    resizeEvent: function() {
      this.resizeFunc();
    }
  },
  mounted: function() {
    this.resizeFunc = _.debounce(this.$refs.avatarChart.chart.resize, 500);
    this.resizeFunc();
    this.$parent.$on("resize", this.resizeEvent); //接收外层resize事件
  }
};
</script>