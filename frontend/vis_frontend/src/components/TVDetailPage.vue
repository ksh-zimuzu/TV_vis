<template>
  <GridLayout :layout="layout" :col-num="12">
    <GridItem :i="layout[4].i" :x="layout[4].x" :y="layout[4].y" :w="layout[4].w" :h="layout[4].h">
      <smart-widget title="占位"></smart-widget>
    </GridItem>
    <GridItem :i="layout[0].i" :x="layout[0].x" :y="layout[0].y" :w="layout[0].w" :h="layout[0].h">
      <SeasonMeta :tv_id="meta.tv_id" :season="meta.season" :episodes="meta.episodes" />
    </GridItem>
    <GridItem :i="layout[1].i" :x="layout[1].x" :y="layout[1].y" :w="layout[1].w" :h="layout[1].h">
      <PlayerAvatarBox :players="slicedActors" />
    </GridItem>
    <GridItem :i="layout[2].i" :x="layout[2].x" :y="layout[2].y" :w="layout[2].w" :h="layout[2].h">
      <WorldCloudBox :word_freq="word_freq" />
    </GridItem>
    <GridItem :i="layout[3].i" :x="layout[3].x" :y="layout[3].y" :w="layout[3].w" :h="layout[3].h">
      <MainChartBox :EpisodeData="Math.max(...meta.episodes)" :SankeyData="FPs" />
    </GridItem>
  </GridLayout>
</template>

<script>
import VueGridLayout from "vue-grid-layout";
import _ from "lodash";
/*
import ActorPlot from "./ActorPlot"; //剧情
*/
import SeasonMeta from "./SeasonMeta"; //剧集元信息
import PlayerAvatarBox from "./PlayerAvatarBox"; //气泡
import WorldCloudBox from "./WorldCloudBox"; //词云
import TV_loader from "../services/TV_loader";
import MainChartBox from "./MainChartBox"; //主视图

export default {
  name: "TVDetailPage",
  props: {
    tv_name: {
      required: true,
      type: String
    }
  },
  components: {
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem,
    /*
    ActorPlot,
    
    MainChartBox,
    */
    MainChartBox,
    WorldCloudBox,
    PlayerAvatarBox,
    SeasonMeta
  },
  data: () => ({
    meta: {
      season: 1,
      episodes: [0],
      id: 0
    },
    plot: undefined,
    CPs: undefined,
    FPs: {},
    word_freq: undefined,
    layout: [
      { x: 0, y: 2, w: 2, h: 2, i: "3" },
      { x: 2, y: 2, w: 7, h: 2, i: "2" },
      { x: 9, y: 0, w: 3, h: 3, i: "4" },
      { x: 2, y: 0, w: 7, h: 3, i: "1" },
      { x: 0, y: 0, w: 2, h: 3, i: "0" }
    ],
    actors: []
  }),
  mounted: function() {
    var load_data = TV_loader.fetch_all(this.tv_name);
    load_data.meta.then(res => {
      this.meta = res.data;
    });
    load_data.FPs.then(fps =>
      fps.map(t => {
        t.p.then(res => {
          this.$set(this.FPs, t.episode, res.data);
        });
      })
    );
    load_data.word_freq.then(res => {
      this.word_freq = res.data;
    });
    load_data.actors.then(res => {
      this.actors = res.data;
    });
    this.$EventBus.$on("episode-focus", this.focus);
  },
  computed: {
    slicedActors: function() {
      return _.slice(this.actors, 0, 5);
    }
  },
  methods: {
    focus: function(msg) {
      console.log("focus", msg);
    }
  }
};
</script>