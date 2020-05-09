<template>
    <div class="echarts">
    <div :style="{height:height,width:width}" ref="myEchart"></div>
  </div>
</template>

<script>
import echarts from 'echarts' // 引入组件
import '../../node_modules/echarts/lib/chart/line'
import $ from 'jquery'
export default {
  name: 'Liner',
  data () {
    return {
      chart: null,
      place: 'China'
    }
  },
  props: {
    width: { type: String, default: '1000px' },
    height: {type: String, default: '500px'}
  },
  mounted () {
    this.initChart()
  },
  
  methods: {
  initChart(){
    this.chart = echarts.init(this.$refs.myEchart)
    window.onresize = echarts.init(this.$refs.myEchart).resize
    var se = []
    var nameo = []
    $.ajax('../data/'+this.place+'.json').then((res) =>{
      alert(res.nameofmovie)
      console.log(res)
      res.nameofmovie.forEach((item, index) => {
        nameo[index] = res.nameofmovie
        var seri = {
          name: '',
          type: 'line',
          data: []}
        seri.name = item
        seri.data = res.rating[index]
        se[index] = seri
      })
      })
    // this.chart.showLoading()
    // 绘制图表
    var option = {
      // 标题
      title: {
        text: 'tmdb部分电视剧收视率折线图'
      },
      tooltip: {
        trigger: 'axis',
        // 当鼠标移动到数值时候，在X轴Y轴显示数值
        axisPointer: {
          type: 'cross'
        },
        triggerOn: 'mousemove',
        enterable: true
      },
      dataZoom: [// 控制缩放
        {
          type: 'slider',
          xAxisIndex: 0,
          start: 0,
          end: 100
        },
        {
          type: 'inside',
          xAxisIndex: 0,
          start: 0,
          end: 100
        },
        {
          type: 'slider',
          yAxisIndex: 0,
          start: 0,
          end: 100
        },
        {
          type: 'inside',
          yAxisIndex: 0,
          start: 0,
          end: 100
        }
      ],
      // 工具箱
      // 保存图片
      toolbox: {
        show: true,
        feature: {
          saveAsImage: {
            show: true
          }
        }
      },
      // 图例-每一条数据的名字
      legend: {
        data: nameo
      },
      // x轴
      xAxis: {
        type: 'time',
        name: '时间',
        minInterval: 1,
        min: (new Date('2019-11-20')),
        max: (new Date('2020-04-26'))
      },
      // y轴没有显式设置，根据值自动生成y轴
      yAxis: {
        name: '收视率'
      },
      // 数据-data是最终要显示的数据
      series: se
    }
    this.chart.hideLoading()
    this.chart.setOption(option)
    this.chart.on('click', (param) => {
      var name = param.seriesName
      window.location.href = '/HelloWorld'+name
    })
    
  }
  }
}
</script>

<style scoped>

</style>