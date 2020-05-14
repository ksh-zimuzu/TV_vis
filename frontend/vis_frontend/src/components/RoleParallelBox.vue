<template>
  <smart-widget :simple="simple" :loading="loading" title="角色出现频率">
    <RoleParallel :chartData="chartData" ref="roleparallel" />
  </smart-widget>
</template>

<script>
import RoleParallel from "./RoleParallel";
import numbers from "numbers";
import _ from "lodash";
var nodes = [];
var preChartData = [];
var totalChartData = new Map();
export default {
  name: "RoleParallelBox",
  components: {
    RoleParallel
  },
  props: {
    simple: {
      type: Boolean,
      default: true
    }
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
    ],
    loading: true,
    chartData: {}
  }),
  created: function() {
    this.$EventBus.$on("nodes-ready", msg => {
      nodes = msg;
      preChartData = this.preChartData();
      this.chartData = this.getChartData(preChartData);
      this.loading = false;
    });
    this.$EventBus.$on("loading", msg => {
      if (msg.source == "MainChart") {
        this.loading = true;
      }
    });
  },
  computed: {},
  methods: {
    resizeEvent: function() {
      this.resizeFunc();
    },
    onFocus: function(msg) {
      //var index = msg.index;
      /*
      if (index != undefined) {
          
        this.$refs.roleparallel.chart.dispatchAction({
          type: "highlight",
          seriesIndex: index
        });
      }
      */
      /*
      if (msg.character) {
        this.highlightName = msg.character;
      }
*/
      var character = msg.character;
      if (_.isArray(character)) {
        character = character.join("-");
      }
      this.highlightName = character;
      this.chartData = this.getChartData(preChartData);
      /*
      this.highlightName = character;
      */
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
    },
    preChartData: function() {
      var transposedMatrix = this.transposedMatrix();
      if (transposedMatrix.length == 0) {
        return [];
      }
      /*
      var preChartData = _.flatten(
        transposedMatrix.map((x, index) => {
          return x.map(y => {
            var highlight =
              this.highlightName.length == 0 || this.highlightName == y[0].name;
            return {
              name: y[0].name,
              data: y.map(z => z.value),
              type: "line",
              category: `${index ? index + 1 : "单"}人关系`,
              itemStyle: {
                color: highlight
                  ? this.colors[index % this.colors.length]
                  : "#e7e6e6",
                opacity: 0
              },
              lineStyle: {

                width: highlight && this.highlightName.length ? 2 : 0.5
              },
              symbol: "circle",
              //showSymbol: false,
              symbolSize: 10,
              smooth: true,
              z: highlight ? 9999 : index,
              tooltio: {
                show: true
              }
            };
          });
        })
      )
*/
      var mapData = _.chain(transposedMatrix)
        .map((x, index) => {
          return x.map(y => {
            return [
              y[0].name,
              {
                name: y[0].name,
                data: y.map(z => z.value),
                type: "line",
                category: index,
                symbol: "circle",
                showSymbol: false,
                //showSymbol: false,
                //symbolSize: 10,
                smooth: true,
                tooltip: {
                  show: true
                }
              }
            ];
          });
        })
        .flatten()
        .value();
      totalChartData = new Map(mapData);

      var preChartData = _.chain(transposedMatrix)
        .map((x, index) => {
          return x.map(y => {
            return {
              name: y[0].name,
              data: y.map(z => z.value),
              type: "line",
              category: index,
              symbol: "circle",
              showSymbol: false,
              //symbolSize: 10,
              smooth: true,
              tooltip: {
                show: true
              }
            };
          });
        })
        .flatten()
        .sortBy(
          a => -numbers.statistic.standardDev(a.data),
          a => -numbers.statistic.mean(a.data)
        )
        .slice(0, 10)
        .value();
      return preChartData;
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
    getChartData: function(preChartData) {
      var res = preChartData.map(x => {
        //x = _.clone(x);
        var highlight =
          this.highlightName.length == 0 || this.highlightName == x.name;
        var index = x.category;
        return _.assign({}, x, {
          lineStyle: {
            /*
                color: highlight
                  ? this.colors[index % this.colors.length]
                  : "#e7e6e6",
                  */
            width: highlight && this.highlightName.length ? 2 : 1
          },
          itemStyle: {
            color: highlight
              ? this.colors[index % this.colors.length]
              : "#e7e6e6"
          },
          z: highlight ? 9999 : index,
          category: `${index ? index + 1 : "单"}人关系`
        });
      });
      //如果要高亮的线段不在默认线段里
      if (res.findIndex(t => t.name == this.highlightName) == -1) {
        var series = totalChartData.get(this.highlightName);
        if (series) {
          var index = series.category;
          res.push(
            _.assign({}, series, {
              lineStyle: {
                width: 2
              },
              itemStyle: {
                color: this.colors[index % this.colors.length]
              },
              z: 9999,
              category: `${index ? index + 1 : "单"}人关系`
            })
          );
        }
      }
      return res;
    },
    transposedMatrix: function() {
      if (!nodes) {
        return [];
      }
      var groups = nodes.map(ep => {
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
      groups = null;
      var transposedMatrix = _.keys(matrix)
        .sort()
        .map(key => numbers.matrix.transpose(matrix[key]));
      return transposedMatrix;
    }
  },
  mounted: function() {
    this.resizeFunc = _.debounce(this.$refs.roleparallel.resize, 500);
    this.resizeFunc();
    this.$parent.$on("resized", this.resizeEvent);
    this.$EventBus.$on("actor-focus", this.onFocus);
  }
};
</script>