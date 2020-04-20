<template>
  <div class="echarts">
    <div :style="{height:height,width:width}" ref="myEchart"></div>
  </div>
</template>

<script>
    import echarts from "echarts" //引入组件
    import '../../node_modules/echarts/map/js/world.js'    //引入组件

    export default {
      name: "worldMap",
      props: {
        width: {type: String, default: "1000px" },
        height: {type: String, default: "600px"}
      },
      data() {
        return {
          chart: null,
          data:[
            {"name": "中国", "value": 10},
            {"name": "美国", "value": 12},
            {"name": "英国", "value": 6},
            {"name": "日本", "value": 10},
            {"name": "韩国", "value": 10}
          ]
        };
      },
      mounted() {
        this.initChart();
      },
      methods: {
        initChart() {
          this.chart = echarts.init(this.$refs.myEchart);
          window.onresize = echarts.init(this.$refs.myEchart).resize;
          // 把配置和数据放这里
          this.chart.setOption({
            //b8dfe6
            backgroundColor: "#B8DFE6",
            title: {    //地图显示标题
              text: '全球剧集流行程度',
              subtext: 'Global popularity of TV series',
              //sublink: 'http://www.baidu.com',
              top: "30px",
              left: 'center',
              textStyle: {color: '#fff'}
            },
            visualMap: {   //图列显示柱
              type: 'continuous',
              min: 0,
              left: 30,
              bottom: 50,
              max: 12,
              text:['高','低'],
              realtime: false,
              calculable : true,
              color: ['#0C4E00', '#5C8100', '#A0B700', '#D2CF00', '#E6E4A6', '#E5E2E0']
              //color: ['orangered','yellow','lightskyblue']
            },
            toolbox: {  //工具栏
              show: true,
              orient: 'vertical',
              left: 'right',
              top:50,
              itemGap:20,
              left:30,
              feature: {
                dataView: {readOnly: false},
                restore: {},
                saveAsImage: {}
              }
            },
            tooltip: {  //提示框组件
              trigger: 'item',
              formatter: '{b}<br/>{c} 部剧'
            },
            series: [{
              name:"剧集数量",
              type: 'map',
              mapType: 'world',
              roam: true, //开启鼠标缩放和平移漫游
              scaleLimit:{
                min: 0.5,
                max: 2.0
              },
              data: this.data,   //绑定数据
              nameMap:{ //自定义地区的名称映射
                'China':'中国',
                'United States':'美国',
                'United Kingdom':'英国',
                'Japan': '日本',
                'Korea': '韩国'
              },
              itemStyle: {
                emphasis: {
                  areaColor: '#0F8C79',
                  borderColor: '#ffffff',
                  borderWidth: 1
                }
              }
            }],
          });
        }
      }
    }
</script>

<style scoped>

</style>
