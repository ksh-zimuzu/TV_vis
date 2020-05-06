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
  props: {
    players: {
      type: Array,
      required: true
    }
  },
  data: function() {
    return {};
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