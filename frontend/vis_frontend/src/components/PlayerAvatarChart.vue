<template>
  <div style="width:100%;height:100%"></div>
</template>

<script>
import echarts from "echarts";
import Jimp from "jimp";
import PeopleService from "../services/people";
import _ from "lodash";

var IMG_BASE_URL = "https://image.tmdb.org/t/p/w300";

export default {
  props: {
    players: Array //{name:"xxx","role":"yyy","popularity":10}
  },
  data: function() {
    return {
      chart: undefined,
      options: {
        animation: true,
        tooltip: {
          //position: "top",
          show: true,
          formatter: params => {
            console.log(params);
            var popularity = this.player_infos[params.dataIndex].popularity;
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
    this.chart.on("mouseover", params => {
      this.$EventBus.$emit("actor-focus", {
        name: this.players[params.dataIndex].name,
        character: this.players[params.dataIndex].character
      });
    });
    this.chart.on("mouseout", () => {
      this.$EventBus.$emit("actor-focus", { character: "", name: "" });
    });
  },
  computed: {
    maxP: function() {
      return _.maxBy(this.player_infos, t => t.popularity).popularity;
    },
    minP: function() {
      return _.minBy(this.player_infos, t => t.popularity).popularity;
    }
  },
  watch: {
    players: function() {
      this.reloadPlayerInfo().then(() => {
        this.updateOption();
        this.updateImg();
      });
    }
  },
  methods: {
    updateImg: function() {
      var promises = this.player_infos.map((item, index) => {
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
                symbolSize: this.calSymbolSize(item.popularity)
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
            symbolSize: this.calSymbolSize(item.popularity)
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
      var promises = this.players.map((item, index) => {
        return PeopleService.fetch_people_info(item.id).then(res => {
          this.$set(this.player_infos, index, {
            name: res.data.name,
            popularity: res.data.popularity,
            image: res.data.profile_path
          });
        });
      });
      return Promise.all(promises).then(this.updateOption);
    },
    calSymbolSize(n) {
      return Math.pow(
        20 + (25 * (n - this.minP)) / (this.maxP - this.minP),
        1.43
      );
    }
  }
};
</script>