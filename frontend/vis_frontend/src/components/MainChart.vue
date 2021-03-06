<template>
  <div
    style="width: 100%; height: 100%"
    id="sankeychart"
    class="mainchart"
  ></div>
</template>


<script>
import echarts from "echarts";
import _ from "lodash";
var chart = null;

function calSymbolSize(nodes, target) {
  /**
   * 优化node_size，使之尽可能达到小于target的最大值
   * 约束条件：
   * 1. 不能折叠全部节点
   * 2. 不能忽略全部节点
   *
   * 返回结果:
   * 尽可能接近target的节点列表等
   *
   * nodes: 节点数组
   * target: 优化目标
   */
  var values = nodes.map((t) => t.value);
  var minV = _.min(values);
  var maxV = _.max(values);

  function calSymbolSize(n, min, max, threshold) {
    if (n < threshold) {
      return 2.73 * Math.pow(n, 0.71);
    } else {
      return Math.pow(36 + (450 * (n - threshold)) / (max - threshold), 0.71);
    }
  }

  function calFoldAndIgnore(nodes, foldT, ingoreT, minV, maxV) {
    var res = _.filter(nodes, (node) => node.value >= ingoreT).map((node) => ({
      symbolSize: calSymbolSize(node.value - ingoreT + 1, minV, maxV, foldT),
      label: {
        normal: {
          show: node.value - ingoreT + 1 >= foldT,
        },
      },
      category: node.category,
      id: node.id,
      name: node.name,
      value: node.value,
    }));
    return res;
  }

  function backtrack(T, I) {
    var res = calFoldAndIgnore(nodes, T, I, minV, maxV);
    var totalR = _.sumBy(
      _.toPairs(_.countBy(res, (t) => t.symbolSize)),
      (t) => t[0] * t[1]
    );
    //如果已经小于优化目标，立刻返回避免继续下降
    //T>=maxV表示不允许全部折叠，去掉等号表示允许全部折叠
    if (totalR <= target || T >= maxV) {
      return {
        T,
        I,
        nodes: res,
        total: totalR,
      };
    } else {
      //如果I的下一个值>=T，则理论上应该比(T+1,I+1),(T+1,I)
      //但显然后者比前者大。若后者已经小于等于target，那完全不必比较前者
      //若后者比target大，后者自然会去搜索(T+1,I+1)的情况，也无需操作
      //因此这里可以直接剪掉前者分支
      if (I + 1 >= T) {
        return backtrack(T + 1, I);
      }
      //否则，需要计算(T+1,I)和(T,I+1)的值。他们应该尽其所能返回最接近target的值
      //因此若他们都小于target，则返回值较大的一个；
      //若有一个小于target，则返回小于target的一个；
      //如果都大于target，则返回值较小的一个
      else {
        var res1 = backtrack(T + 1, I);
        var res2 = backtrack(T, I + 1);
        if (res1.total <= target && res2.total <= target) {
          return res1.total > res2.total ? res1 : res2;
        } else if (res1.total <= target || res2.total <= target) {
          return res1.total <= target ? res1 : res2;
        } else {
          return res1.total < res2.total ? res1 : res2;
        }
      }
    }
  }

  return backtrack(2, 1);
}

export default {
  name: "MainChart",
  props: {
    sdata: Object,
    edata: Number,
    loading: Boolean,
  },
  data: function () {
    return {
      chart: undefined,
      Nodes: Array,
      Links: Array,
      relationNumber: Number, //最大关系
      ready: false,
    };
  },
  mounted: function () {
    chart = echarts.init(this.$el);
    chart.on("timelinechanged", (params) => {
      this.$EventBus.$emit("episode-focus", {
        focusIndex: params.currentIndex,
      });
    });
    chart.on("focusnodeadjacency", this.focusNode);
    chart.on("unfocusnodeadjacency", this.unFocusNode);
    this.$EventBus.$on("episode-focus", this.focus);
    this.$EventBus.$on("actor-focus", this.focusRole);
  },
  methods: {
    dataFormat() {
      this.ready = false;
      if (this.loading) {
        return;
      }
      function unique(arr) {
        //去重数组
        return Array.from(new Set(arr));
      }
      function relation(s, re) {
        //正则表达式出现次数
        re = eval("/" + re + "/ig");
        return s.match(re) ? s.match(re).length : 0;
      }
      //所有结点
      var allNodes = [];
      for (var m = 1; m <= this.edata; m++) {
        var data = this.sdata[m];
        for (var i = 0; i < data.length; i++) {
          data[i].forEach(function (x) {
            var re = new RegExp(",", "g");
            allNodes.push(x[0].join().replace(re, "-"));
          });
        }
      }
      allNodes = unique(allNodes);
      var n = 0;
      var num = 0;
      var NewNodes = [];
      var reverseNodes = {}; //倒排索引
      allNodes.forEach(function (node) {
        reverseNodes[node] = num;
        NewNodes.push({
          id: String(num++),
          name: node,
          category: relation(node, "-"),
          value: 0,
        });
        if (relation(node, "-") > n) {
          n = relation(node, "-");
        }
      });
      this.relationNumber = n + 1;
      var Links = [];
      var Nodes = [];
      var regularexp = new RegExp(",", "g");
      for (var d = 1; d <= this.edata; d++) {
        var singleLinks = [];
        var singleNodes = [];
        singleNodes = JSON.parse(JSON.stringify(NewNodes)); //深拷贝
        var ndata = this.sdata[d];
        for (var j = 0; j < ndata.length; j++) {
          //关系结点数组
          for (var k = 0; k < ndata[j].length; k++) {
            //每组关系
            if (ndata[j][k][0].length > 1) {
              //多角色情况下
              for (var chanum = 0; chanum < ndata[j][k][0].length; chanum++) {
                //每个角色
                singleLinks.push({
                  source: String(reverseNodes[ndata[j][k][0][chanum]]),
                  target: String(
                    reverseNodes[ndata[j][k][0].join().replace(regularexp, "-")]
                  ),
                  value: ndata[j][k][1],
                  lineStyle: {
                    width: ndata[j][k][1],
                  },
                });
              }
            }
            var key =
              reverseNodes[ndata[j][k][0].join().replace(regularexp, "-")];
            singleNodes[key].value = ndata[j][k][1];
          }
        }
        Links.push(singleLinks);
        Nodes.push(singleNodes);
      }
      this.Links = Links;
      this.Nodes = Nodes;
      this.$EventBus.$emit("nodes-ready", this.Nodes);
      this.ready = true;
    },

    create_chart() {
      var options = this.animate_option;
      console.log(options);
      chart.setOption(options);
    },
    focus(msg) {
      //加载期间不响应事件
      if (this.loading && !this.ready) {
        return;
      }
      if (
        msg.focusIndex != chart.getOption().timeline[0].currentIndex &&
        msg.focusIndex >= 0
      ) {
        var option = {
          timeline: [
            {
              currentIndex: msg.focusIndex,
            },
          ],
        };
        chart.setOption(option);
      }
      //console.log(msg, chart.getOption());
    },
    focusRole: function (msg) {
      //加载期间不响应事件
      if (this.loading && !this.ready) {
        return;
      }
      if (msg.source != "MainChart") {
        /*此处暂时屏蔽unfocusNodeAdjacency的回调，因为该事件是响应外部事件的
        如果此处不屏蔽事件响应，会导致触发unfocus事件，导致在演员图中存在，但是
        在主视图中不存在的点，在演员图中无法高亮
        */
        chart.off("unfocusNodeAdjacency", this.unFocusNode);
        chart.off("focusNodeAdjacency", this.focusNode);
        var index = chart
          .getOption()
          .series[0].data.findIndex((t) => t.name == msg.character);
        if (index != -1) {
          chart.dispatchAction({
            type: "focusNodeAdjacency",
            seriesIndex: 0,
            dataIndex: index,
          });
        } else {
          chart.dispatchAction({
            type: "unfocusNodeAdjacency",
            seriesIndex: 0,
          });
        }
        chart.on("unfocusNodeAdjacency", this.unFocusNode);
        chart.on("focusNodeAdjacency", this.focusNode);
      }
    },
    calSymbolSize(n, min, max, threshold) {
      //return 2 * n;
      //return Math.pow((300 * (n - min + 1)) / (max - min), 0.71);
      //var t = n < mean ? 0 : n -Math.ceil(mean);
      if (n < threshold) {
        return 2.73 * Math.pow(n, 0.71);
      } else {
        return Math.pow(36 + (450 * (n - threshold)) / (max - threshold), 0.71);
      }
      //return Math.pow(4.12 + (501 * t) / (max - min), 0.71);
    },
    calFoldThreshold(nodes, threshold, minV, maxV) {
      /*
      var res = nodes.map(node => ({
        symbolSize: this.calSymbolSize(node.value, minV, maxV, threshold),
        label: {
          normal: {
            show: node.value >= threshold
          }
        },
        category: node.category,
        id: node.id,
        name: node.name,
        value: node.value
      }));
      var totalR = _.sumBy(
        _.toPairs(_.countBy(res, t => t.symbolSize)),
        t => t[0] * t[1]
      );
      return totalR > 900 && threshold <= maxV
        ? this.calFoldThreshold(nodes, threshold + 1, minV, maxV)
        : res;
        */
      for (var ingoreT = 1; ingoreT <= maxV; ingoreT++) {
        for (var foldT = 2; foldT <= maxV; foldT++) {
          var res = this.calFoldAndIgnore(nodes, foldT, ingoreT, minV, maxV);
          var totalR = _.sumBy(
            _.toPairs(_.countBy(res, (t) => t.symbolSize)),
            (t) => t[0] * t[1]
          );
          if (totalR <= threshold) {
            return [res, ingoreT];
          }
        }
      }
      return [this.calFoldAndIgnore(nodes, maxV, maxV, minV, maxV), maxV];
    },
    calFoldAndIgnore(nodes, foldT, ingoreT, minV, maxV) {
      var res = _.filter(nodes, (node) => node.value >= ingoreT).map(
        (node) => ({
          symbolSize: this.calSymbolSize(
            node.value - ingoreT + 1,
            minV,
            maxV,
            foldT
          ),
          label: {
            normal: {
              show: node.value - ingoreT + 1 >= foldT,
            },
          },
          category: node.category,
          id: node.id,
          name: node.name,
          value: node.value,
        })
      );
      return res;
    },
    unFocusNode() {
      //加载期间不响应事件
      if (this.loading && !this.ready) {
        return;
      }
      this.$EventBus.$emit("actor-focus", {
        character: "",
        source: "MainChart",
      });
    },
    focusNode: function (params) {
      //加载期间不响应事件
      if (this.loading && !this.ready) {
        return;
      }
      if (params.dataIndex != undefined) {
        //如果鼠标悬浮到角色结点
        var option = chart.getOption();
        var node = option.series[0].data[params.dataIndex];
        if (node.category == 0) {
          //如果是单人的
          this.$EventBus.$emit("actor-focus", {
            character: node.name,
            source: "MainChart",
            index: params.dataIndex,
          });
        } else {
          this.$EventBus.$emit("actor-focus", {
            character: node.name.split("-"),
            source: "MainChart",
            index: params.dataIndex,
          });
        }
      }
    },
    resize: function () {
      chart.resize();
    },
  },

  computed: {
    animate_option() {
      var times = this.edata;
      var Nodes = this.Nodes.map((item) => _.filter(item, (t) => t.value > 0));
      var Links = this.Links;
      for (var c = 0; c < Nodes.length; c++) {
        //var values = Nodes[c].map(t => t.value);
        //var minV = _.min(values);
        //var maxV = _.max(values);
        var res = calSymbolSize(Nodes[c], 900);
        /*
        var [NodeRes, ingoreT] = this.calFoldThreshold(
          Nodes[c],
          900,
          minV,
          maxV
        );
        */
        var NodeRes = res.nodes;
        var ingoreT = res.I;
        /*
        Nodes[c].forEach(node => {
          node.itemStyle = null;
          node.symbolSize = this.calSymbolSize(node.value, minV, maxV, meanV);
          node.label = {
            normal: {
              show: node.symbolSize > 4
            }
          };
        });
        */
        Nodes[c] = NodeRes;

        Links[c] = Links[c].map((t) => {
          t = _.cloneDeep(t);
          t.lineStyle.width -= ingoreT - 1;
          return t;
        });
      }
      var categories = [];
      //var colors=["#f2da57","#f6b656","#e25a42","#dcbdcf","#b396ad",
      //             "#b0cbdb","#33b6d0","#7abfcc","#c8d7a1","#a9b700",]
      var colors = [
        "#e3ba22",
        "#e58429",
        "#bd2d28",
        "#8e6c8a",
        "#6b99a1",
        "#42a5b3",
        "#0f8c79",
        "#6bbba1",
        "#5c8100",
      ];
      var color = 0;
      //var na=["","单","二","三","四","五","六","七","八","九","十"];
      for (var i = 0; i < this.relationNumber; i++) {
        categories[i] = {
          name: String(i + 1) + "人关系",
          itemStyle: {
            color: colors[color++],
          },
        };
      }
      categories[0].name = "单人";
      console.log(categories);
      var op = {
        baseOption: {
          timeline: {
            controlStyle: {
              color: "#000000",
            },
            data: (function (times) {
              var data = [];
              for (var i = 1; i <= times; i++) {
                data.push("第" + String(i) + "集");
              }
              return data;
            })(times),
            axisType: "category",
            autoPlay: false,
            playInterval: 3000,
            left: "10%",
            right: "10%",
          },
        },
        options: (function () {
          var opt = [];
          for (var i = 0; i < times; i++) {
            opt.push({
              tooltip: {},
              legend: [
                {
                  data: categories.map(function (a) {
                    return a.name;
                  }),
                },
              ],
              animationDurationUpdate: 2000,
              animationEasingUpdate: "quinticInOut",
              series: [
                {
                  type: "graph",
                  layout: "circular",
                  circular: {
                    rotateLabel: true,
                  },
                  data: Nodes[i].sort(cmp),
                  links: Links[i],
                  categories: categories,
                  roam: true,
                  label: {
                    position: "right",
                    formatter: "{b}",
                  },
                  lineStyle: {
                    color: "target",
                    //width: 0,
                    curveness: 0.3,
                  },
                  focusNodeAdjacency: true,
                },
              ],
            });
          }
          return opt;
        })(times),
      };
      return op;
    },
  },
  watch: {
    // sdata() {
    //   this.dataFormat();
    //   this.create_chart();
    // },

    // edata() {
    //   this.dataFormat();
    //   this.create_chart();
    // },
    loading() {
      if (!this.loading) {
        this.dataFormat();
        this.create_chart();
      } else {
        this.$EventBus.$emit("loading", { source: "MainChart" });
      }
    },
  },
  beforeDestroy() {
    chart.isDisposed() || chart.dispose();
  },
};

function cmp(a, b) {
  if (a.category != b.category) {
    return a.category - b.category;
  } else {
    return -(a.value - b.value);
  }
}
</script>