<template>
  <smart-widget :simple="simple" title="各方评价" :loading="loading">
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
    },
    simple: {
      default: true
    },
    loading: {
      default: true
    }
  },
  mounted: function() {
    this.resizeFunc = _.debounce(this.$refs.ratingbar.resize, 500);
    this.resizeFunc();
    this.$parent.$on("resized", this.resizeEvent);
    this.$parent.$on("container-resized", this.resizeEvent);
  },
  methods: {
    resizeEvent: function() {
      this.resizeFunc();
    }
  }
};
</script>