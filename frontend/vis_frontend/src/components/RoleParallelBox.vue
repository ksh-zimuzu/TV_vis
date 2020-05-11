<template>
  <smart-widget>
    <RoleParallel />
  </smart-widget>
</template>

<script>
import RoleParallel from "./RoleParallel";
import numbers from "numbers";
import _ from "lodash";

export default {
  name: "RoleParallelBox",
  components: {
    RoleParallel
  },
  data: () => ({
    nodes: undefined
  }),
  created: function() {
    this.$EventBus.$on("nodes-ready", msg => (this.nodes = msg));
  },
  computed: {
    data: function() {
      var groups = _.groupBy(this.nodes, t => t.category);
      return _.keys(groups).map(key => {
        var matrix = groups[key].map(t => t.map(x => x.value));
        return {
          name: key,
          type: "parallel",
          data: numbers.matrix.transpose(matrix)
        };
      });
    }
  }
};
</script>