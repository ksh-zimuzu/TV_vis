<template>
  <div style="width:100%;height:100%"></div>
</template>

<script>
import echarts from "echarts";
import Jimp from "jimp";
import PeopleService from "../services/people";
import _ from "lodash";

var IMG_BASE_URL = "https://image.tmdb.org/t/p/w300";

function buildSymbolSizer(level, that) {
  function symbolSizer(value, params) {
    var n = params.name;
    return (
      Math.pow(402 + (1635 * (n - that.minP)) / (that.maxP - that.minP), 0.71) /
      level
    );
  }
  return symbolSizer;
}

var chart = null;

export default {
  props: {
    players: Array //{name:"xxx","role":"yyy","popularity":10}
  },
  data: function() {
    return {
      chart: undefined,
      options: {
        baseOption: {
          animation: true,
          tooltip: {
            //position: "top",
            show: true,
            formatter: params => {
              var popularity = this.player_infos[params.dataIndex].popularity;
              var name = params.value[0];
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
                var character = this.players[index].character;
                return `${value}\n${character}`;
                //return `{player|${value}}\n{character|${character}}`;
              },
              rich: {
                player: {
                  fontWeight: "bold"
                },
                character: {
                  fontWeight: "lighter"
                }
              },
              fontWeight: "lighter",
              fontSize: 14
            }
          },
          series: [
            {
              data: [],
              type: "scatter",
              coordinateSystem: "singleAxis",
              symbolKeepAspect: true
              //symbolSize: buildSymbolSizer(1,this)
            }
          ]
        },
        media: [
          {
            option: {
              series: [
                {
                  symbolSize: buildSymbolSizer(1, this)
                }
              ]
            }
          },
          {
            query: {
              maxWidth: 600
            },
            option: {
              series: [
                {
                  symbolSize: buildSymbolSizer(2, this)
                }
              ]
            }
          }
        ]
      },
      player_infos: []
    };
  },
  created: function() {
    this.$EventBus.$on("before-route-enter", () => {
      this.reloadPlayerInfo().then(() => {
        this.updateOption();
        this.updateImg();
      });
    });
  },
  mounted: function() {
    chart = echarts.init(this.$el, null, { renderer: "svg" });
    this.reloadPlayerInfo().then(() => {
      this.updateOption();
      this.updateImg();
    });
    chart.on("mouseover", params => {
      this.$EventBus.$emit("actor-focus", {
        name: this.players[params.dataIndex].name,
        character: this.players[params.dataIndex].character,
        source: "PlayerAvatarChart"
      });
    });
    chart.on("mouseout", () => {
      this.$EventBus.$emit("actor-focus", {
        character: "",
        name: "",
        source: "PlayerAvatarChart"
      });
    });
    this.$EventBus.$on("actor-focus", this.focusActor);
    //this.$EventBus.on("actor-focus")
    chart.on("click", params => {
      this.$router.push({
        path: "/actor/" + this.players[params.dataIndex].id,
        query: { name: this.players[params.dataIndex].name }
      });
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
      this.$emit("loading");
      this.reloadPlayerInfo().then(() => {
        //this.updateOption();
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
              this.$set(this.options.baseOption.series[0].data, index, {
                value: [item.name],
                symbol: "image://" + src,
                name: item.popularity,
                symbolKeepAspect: true
              });
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          this.$set(this.options.baseOption.series[0].data, index, {
            value: [item.name],
            //symbol: "image://" + src,
            label: {
              show: true
            },
            name: item.popularity,
            symbolKeepAspect: true
            //symbolSize: this.calSymbolSize(item.popularity)
          });
        }
      });
      //上述操作全部完成后，更新option
      Promise.all(promises)
        .then(this.updateOption)
        .then(this.loadComplete);
    },
    updateOption() {
      chart.setOption(this.options);
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
    calSymbolSize(value, params) {
      var n = params.name;
      return Math.pow(
        402 + (1635 * (n - this.minP)) / (this.maxP - this.minP),
        0.71
      );
    },
    focusActor(msg) {
      if (msg.source != "PlayerAvatarChart") {
        var character = msg.character;
        if (typeof character != "string") {
          //对于多选情况，暂时不理睬
          return;
        }
        var index = this.players.findIndex(t => t.character == msg.character);
        if (index != -1) {
          chart.dispatchAction({
            type: "highlight",
            seriesIndex: 0,
            dataIndex: index
          });
        } else {
          chart.dispatchAction({
            type: "downplay",
            seriesIndex: 0
          });
        }
      }
    },
    loadComplete: function() {
      this.$emit("loaded");
    },
    resize() {
      chart.resize();
    }
  },
  beforeDestroy() {
    chart.isDisposed() || chart.dispose();
  }
};
</script>