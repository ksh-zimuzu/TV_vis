<template>
  <GridLayout :layout="layout" :col-num="12">
    <GridItem :i="layout[4].i" :x="layout[4].x" :y="layout[4].y" :w="layout[4].w" :h="layout[4].h">
      <ActorPlot :plot="plot" :highlightRole="heighlightAt" />
    </GridItem>
    <GridItem :i="layout[0].i" :x="layout[0].x" :y="layout[0].y" :w="layout[0].w" :h="layout[0].h">
      <SeasonMeta :tv_id="meta.tv_id" :season="meta.season" :episodes="meta.episodes" />
    </GridItem>
    <GridItem :i="layout[1].i" :x="layout[1].x" :y="layout[1].y" :w="layout[1].w" :h="layout[1].h">
      <PlayerAvatarBox :players="slicedActors" />
    </GridItem>
    <GridItem :i="layout[2].i" :x="layout[2].x" :y="layout[2].y" :w="layout[2].w" :h="layout[2].h">
      <WorldCloudBox :plot="plot" />
    </GridItem>
    <GridItem
      :i="layout[3].i"
      :x="layout[3].x"
      :y="layout[3].y"
      :w="layout[3].w"
      :h="layout[3].h"
      dragAllowFrom=".widget-header"
    >
      <MainChartBox :EpisodeData="Math.max(...meta.episodes)" :SankeyData="FPs" />
    </GridItem>
    <GridItem :i="layout[5].i" :x="layout[5].x" :y="layout[5].y" :w="layout[5].w" :h="layout[5].h">
      <SimilarTVBox :current_tv_id="meta.tv_id" />
    </GridItem>
  </GridLayout>
</template>

<script>
import VueGridLayout from "vue-grid-layout";
import _ from "lodash";

import ActorPlot from "./ActorPlot"; //剧情
import SeasonMeta from "./SeasonMeta"; //剧集元信息
import PlayerAvatarBox from "./PlayerAvatarBox"; //气泡
import WorldCloudBox from "./WorldCloudBox"; //词云
import MainChartBox from "./MainChartBox"; //主视图
import SimilarTVBox from "./SimilarTVBox"; //柱状图

import TV_loader from "../services/TV_loader";

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
    ActorPlot,
    MainChartBox,
    WorldCloudBox,
    PlayerAvatarBox,
    SimilarTVBox,
    SeasonMeta
  },
  data: () => ({
    meta: {
      season: 1,
      episodes: [0],
      id: 0
    },
    plots: {},
    CPs: undefined,
    FPs: {},
    word_freq: undefined,
    layout: [
      { x: 0, y: 0, w: 2, h: 3, i: "元数据" },
      { x: 2, y: 2, w: 7, h: 2, i: "气泡图" },
      { x: 9, y: 0, w: 3, h: 3, i: "词云图" },
      { x: 2, y: 0, w: 7, h: 3, i: "主视图" },
      { x: 9, y: 3, w: 3, h: 2, i: "演员高亮" },
      { x: 0, y: 3, w: 2, h: 2, i: "柱状图" }
    ],
    actors: [],
    plot: undefined,
    heighlightAt: -1
  }),
  mounted: function() {
    var load_data = TV_loader.fetch_all(this.tv_name);
    load_data.meta.then(res => {
      this.meta = res.data;
    });
    load_data.FPs.then(fps =>
      Promise.all(
        fps.map(t =>
          t.p.then(res => {
            this.$set(this.FPs, t.episode, res.data);
          })
        )
      ).then(() => {
        this.plot = this.plots[1];
      })
    );
    load_data.plots.then(plots =>
      plots.map(t =>
        t.p.then(res => this.$set(this.plots, t.episode, res.data))
      )
    );
    load_data.word_freq.then(res => {
      this.word_freq = res.data;
    });
    load_data.actors.then(res => {
      this.actors = res.data;
    });
    this.$EventBus.$on("episode-focus", this.focus);
    this.$EventBus.$on("actor-focus", this.hover);
  },
  computed: {
    slicedActors: function() {
      return _.slice(this.actors, 0, 5);
    },
    heighlightActors: function() {
      return this.actors.map(actor => ({
        name: actor.name,
        content: actor.character,
        show: actor.character == this.heighlightAt
      }));
    }
  },
  methods: {
    focus: function(msg) {
      this.plot = this.plots[msg.focusIndex + 1];
      if (msg.focusIndex >= 0) {
        this.$EventBus.$emit("snackbar", `你选择了第${msg.focusIndex + 1}集`);
      }
    },
    hover: function(msg) {
      this.heighlightAt = msg.character;
    }
  }
};
</script>