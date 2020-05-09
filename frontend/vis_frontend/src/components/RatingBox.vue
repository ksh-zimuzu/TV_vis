<template>
  <smart-widget simple>
    <RatingBar :ratings="ratings" ref="ratingbar" />
  </smart-widget>
</template>

<script>
import RatingBar from "./RatingBar";
import _ from "lodash";

export default {
  components: {
    RatingBar
  },
  props: {
    ratings: {
      type: Object,
      required: true
    }
  },
  mounted: function() {
    this.resizeFunc = _.debounce(this.$refs.ratingbar.chart.resize, 500);
    this.resizeFunc();
    this.$parent.$on("resize", this.resizeEvent);
  },
  methods: {
    resizeEvent: function() {
      this.resizeFunc();
    }
  }
};
</script>