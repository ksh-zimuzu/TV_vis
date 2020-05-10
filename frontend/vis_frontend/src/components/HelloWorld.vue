<template>
  <v-app id="app">
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
        <world-map v-on:getCountry="getCountryName" />
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
        <liner :countryName="countryName" />
      </GridItem>
    </GridLayout>
  </v-app>
</template>

<script>
  import VueGridLayout from "vue-grid-layout";
  import worldMap from "./worldMap";
  import Liner from "./Liner";

  export default {
    name: "MainInterface",
    components: {
      GridLayout: VueGridLayout.GridLayout,
      GridItem: VueGridLayout.GridItem,
      worldMap,
      Liner
    },
    data: function() {
      return {
        layout: [
          { x: 0, y: 0, w: 6, h: 4, i: "0" },
          { x: 6, y: 0, w: 2, h: 4, i: "1" },
        ],
        countryName: 'China'
      };
    },
    methods: {
      getCountryName: function (childValue) {
        this.countryName = childValue
        console.log(childValue + '0')
      }
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
