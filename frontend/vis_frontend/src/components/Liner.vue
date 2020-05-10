<template>
    <div class="echarts">
    //<span>{{countryName}}</span>
    <div :style="{height:height,width:width}" ref="myEchart"></div>
  </div>
</template>

<script>
import echarts from 'echarts' // 引入组件
import '../../node_modules/echarts/lib/chart/line'
import China from '../data/China.json'
import America from '../data/America.json'
import English from '../data/English.json'
import Japan from '../data/Japan.json'
import Korea from '../data/Korea.json'
export default {
  name: 'Liner',
  props: {
    width: { type: String, default: '1000px' },
    height: {type: String, default: '500px'},
    countryName: {
        type: String,
        default: 'China'
    }
  },
  data () {
    return {
      chart: null,
      se: [],
      nameo: [],
      da: [],
      currentCountry: this.countryName,
    }
  },
  mounted () {
    this.initChart()
    this.change(this.countryName)
  },
  watch: {
    countryName(val){
      console.log(val + '1')
      this.currentCountry = val
      this.change(this.currentCountry)
    }
    /*,
    other: {
        handler (newVal) {
          console.log(newVal + '2')
          this.change(this.countryName)
      }
    }*/
  },
  methods: {
    initChart () {
      this.chart = echarts.init(this.$refs.myEchart)
      window.onresize = echarts.init(this.$refs.myEchart).resize
      // 绘制图表
      var option = {
      // 标题
        title: {
          text: 'tmdb部分电视剧热度折线图'
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
          show: false,
          data: this.nameofmovie
        },
        // x轴
        xAxis: {
          name: '时间',
          data: this.da
        },
        // y轴没有显式设置，根据值自动生成y轴
        yAxis: {
          name: '收视率'
        },
        // 数据-data是最终要显示的数据
        series: this.se
      }
      this.chart.setOption(option)
    },
    change (country) {
      this.nameo = []
      this.se = []
      this.da = []
      var coun
      if (country === 'China') {
        coun = China
      } else if (country === 'United States') {
        coun = America
      } else if (country === 'United Kingdom') {
        coun = English
      } else if (country === 'Japan') {
        coun = Japan
      } else if (country === 'Korea') {
        coun = Korea
      }
      var beginDt = new Date('2019-11-20')
      var na = coun.nameofmovie
      var rat = coun.rating
      na.forEach((item, index) => {
        this.nameo.push(na)
        var seri = {
          name: '',
          type: 'line',
          data: []}
        seri.name = item
        seri.data = rat[index]
        this.se.push(seri)
      })
      for (var i = 0; i < coun.rating[0].length; i++) {
        var d = beginDt.getFullYear() + '-' + (beginDt.getMonth() + 1) + '-' + beginDt.getDate()
        this.da.push(d)
        beginDt.setDate(beginDt.getDate() + 1)
      }
      var option = {
      // 标题
        title: {
          text: 'tmdb部分电视剧热度折线图'
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
          show: false,
          data: this.nameo
        },
        // x轴
        xAxis: {
          name: '时间',
          data: this.da
        },
        // y轴没有显式设置，根据值自动生成y轴
        yAxis: {
          name: '热度'
        },
        // 数据-data是最终要显示的数据
        series: this.se,
      }
      this.chart.clear()
      this.chart.setOption(option)
        this.chart.on('click', (params) => {
            console.log(params)
            this.$router.push('/tv/' + params.seriesName)
        })
    }
  }

}
</script>
