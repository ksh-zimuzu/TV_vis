<template>
  <div style="width:100%;height:100%"></div>
</template>

<script>
import echarts from "echarts";
import Jimp from "jimp";
import PeopleService from "../services/people";

var IMG_BASE_URL = "https://image.tmdb.org/t/p/w300";

export default {
  props: {
    players: Array //{name:"xxx","role":"yyy","popularity":10}
  },
  data: function() {
    return {
      chart: undefined,
      options: {
        tooltip: {
          //position: "top",
          show: true,
          formatter: params => {
            console.log(params);
            var popularity = params.data.symbolSize / 10;
            var name = params.name;
            return `${name}: ${popularity}`;
          }
        },
        title: [],
        singleAxis: {
          type: "category",
          height: "80%",
          top: "0%",
          //data: this.players.map(item => item.name),
          axisLabel: {
            interval: 0,
            formatter: (value, index) => {
              console.log(value, index);
              var character = this.players[index].character;
              return `{player|${value}}\n{character|${character}}`;
            },
            rich: {
              player: {
                fontWeight: "bold"
              },
              character: {
                fontWeight: "lighter"
              }
            }
          }
        },
        series: [
          {
            data: [],
            type: "scatter",
            coordinateSystem: "singleAxis",
            symbolKeepAspect: true
          }
        ]
      },
      player_infos: []
    };
  },
  mounted: function() {
    this.chart = echarts.init(this.$el);
    this.reloadPlayerInfo().then(() => {
      this.updateOption();
      this.updateImg();
    });
  },
  computed: {},
  watch: {
    options: function() {
      this.chart.setOption(this.options);
    },
    players: function() {
      this.reloadPlayerInfo().then(this.updateOption);
    }
  },
  methods: {
    updateImg: function() {
      var promises = this.player_infos.map((item, index) => {
        console.log("item=", item);
        if (item.image) {
          return Jimp.read(IMG_BASE_URL + item.image)
            .then(img => {
              return img.circle().getBase64Async(Jimp.MIME_PNG);
            })
            .then(src => {
              this.$set(this.options.series[0].data, index, {
                value: [item.name],
                symbol: "image://" + src,
                name: item.name,
                symbolSize: item.popularity * 10
              });
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          this.$set(this.options.series[0].data, index, {
            value: [item.name],
            //symbol: "image://" + src,
            label: {
              show: true
            },
            name: item.name,
            symbolSize: item.popularity * 10
          });
          /*
          this.options.series[0].data.push({
            value: [item.name],
            //symbol: "image://" + src,
            label: {
              show: true
            },
            name: item.name,
            symbolSize: item.popularity * 10
          });
          */
        }
      });
      //上述操作全部完成后，更新option
      Promise.all(promises).then(this.updateOption);
    },
    updateOption() {
      this.chart.setOption(this.options);
    },
    reloadPlayerInfo() {
      this.player_infos = [];
      var promises = this.players.map(item => {
        return PeopleService.fetch_people_info(item.id).then(res => {
          this.player_infos.push({
            name: res.data.name,
            popularity: res.data.popularity,
            image: res.data.profile_path
          });
        });
      });
      return Promise.all(promises).then(this.updateOption);
    }
  }
};
</script>