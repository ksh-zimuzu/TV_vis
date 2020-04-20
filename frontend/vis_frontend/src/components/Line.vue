<template>
    <div id="echartContainer" style="width:1000px; height:500px"></div>
</template>

<script>
export default {
  name: 'Line',
  data () {
    return {
      chart: null,
      nameofmovie: ['春夜', '庆余年'],
      rating: [
        [40, 20, 35, 60, 55, 10, 20, 48, 13, 34, 45, 56],
        [20, 25, 35, 60, 70, 50, 69, 59, 47, 32, 35, 46]
      ]
    }
  },
  props () {},
  mounted () {
    var echarts = require('echarts')
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('echartContainer'))
    var se = []
    this.nameofmovie.forEach((item, index) => {
      var seri = {
        name: '',
        type: 'line',
        data: []}
      seri.name = item
      seri.data = this.rating[index]
      se[index] = seri
    })
    // 绘制图表
    var option = {
      // 标题
      title: {
        text: '电视剧收视率折线图'
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
        data: this.nameofmovie
      },
      // x轴
      xAxis: {
        data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
      },
      // y轴没有显式设置，根据值自动生成y轴
      yAxis: {},
      // 数据-data是最终要显示的数据
      series: se
    }
    myChart.showLoading()
    myChart.setOption(option)
    myChart.hideLoading()
  }
}
</script>
