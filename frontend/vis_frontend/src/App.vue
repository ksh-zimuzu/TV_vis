<template>
  <div id="app">
    <GridLayout :layout="layout" :col-num="12">
      <GridItem
        :i="layout[0].i"
        :x="layout[0].x"
        :y="layout[0].y"
        :w="layout[0].w"
        :h="layout[0].h"
        :is-resizable="true"
        :min-w="4"
      >
        <PlayerChartBox />
      </GridItem>
      <GridItem
        :i="layout[1].i"
        :x="layout[1].x"
        :y="layout[1].y"
        :w="layout[1].w"
        :h="layout[1].h"
        :is-resizable="true"
        :min-w="4"
      >
        <ActorPlot :boxlayout="layout[1]" />
      </GridItem>
      <GridItem
        :i="layout[2].i"
        :x="layout[2].x"
        :y="layout[2].y"
        :w="layout[2].w"
        :h="layout[2].h"
        :is-resizable="true"
        :min-w="4"
      >
        <PlayerAvatarBox />
      </GridItem>
    </GridLayout>
  </div>
</template>

<script>
import PlayerChartBox from "./components/PlayerChartBox";
import VueGridLayout from "vue-grid-layout";
import ActorPlot from "./components/ActorPlot";
import PlayerAvatarBox from "./components/PlayerAvatarBox";

export default {
  name: "App",
  components: {
    PlayerChartBox,
    ActorPlot,
    PlayerAvatarBox,
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem
  },
  data: function() {
    return {
      layout: [
        { x: 0, y: 0, w: 6, h: 4, i: "0" },
        { x: 6, y: 0, w: 6, h: 2, i: "1" },
        { x: 6, y: 2, w: 6, h: 2, i: "2" }
      ]
    };
  },
  methods: {}
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
