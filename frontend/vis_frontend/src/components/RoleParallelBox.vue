<template>
  <smart-widget simple>
    <RoleParallel :chartData="chartData" :parallelAxis="parallelAxis" ref="roleparallel" />
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
    nodes: undefined,
    highlightGroup: -1,
    highlightIndex: -1,
    highlightName: "",
    colors: [
      "#E3BA22",
      "#e58429",
      "#bd2d28",
      "#8e6c8a",
      "#6b99a1",
      "#42a5b3",
      "#0f8c79"
    ]
  }),
  created: function() {
    this.$EventBus.$on("nodes-ready", msg => (this.nodes = msg));
  },
  computed: {
    chartData: function() {
      if (this.nodes == undefined) {
        return [];
      }
      var groups = this.nodes.map(ep => {
        var res = _.groupBy(ep, t => t.category);
        _.keys(res).map(
          key =>
            (res[key] = res[key].map(t => ({
              value: t.value,
              name: t.name
            })))
        );
        return res;
      });
      var matrix = _.assignWith({}, ...groups, (objValue, srcValue) => {
        if (_.isArray(objValue)) {
          objValue.push(srcValue);
          return objValue;
        } else {
          return [srcValue];
        }
      });
      var transposedMatrix = _.keys(matrix)
        .sort()
        .map(key => numbers.matrix.transpose(matrix[key]));
      return _.flatten(
        transposedMatrix.map((x, index) => {
          return x.map(y => {
            var highlight =
              this.highlightName.length == 0 || this.highlightName == y[0].name;
            return {
              name: y[0].name,
              data: y.map(z => z.value),
              type: "line",
              category: `${index ? index + 1 : "单"}人关系`,
              lineStyle: {
                color: highlight
                  ? this.colors[index % this.colors.length]
                  : "#e7e6e6",
                width: highlight && this.highlightName.length ? 2 : 0.5
              },
              symbol: "none",
              smooth: true,
              z: highlight ? 9999 : index
            };
          });
        })
      );
      /*
        return {
          name: `${index ? index + 1 : "单"}人关系`,
          type: "line",
          data: x.map((y, i) => {
            return {
              name: y[0].name,
              value: y.map(z => z.value),
            };
          }),
          smooth: true,
          z: this.highlightGroup == index ? 9999 : 1
        };
      });
      */

      //      return matrix;
    },
    parallelAxis: function() {
      if (this.nodes == undefined) {
        return [];
      }
      return this.nodes.map((t, index) => ({
        dim: index,
        name: `第${index + 1}集`
      }));
    }
  },
  methods: {
    resizeEvent: function() {
      this.resizeFunc();
    },
    onFocus: function(msg) {
      var character = msg.character;
      if (_.isArray(character)) {
        character = character.join("-");
      }
      this.highlightName = character;
      /*
      for (var i = 0; i < this.chartData.length; i++) {
        var value = this.chartData[i];
        var roleIndex = value.data.findIndex(item => item.name == character);
        if (roleIndex != -1) {
          this.highlightGroup = i;
          this.highlightIndex = roleIndex;
          break;
        }
      }
      */
    }
  },
  mounted: function() {
    this.resizeFunc = _.debounce(this.$refs.roleparallel.chart.resize, 500);
    this.resizeFunc();
    this.$parent.$on("resized", this.resizeEvent);
    this.$EventBus.$on("actor-focus", this.onFocus);
  }
};
</script>