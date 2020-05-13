<template>
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
        <NetworkChartBox v-bind:actorName="actor_id" :networkData="network_data"/>
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
        <PlayerChartBox v-bind:actorid="actor_id" />
      </GridItem>
    </GridLayout>
</template>

<script>
import NetworkChartBox from "./NetworkChartBox"
import single_actor from "../services/single_actor"
import PlayerChartBox from "./PlayerChartBox"
export default {
  name: "SingleActorPage",
  components: {
    NetworkChartBox,
    PlayerChartBox
  },

  data: function() {
    return {
        network_data:[],
        actor_id: String,
        layout: [
            { x: 5, y: 0, w: 7, h: 4, i: "网络图" },
            { x: 0, y: 0, w: 5, h: 4, i: "演员生涯图" },
        ],
    };
  },
  prop: {

  },
  mounted:function(){
    console.log("singleactorpage");
    var routerid = this.$route.query.id;
    this.actor_id = routerid;
    console.log(this.actor_id);
    var load_data=single_actor.fetch_actor_network_data();
    load_data.then(value=> {
        this.network_data=value.data;
    });

    //console.log(this.network_data);
  },
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
