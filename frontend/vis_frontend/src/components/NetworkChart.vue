<template>
  <div
    v-if="exist === 1"
    style="width: 100%; height: 100%"
    id="networkchart"
    class="networkchart"
  ></div>
  <img
    v-else-if="exist === 0"
    class="img"
    src="../../public/networkDataError.jpg"
  />
</template>

<script>
import echarts from "echarts";

const LEVEL = 4;

export default {
  name: "NetworkChart",
  props: {
    acid: String,
    ndata: Array,
    loading: Boolean,
  },
  data: function () {
    return {
      chart: undefined,
      Nodes: Array,
      Links: Array,
      Graph: {}, //邻接表
      parents: {},
      exist: 1,
    };
  },
  mounted() {
    this.getData();
    this.chart = echarts.init(this.$el);
    this.create_chart();
  },
  methods: {
    showExist() {
      console.log(this.exist);
    },
    BFS(graph) {
      var queue = [];
      var seen = new Set();
      var p = {};
      var sid = this.acid;
      queue.push(sid);
      seen.add(sid);
      p[sid] = "NONE";
      var count = 0;
      while (queue.length > 0 && count < LEVEL) {
        //使用BFS时，只考虑6层联系内的演员
        var vertex = queue.shift();
        var vertexnodes = graph[String(vertex)];
        for (let w = 0; w < vertexnodes.length; w++) {
          if (!seen.has(vertexnodes[w])) {
            // set不能用in!!
            queue.push(vertexnodes[w]);
            seen.add(vertexnodes[w]);
            p[vertexnodes[w]] = vertex;
          }
        }
        console.log(count);
        count++;
      }
      for (var key in p) {
        this.parents[key] = p[key];
      }
      console.log(this.parents);
    },
    getData() {
      this.exist = 1;
      if (this.loading) {
        console.log("not yet!");
        return;
      }
      //获取邻接表
      //this.aid = "37940";
      console.log("-------NetworkChart--------");
      console.log(this.acid);
      console.log(this.ndata);
      var actorList = new Set();
      var id_name_dic = {}; //id-name字典
      var id_value_dic = {}; //id-值字典
      var nodes = [];
      for (let i = 0; i < this.ndata.length; i++) {
        actorList.add(this.ndata[i]["actor1"]["id"]);
        actorList.add(this.ndata[i]["actor2"]["id"]);
        id_name_dic[this.ndata[i]["actor1"]["id"]] = this.ndata[i]["actor1"][
          "name"
        ];
        id_name_dic[this.ndata[i]["actor2"]["id"]] = this.ndata[i]["actor2"][
          "name"
        ];
      }
      console.log("actorList");
      console.log(actorList);
      if (!actorList.has(this.acid)) {
        this.exist = 0;
        console.log("演员网络数据未包含该演员");
        alert("该演员网络数据缺失，制作组正在征集数据噢qwq");
        return;
      }
      var graph = {};
      var links = [];
      for (let i = 0; i < this.ndata.length; i++) {
        var key1 = this.ndata[i]["actor1"]["id"];
        var key2 = this.ndata[i]["actor2"]["id"];
        if (key1 in id_value_dic) {
          id_value_dic[key1]++;
        } else {
          id_value_dic[key1] = 0;
        }
        if (key2 in id_value_dic) {
          id_value_dic[key2]++;
        } else {
          id_value_dic[key2] = 0;
        }
        if (key2 in graph) {
          graph[key2].push(key1);
        } else {
          graph[key2] = [];
          graph[key2].push(key1);
        }
        if (key1 in graph) {
          graph[key1].push(key2);
        } else {
          graph[key1] = [];
          graph[key1].push(key2);
        }
        let tmp = {};
        tmp["source"] = this.ndata[i]["actor1"]["id"];
        tmp["target"] = this.ndata[i]["actor2"]["id"];
        links.push(tmp);
      }
      this.Links = links;

      this.BFS(graph);
      for (let actor in this.parents) {
        //只考虑parents数组中的演员
        var len = 0;
        var vid = actor;
        while (vid != "NONE") {
          vid = this.parents[vid];
          len++;
        }
        var nodetmp = {};
        nodetmp["id"] = actor;
        nodetmp["name"] = id_name_dic[actor];
        nodetmp["category"] = len - 1;
        nodetmp["value"] = id_value_dic[actor];
        nodes.push(nodetmp);
      }
      this.Nodes = nodes; //结点
      //this.ready = true;
    },
    create_chart() {
      var options = this.chart_option;
      this.chart.setOption(options, true); //避免生成之前数据的图表
    },
  },
  computed: {
    chart_option() {
      var colors = [
        "#bd2d28",
        "#e58429",
        "#e3ba22",
        "#0f8c79",
        "#42a5b3",
        "#8e6c8a",
      ];
      var categories = [];
      for (var i = 0; i < LEVEL - 1; i++) {
        categories[i] = {
          name: "第" + String(i + 1) + "层",
          itemStyle: {
            color: colors[i],
          },
        };
      }
      var Nodes = this.Nodes;
      var Links = this.Links;
      Nodes.forEach(function (node) {
        node.itemStyle = null;
        node.symbolSize = 5 * Math.log(node.value); //10; //如果映射node.value的话，效果较差
        node.x = node.y = null; //random
        node.draggable = true;
      });
      var op = {
        tooltip: {},
        legend: [
          {
            data: categories.map(function (a) {
              return a.name;
            }),
          },
        ],
        animation: false,
        series: [
          {
            type: "graph",
            layout: "force",
            data: Nodes,
            links: Links,
            categories: categories,
            roam: true,
            label: {
              position: "right",
            },
            force: {
              repulsion: 100,
            },
          },
        ],
      };
      return op;
    },
  },
  watch: {
    ndata() {},
    loading() {
      if (!this.loading) {
        this.getData();
        this.create_chart();
      }
    },
  },
  beforeDestroy() {
    this.chart.isDisposed() || this.chart.dispose();
  },
};
</script>