<template>
  <div style="width:100%;height:100%" id="networkchart" class="networkchart"></div>
</template>

<script>
import echarts from "echarts";
export default {
  name: "NetworkChart",
  props: {
    acid: String,
    ndata: Array
  },
  data: function() {
    return {
      chart: undefined,
      Nodes: Array,
      Links: Array,
      Graph: {}, //邻接表
      aid: String, //演员id
      parent: {},
      relationNumber: Number //最大关系
    };
  },
  mounted() {
    this.getData();
    this.chart = echarts.init(this.$el);
    this.create_chart();
  },
  methods: {
    BFS(graph) {
      var queue = [];
      var seen = new Set();
      var p = {};
      var sid = this.aid;
      queue.push(sid);
      seen.add(sid);
      p[sid] = "NONE";
      while (queue.length > 0) {
        var vertex = queue.shift();
        var nodes = graph[String(vertex)];
        for (let w = 0; w < nodes.length; w++) {
          if (!seen.has(nodes[w])) {
            // set不能用in!!
            queue.push(nodes[w]);
            seen.add(nodes[w]);
            p[nodes[w]] = vertex;
          }
        }
      }
      for (var key in p) {
        this.parent[key] = p[key];
      }
      console.log(this.parent);
    },
    getData() {
      //获取邻接表
      this.aid = "37940";
      this.ndata = [
        //{"actor1": {"id": "37940", "name": "Im Soo-jung", "character": "Bae Ta-Mi"}, "actor2": {"id": "1181895", "name": "Oh Ah-yeon", "character": "Jo A-Ra"}, "tv": "Search: WWW"},
        {
          actor1: { id: "37940", name: "Im Soo-jung", character: "Bae Ta-Mi" },
          actor2: {
            id: "1747746",
            name: "Woo Ji-hyeon",
            character: "Choi Bong-Ki"
          },
          tv: "Search: WWW"
        },
        {
          actor1: { id: "37940", name: "Im Soo-jung", character: "Bae Ta-Mi" },
          actor2: {
            id: "1747746",
            name: "Woo Ji-hyeon",
            character: "Choi Bong-Ki"
          },
          tv: "hello"
        },
        {
          actor1: { id: "37940", name: "Im Soo-jung", character: "Bae Ta-Mi" },
          actor2: {
            id: "554945",
            name: "Kwon Hae-hyo",
            character: "Min Hong-ju"
          },
          tv: "Search: WWW"
        },
        {
          actor1: { id: "37940", name: "Im Soo-jung", character: "Bae Ta-Mi" },
          actor2: {
            id: "1762692",
            name: "Ji Seung-hyun",
            character: "Oh Jin-Woo"
          },
          tv: "Search: WWW"
        },
        {
          actor1: { id: "37940", name: "Im Soo-jung", character: "Bae Ta-Mi" },
          actor2: {
            id: "1879169",
            name: "Lee Jae-wook",
            character: "Seol Ji-Hwan"
          },
          tv: "Search: WWW"
        },
        {
          actor1: { id: "37940", name: "Im Soo-jung", character: "Bae Ta-Mi" },
          actor2: {
            id: "1655398",
            name: "Jang Ki-yong",
            character: "Park Mo-Gun"
          },
          tv: "Search: WWW"
        },
        {
          actor1: { id: "37940", name: "Im Soo-jung", character: "Bae Ta-Mi" },
          actor2: {
            id: "150126",
            name: "Jeon Hye-jin",
            character: "Song Ka-Kyung"
          },
          tv: "Search: WWW"
        },
        {
          actor1: { id: "37940", name: "Im Soo-jung", character: "Bae Ta-Mi" },
          actor2: { id: "123807", name: "Lee Da-hee", character: "Cha Hyun" },
          tv: "Search: WWW"
        },
        {
          actor1: { id: "123807", name: "Lee Da-hee", character: "Cha Hyun" },
          actor2: { id: "1181895", name: "Oh Ah-yeon", character: "Jo A-Ra" },
          tv: "Search: WWW"
        }
      ];
      //TODO: 传参目前失败，采用简易的已有数据赋值
      var actorList = new Set();
      var id_name_dic = {}; //id-name字典
      var id_value_dic = {}; //id-值字典
      var nodes = [];
      for (let i = 0; i < this.ndata.length; i++) {
        actorList.add(this.ndata[i]["actor1"]["id"]);
        actorList.add(this.ndata[i]["actor2"]["id"]);
        id_name_dic[this.ndata[i]["actor1"]["id"]] = this.ndata[i]["actor1"]["name"];
        id_name_dic[this.ndata[i]["actor2"]["id"]] = this.ndata[i]["actor2"]["name"];
      }
      var graph = {};
      var links = [];
      for (let i = 0; i < this.ndata.length; i++) {
          var key1=this.ndata[i]["actor1"]["id"];
          var key2=this.ndata[i]["actor2"]["id"]
        if(key1 in id_value_dic){
            id_value_dic[key1]++;
        }else{
            id_value_dic[key1]=0;
        }
        if(key2 in id_value_dic){
            id_value_dic[key2]++;
        }else{
            id_value_dic[key2]=0;
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
      for (let actor of actorList) {
        var len = 0;
        var vid = actor;
        while (vid != "NONE") {
          vid = this.parent[vid];
          len++;
        }
        var nodetmp = {};
        nodetmp["id"] = actor;
        nodetmp["name"] = id_name_dic[actor];
        nodetmp["category"] = len-1;
        nodetmp["value"]= id_value_dic[actor];
        nodes.push(nodetmp);
      }
      this.Nodes = nodes; //结点
    },
    create_chart() {
      var options = this.chart_option;
      this.chart.setOption(options);
    }
  },
  computed: {
    chart_option(){
        var colors=["#bd2d28","#e58429","#e3ba22","#0f8c79","#42a5b3","#8e6c8a"];
        var categories = [];
        for (var i = 0; i <6; i++) {
            categories[i] = {
                name: '第' + String(i+1)+'层',
                itemStyle:{
                    color:colors[i],
                }
            };
        }
        var Nodes=this.Nodes;
        var Links=this.Links;
        Nodes.forEach(function (node) {
            node.itemStyle = null;
            node.symbolSize = node.value*5;
            node.x = node.y = null;//random
            node.draggable = true;
        });
        var op={
            tooltip: {},
            legend: [{
                data: categories.map(function (a) {
                    return a.name;
                })
            }],
            animation: false,
            series : [
                {
                    type: 'graph',
                    layout: 'force',
                    data: Nodes,
                    links: Links,
                    categories: categories,
                    roam: true,
                    label: {
                        position: 'right'
                    },
                    force: {
                        repulsion: 100
                    }
                }
            ]
        }
        return op;
    }
  }
};
</script>