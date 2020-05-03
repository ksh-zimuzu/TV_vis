<template>
  <v-app id="app">
    <router-view />
    <p>
      导航:
      <router-link to="/">首页</router-link>
      <router-link to="/index">主页</router-link>
      <router-link to="/test">地图测试</router-link>
    </p>
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
        <ActorPlot :boxlayout="layout[1]" :actorplots="plot[0]" :actor_name="actorname" />
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
      <GridItem
        :i="layout[3].i"
        :x="layout[3].x"
        :y="layout[3].y"
        :w="layout[3].w"
        :h="layout[3].h"
        :is-resizable="true"
        :min-w="2"
      >
        <SeasonMeta tv_id="63247" :season="3" :episodes="[1,2,3,4,5]" />
      </GridItem>
      <GridItem
        :i="layout[4].i"
        :x="layout[4].x"
        :y="layout[4].y"
        :w="layout[4].w"
        :h="layout[4].h"
        :is-resizable="true"
        :min-w="4"
      >
        <MainChartBox />
      </GridItem>
      <GridItem
        :i="layout[5].i"
        :x="layout[5].x"
        :y="layout[5].y"
        :w="layout[5].w"
        :h="layout[5].h"
        :is-resizable="true"
        :min-w="4"
      >
        <WorldCloudBox />
      </GridItem>
    </GridLayout>
  </v-app>
</template>

<script>
import PlayerChartBox from "./PlayerChartBox";
import VueGridLayout from "vue-grid-layout";
import ActorPlot from "./ActorPlot";
import PlayerAvatarBox from "./PlayerAvatarBox";
import SeasonMeta from "./SeasonMeta";
import MainChartBox from "./MainChartBox";
import WorldCloudBox from "./WorldCloudBox";
import worldMap from "./worldMap";

export default {
  name: "MainInterface",
  components: {
    PlayerChartBox,
    ActorPlot,
    PlayerAvatarBox,
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem,
    SeasonMeta,
    MainChartBox,
    WorldCloudBox,
    worldMap
  },
  data: function() {
    return {
      layout: [
        { x: 0, y: 0, w: 6, h: 4, i: "0" },
        { x: 6, y: 0, w: 4, h: 4, i: "1" },
        { x: 0, y: 2, w: 6, h: 2, i: "2" },
        { x: 10, y: 2, w: 2, h: 2, i: "3" },
        { x: 6, y: 4, w: 8, h: 6, i: "4" },
        { x: 0, y: 6, w: 4, h: 2, i: "5" }
      ],
      plot: [
        {
          name: "1",
          content:
            "晚上，聂怀桑揣着花生米来找魏无羡，江澄也在魏无羡这里凑热闹喝酒。三个人正在打闹时候，蓝湛忽然来到，见三个人喝酒要将他们带去领罚，结果三个人都装醉不肯去。在魏无羡的掩护下江澄和聂怀桑慌忙逃走了。魏无羡趁蓝湛不防备，给他贴上了一个符咒，让蓝湛受他控制陪着喝酒。蓝湛不胜酒力一杯酒就倒了，魏无羡只好把他扶上床，看到他抹额歪了，蓝湛好意要给他扶正，蓝湛却躲开了，并且醉意朦胧告诉魏无羡抹额很重要，除非父母妻子不可以碰触，魏无羡忍不住大笑，认为蓝家为人古板，且戒律很多，没有女孩愿意嫁给蓝家做妻子，蓝家的人也必定要打光棍，蓝湛反而认为那样很好。次日，蓝涣和叔父谈论水祟的事情，并且告诉叔父魏无羡说过水祟和摄灵有必然的联系，这让叔父大为吃惊关心询问魏无羡的父母，一听说魏无羡母亲是藏色散人，叔父立刻神色大变，认为魏无羡调皮捣蛋倒是和他母亲如出一辙。此时，有人传报魏无羡聚众喝酒被抓住，蓝涣忍不住笑了，倒是意料之中的事情，可随后听闻还有蓝湛倒是让蓝涣吃惊不小。魏无羡本想独立承担罪责，领受惩罚，为蓝湛辩护，可蓝湛却甘愿被罚，结果三人都被打了三百下"
        }
      ],
      actorname: [
        {
          name: "cql1",
          content: "魏无羡",
          src: require("../assets/images/xiaozhan.jpg"),
          show: true
        },
        {
          name: "cql2",
          content: "蓝湛",
          src: require("../assets/images/wangyibo.jpg"),
          show: true
        }
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
