<template>
  <v-card style="width: 100%; height: 100%; overflow: auto">
    <v-card-title>人物分析</v-card-title>
    <v-card-subtitle>请将鼠标移动到句子上查看对应人物共现</v-card-subtitle>
    <v-divider></v-divider>
    <v-card-text>
      <template v-for="(s, i) in sentences">
        <sentence-box
          v-if="s != '\n'"
          :key="i"
          :sentence="s"
          :roleArray="roleArray"
        ></sentence-box>
        <br :key="i" v-else />
      </template>
    </v-card-text>
  </v-card>
</template>

<script>
import _ from "lodash";
import SentenceBox from "./SentenceBox.vue";

let SentenceBreak = /(.*?[。;；.……!！?？])/;

export default {
  props: {
    plot: {
      type: String,
      require: true,
    },
    roleDict: {
      type: Object,
      require: true,
    },
  },
  computed: {
    sentences: function () {
      return this.plot.split(SentenceBreak).filter((s) => s.length > 0);
    },
    roleArray: function () {
      return _.toPairs(this.roleDict);
    },
  },
  components: {
    SentenceBox,
  },
};
</script>