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
        <PlayerChartBox :boxlayout="layout[0]"/>
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
        <ActorPlot :boxlayout="layout[1]"/>
      </GridItem>
    </GridLayout>
  </div>
</template>

<script>
import PlayerChartBox from "./components/PlayerChartBox";
import VueGridLayout from 'vue-grid-layout';
import ActorPlot from "./components/ActorPlot";

export default {
  name: "App",
  components: {
    PlayerChartBox,ActorPlot,
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem
  },
  data:function(){
    return {
      layout:[{ x: 0, y: 0, w: 6, h: 4, i: '0'},{ x: 6, y: 0, w: 6, h: 2, i: '1' }]
    }
  }
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
