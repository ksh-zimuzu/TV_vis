<template>
  <smart-widget title="演员" :loading="loading">
    <PlayerAvatarChart
      :players="players"
      ref="avatarChart"
      @loading="loading=true"
      @loaded="loading=false"
    />
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
    return {
      loading: true
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
    this.$parent.$on("resized", this.resizeEvent); //接收外层resize事件
    this.$parent.$on("container-resized", this.resizeEvent);
  }
};
</script>