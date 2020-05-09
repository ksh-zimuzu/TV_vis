<template>
  <GridLayout
    :layout="layout"
    :col-num="12"
    @layout-updated="saveLayout"
    style="margin-bottom:50px"
  >
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
      <WordCloudBox :plot="plot" :userDict="userDict" />
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
    <GridItem :i="layout[6].i" :x="layout[6].x" :y="layout[6].y" :w="layout[6].w" :h="layout[6].h">
      <RatingBox :ratings="ratings" />
    </GridItem>
    <GridItem
      :i="layout[7].i"
      :x="layout[7].x"
      :y="layout[7].y"
      :w="layout[7].w"
      :h="layout[7].h"
      :is-resizable="false"
    >
      <smart-widget simple>
        <v-btn fab color="error" x-large @click="resetLayout">
          <v-icon>{{mdiRefresh}}</v-icon>
        </v-btn>
        <div class="subtitle-1 text-center pt-3">重置布局</div>
      </smart-widget>
    </GridItem>
  </GridLayout>
</template>

<script>
import VueGridLayout from "vue-grid-layout";
import _ from "lodash";

import ActorPlot from "./ActorPlot"; //剧情
import SeasonMeta from "./SeasonMeta"; //剧集元信息
import PlayerAvatarBox from "./PlayerAvatarBox"; //气泡
import WordCloudBox from "./WordCloudBox"; //词云
import MainChartBox from "./MainChartBox"; //主视图
import SimilarTVBox from "./SimilarTVBox"; //柱状图
import RatingBox from "./RatingBox";

import TV_loader from "../services/TV_loader";

import { mdiRefresh } from "@mdi/js";

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
    WordCloudBox,
    PlayerAvatarBox,
    SimilarTVBox,
    SeasonMeta,
    RatingBox
  },
  data: () => ({
    meta: {
      season: 1,
      episodes: [0],
      id: 0
    },
    plots: {},
    CPs: {},
    FPs: {},
    word_freq: undefined,
    layout: undefined,
    actors: [],
    roles: undefined,
    plot: undefined,
    heighlightAt: "",
    ratings: {},
    defaultLayout: [
      { x: 0, y: 0, w: 2, h: 3, i: "元数据" },
      { x: 2, y: 2, w: 7, h: 2, i: "气泡图" },
      { x: 9, y: 0, w: 3, h: 3, i: "词云图" },
      { x: 2, y: 0, w: 7, h: 3, i: "主视图" },
      { x: 9, y: 3, w: 3, h: 2, i: "演员高亮" },
      { x: 0, y: 3, w: 2, h: 2, i: "柱状图" },
      { x: 0, y: 5, w: 2, h: 1, i: "评价玉珏图" },
      { x: 3, y: 5, w: 1, h: 1, i: "重置按钮" }
    ],
    mdiRefresh
  }),
  created: function() {
    var layout = localStorage.getItem("layout");
    if (layout != null) {
      layout = JSON.parse(layout);
      if (layout.length != this.defaultLayout.length) {
        //布局需要更新
        this.resetLayout();
      } else {
        this.layout = layout;
      }
    } else {
      this.layout = this.defaultLayout;
    }
  },
  mounted: function() {
    var load_data = TV_loader.fetch_all(this.tv_name);
    load_data.meta.then(res => {
      this.meta = res.data;
    });
    load_data.plots.then(plots =>
      Promise.all(
        plots.map(t =>
          t.p.then(res => {
            this.$set(this.plots, t.episode, res.data);
          })
        )
      ).then(() => {
        this.plot = this.plots[1];
      })
    );
    load_data.FPs.then(fps =>
      fps.map(t => t.p.then(res => this.$set(this.FPs, t.episode, res.data)))
    );
    /*
    load_data.CPs.then(cps =>
      cps.map(t => t.p.then(res => this.$set(this.CPs, t.episode, res.data)))
    );
    
    load_data.word_freq.then(res => {
      this.word_freq = res.data;
    });
    */
    load_data.roles.then(res => {
      this.roles = res.data;
    });

    load_data.actors.then(res => {
      this.actors = res.data;
    });

    load_data.ratings.then(res => {
      this.$set(this.ratings, "imDb", res.data.imDb ? res.data.imDb * 10 : 0);
      this.$set(
        this.ratings,
        "metacritic",
        res.data.metacritic ? res.data.metacritic : 0
      );
      this.$set(
        this.ratings,
        "theMovieDb",
        res.data.theMovieDb ? res.data.theMovieDb * 10 : 0
      );
      this.$set(
        this.ratings,
        "rottenTomatoes",
        res.data.rottenTomatoes ? res.data.rottenTomatoes : 0
      );
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
    },
    roleNames: function() {
      return _.keys(this.roles)
        .map(t => t.trim())
        .concat(_.flatten(_.values(this.roles)).map(t => t.trim()));
    },
    userDict: function() {
      return this.roleNames.map(t => [t, 999999, "nr"]);
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
    },
    saveLayout: function() {
      localStorage.setItem("layout", JSON.stringify(this.layout));
    },
    resetLayout: function() {
      this.layout = this.defaultLayout;
      localStorage.removeItem("layout");
    }
  },
  watch: {}
};
</script>