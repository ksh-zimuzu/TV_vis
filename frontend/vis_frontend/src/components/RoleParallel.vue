<template>
  <div style="width:100%;height:100%"></div>
</template>

<script>
import echarts from "echarts";

export default {
  name: "RoleParallel",
  mounted: function() {
    this.chart = echarts.init(this.$el);
  },
  data: () => ({
    chart: undefined
  })
};
</script>