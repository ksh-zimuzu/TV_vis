<template>
  <GridLayout :layout.sync="layout" :col-num="12" responsive>
    <GridItem
      :i="layout[0].i"
      :x="layout[0].x"
      :y="layout[0].y"
      :w="layout[0].w"
      :h="layout[0].h"
      :is-resizable="true"
      :min-w="4"
      dragAllowFrom=".widget-header"
    >
      <NetworkChartBox
        :actorid="actor_id"
        :networkdata="network_data"
        :networkloading="network_loading"
      />
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
import NetworkChartBox from "./NetworkChartBox";
import single_actor from "../services/single_actor";
import PlayerChartBox from "./PlayerChartBox";
export default {
  name: "SingleActorPage",
  metaInfo: {
    title: "演员详情"
  },
  components: {
    NetworkChartBox,
    PlayerChartBox
  },
  methods: {
    refresh_data: function() {
      //console.log("---singleActorPage---");
      //var routerid = this.$route.query.id;
      //this.actor_id = routerid;
      var load_data = single_actor.fetch_actor_network_data();
      this.network_loading = true;
      load_data
        .then(value => {
          this.network_data = value.data;
        })
        .then(() => {
          this.network_loading = false;
          //console.log(this.network_loading);
        });
    }
  },
  data: function() {
    return {
      network_loading: true,
      network_data: [],
      //actor_id: "",
      layout: [
        { x: 5, y: 0, w: 7, h: 4, i: "演员合作网络" },
        { x: 0, y: 0, w: 5, h: 4, i: "演员个人生涯" }
      ]
    };
  },
  created: function() {
    this.refresh_data();
  },
  activated: function() {
    this.refresh_data();
  },
  props: {
    actor_id: {
      type: String,
      required: true
    }
  }
};
</script>

<style>
</style>
