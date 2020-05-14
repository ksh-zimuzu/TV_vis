<template>
  <v-app id="app">
    <GridLayout :layout="layout" :col-num="12">
      <GridItem
              :i="layout[0].i"
              :x="layout[0].x"
              :y="layout[0].y"
              :w="layout[0].w"
              :h="layout[0].h"
              :is-resizable="false"
              :min-w="4"
      >
        <mapBox />
      </GridItem>
      <GridItem
              :i="layout[1].i"
              :x="layout[1].x"
              :y="layout[1].y"
              :w="layout[1].w"
              :h="layout[1].h"
              :is-resizable="false"
              :min-w="4"
      >
        <lineBox />
      </GridItem>
      <GridItem
              :i="layout[2].i"
              :x="layout[2].x"
              :y="layout[2].y"
              :w="layout[2].w"
              :h="layout[2].h"
              :is-resizable="false"
              :min-w="4"
      >
        <mapButtons />
      </GridItem>
    </GridLayout>
  </v-app>
</template>

<script>
  import VueGridLayout from "vue-grid-layout";
  import mapBox from "./mapBox";
  import lineBox from "./lineBox"
  import mapButtons from "./mapButtons";

  export default {
    name: "MainInterface",
    components: {
      GridLayout: VueGridLayout.GridLayout,
      GridItem: VueGridLayout.GridItem,
      mapBox,
      lineBox,
      mapButtons
    },
    data: function() {
      return {
        layout: [
          { x: 3, y: 0, w: 7, h: 2, i: "世界剧集热度地图" },
          { x: 2, y: 1, w: 8, h: 2, i: "部分剧集热度折线图" },
          { x: 2, y: 0, w: 1, h: 2, i: "地图按钮" }
        ]
      };
    }
  };
</script>

<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }
</style>
