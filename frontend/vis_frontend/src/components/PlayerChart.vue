<template>
  <div style="width:100%;height:100%"></div>
</template>

<script>
import echarts from "echarts";
import _ from "lodash";

var chart = undefined;

export default {
  name: "PlayerChart",
  props: {
    /*
      形状：
        {tv_name:
            name:角色名,
            present:[1,2,3,...],
            rating:{
                豆瓣:x.x
            }
        }
    */
    chartData: Object,
    //可定义调色盘
    colors: {
      type: Array,
      default: () => ["#E3BA22", "#E6842A", "#137B80", "#8E6C8A", "#978F80"]
    }
  },
  data: function() {
    return {
      chart: undefined
    };
  },
  mounted() {
    chart = echarts.init(this.$el);
    this.refresh_chart();
  },
  methods: {
    refresh_chart: function() {
      /*使用option刷新chart
       */
      var options = this.options;
      chart.setOption(options);
    },
    color_picker: function() {
      var i = 1;
      var pick_color = () => {
        return this.colors[i++ % this.colors.length];
      };
      return pick_color;
    },
    resize() {
      chart.resize();
    }
  },
  computed: {
    options() {
      var tvs = _.keys(this.chartData); //演员演出的电视剧
      var color = this.color_picker(); //取色器
      var height = 95 / tvs.length; //每一个电视的高度
      var res = {
        //每一个电视对应一个系列，每个系列颜色不同，展开；加上右侧栏柱状图
        series: [
          ..._.toPairs(this.chartData).map(([, item], i) => ({
            type: "themeRiver",
            singleAxisIndex: i,
            data: item.present.map((p, index) => [index + 1, p, item.name]),
            label: { show: false },
            color: [color()]
          })),
          {
            type: "bar",
            label: {
              normal: {
                show: true
              }
            },
            data: _.toPairs(this.chartData).map(([key, item]) => ({
              name: key,
              value: item.rating.豆瓣
            })),
            color: this.colors,
            tooltip: {
              show: true
            }
          }
        ],
        /*
        右侧柱状图的网格 |.20%.|...50%...|5%|.25%.|
                       👆标题区 👆河流图 👆空白 👆柱状图区
        */
        grid: {
          left: "75%",
          top: "0%",
          bottom: "0%",
          containLabel: true
        },
        //XY轴
        xAxis: {
          type: "value"
        },
        yAxis: {
          type: "category",
          inverse: true
        },
        //提示框，需完善
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "line",
            lineStyle: {
              color: "rgba(0,0,0,0.2)",
              width: 1,
              type: "solid"
            }
          },
          formatter: function(params) {
            return [
              `第${params[0].data[0]}集`,
              `${params[0].data[2]}`,
              `出现${params[0].data[1]}次`
            ].join("\n");
          }
        },
        //河流图的坐标轴，由于不同的电视集数不同，因此各电视剧独享坐标轴
        singleAxis: _.toPairs(this.chartData).map(([, item], index) => ({
          max: item.present.length,
          min: 1,
          minInterval: 1,
          top: height * index + "%",
          left: "20%",
          right: "30%",
          height: height + "%"
        })),
        //左侧标题，居中对齐
        title: _.toPairs(this.chartData).map(([tv], index) => ({
          textBaseline: "middle",
          top: height * index + height / 2 + "%",
          text: _.truncate(tv, {
            length: 7
          }),
          textStyle: {
            fontSize: 14
          }
        }))
      };
      return res;
    }
  },
  watch: {
    chartData: {
      handler: function(val) {
        console.log(val);
        this.refresh_chart();
      }
    }
  },
  beforeDestroy() {
    chart.isDisposed() || chart.dispose();
  }
};
</script>
