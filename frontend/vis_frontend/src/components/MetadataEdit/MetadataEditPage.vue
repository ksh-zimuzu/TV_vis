<template>
  <div class="container">
    <div id="episode_select">
      <v-window
        class="pa-1 episode_upper"
        v-model="onboarding"
        :reverse="windowReverse"
      >
        <v-window-item
          class="episode_editing"
          v-for="(ep, index) in episodes"
          :key="ep.id"
          :value="ep.id"
        >
          <div class="plot_input">
            <v-card height="100%">
              <v-card-title>
                第{{ ep.ep }}集剧情
                <v-spacer></v-spacer>
                <v-menu bottom left>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn color="black" icon v-bind="attrs" v-on="on">
                      <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item>
                      <v-list-item-title>从文件导入</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="episodes.splice(index, 1)">
                      <v-list-item-title
                        >删除本集</v-list-item-title
                      ></v-list-item
                    >
                  </v-list>
                </v-menu>
              </v-card-title>
              <v-divider class="mx-4"></v-divider>

              <v-card-text style="height: calc(100% - 64px)">
                <v-textarea
                  :value="ep.plot"
                  @input="changePlot(index, $event)"
                  ref="textarea"
                  height="100%"
                  no-resize
                  filled
                >
                </v-textarea>
              </v-card-text>
            </v-card>
          </div>
          <plot-analysis
            class="plot-analysis"
            :plot="ep.plot"
            :roleDict="roleDict"
          ></plot-analysis>
        </v-window-item>
      </v-window>
      <v-card class="episode_switch">
        <v-card-actions class="justify-space-between">
          <v-btn text @click="prev" :disabled="onboarding == episodes[0].id">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <div style="display: flex">
            <v-item-group v-model="onboarding" class="text-center" mandatory>
              <draggable v-model="episodes" @end="reorderEp">
                <v-slide-y-reverse-transition group>
                  <v-item
                    v-for="(ep, index) in episodes"
                    :key="ep.id"
                    v-slot="{ active, toggle }"
                    :value="ep.id"
                  >
                    <v-btn
                      :input-value="active"
                      icon
                      @click="calIsReverse(ep, index, toggle)"
                    >
                      <v-avatar color="#757575" size="20" dark
                        ><span class="white--text text-caption">{{
                          ep.ep
                        }}</span></v-avatar
                      >
                    </v-btn>
                  </v-item>
                </v-slide-y-reverse-transition>
              </draggable>
            </v-item-group>
            <v-btn icon @click="addEp">
              <v-icon>mdi-plus-circle</v-icon>
            </v-btn>
          </div>
          <v-btn
            text
            @click="next"
            :disabled="onboarding == episodes[ep_num - 1].id"
          >
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </div>
    <div class="alias-manager">
      <alias-manager
        :roles="roles"
        @input="$emit('update:roles', $event)"
        class="my-2"
        style="height: 90%"
      ></alias-manager>
      <v-btn block color="green" depressed dark @click="$emit('uploadData')"
        >提交！</v-btn
      >
    </div>
  </div>
</template>

<script>
import AliasManager from "./AliasManager";
import PlotAnalysis from "./PlotAnalysis";
import draggable from "vuedraggable";
import Episode from "./model/episode";

import { roleArray2dict } from "@/utils/dataFormatter";

import _ from "lodash";

export default {
  props: {
    episodes_prop: {
      type: Array,
      required: false,
      default: () => new Array(),
    },
    roles: {
      type: Array,
      require: false,
      default: () => new Object(),
    },
  },
  created: function () {
    this.episodes = this.episodes_prop.map((item) =>
      _.extend(new Episode(), item)
    );
  },
  data: () => ({
    showTextMenu: false,
    x: null,
    y: null,
    episodes: [new Episode()],
    onboarding: null,
    windowReverse: false,
  }),
  components: {
    AliasManager,
    PlotAnalysis,
    draggable,
  },
  computed: {
    ep_num: function () {
      return this.episodes.length;
    },
    roleDict: function () {
      return roleArray2dict(this.roles);
    },
  },
  methods: {
    prev() {
      const currentIndex = this.episodes.findIndex(
        (item) => item.id == this.onboarding,
        this
      );
      const prevIndex = Math.max(currentIndex - 1, 0);
      this.onboarding = this.episodes[prevIndex].id;
    },
    next() {
      const currentIndex = this.episodes.findIndex(
        (item) => item.id == this.onboarding,
        this
      );
      const nextIndex = Math.min(currentIndex + 1, this.episodes.length - 1);
      this.onboarding = this.episodes[nextIndex].id;
    },
    addEp() {
      const ep_num = this.episodes[this.ep_num - 1].ep + 1;
      this.episodes.push(new Episode(ep_num));
    },
    reorderEp(change) {
      const { newIndex, oldIndex } = change;
      const direction = newIndex - oldIndex;
      //如果大于0，则移到了更大了的地方
      if (direction > 0) {
        const new_ep_num = this.episodes[newIndex - 1].ep;
        this.episodes[newIndex].ep = new_ep_num;
        for (let i = oldIndex; i < newIndex; i++) {
          this.episodes[i].ep--;
        }
      } else if (direction < 0) {
        const new_ep_num =
          newIndex == 0 ? 1 : this.episodes[newIndex - 1].ep + 1;
        this.episodes[newIndex].ep = new_ep_num;
        for (let i = newIndex + 1; i <= oldIndex; i++) {
          this.episodes[i].ep++;
        }
      }
    },
    calIsReverse(select_episode, select_index, toggleFunc) {
      const current_index = this.episodes.findIndex(
        (item) => item.id === this.onboarding
      );
      const current_episode = this.episodes[current_index];
      this.windowReverse = Boolean(
        (current_index > select_index) ^
          (current_episode.order > select_episode.order)
      );
      toggleFunc();
    },
    changePlot(index, plot) {
      let episode = this.episodes[index];
      episode.plot = plot;
      this.$set(this.episodes, index, episode);
    },
  },
  watch: {
    episodes_prop: function (val) {
      this.episodes = _.extend(val);
    },
    episodes: function (val) {
      this.$emit("update:episodes_prop", val);
    },
  },
};
</script>

<style scoped>
.container {
  display: grid;
  grid-template-columns: 300px repeat(2, 1fr);
  grid-gap: 10px;
  grid-auto-rows: 40vh;
}

#episode_select {
  grid-row: 1/3;
  grid-column: 2/4;
  display: grid;
  grid-template-rows: 72vh 1fr;
  grid-template-columns: 1fr;
  grid-gap: 10px;
  height: 100%;
}

.episode_upper {
  grid-row: 1;
}

/* 保证页数切换控件刚好占满card */
.episode_switch {
  height: fit-content;
  grid-row: 2;
}

.episode_editing {
  height: 100%;
  display: grid;
  grid-auto-rows: 1fr 1fr;
  grid-template-columns: 1fr;
  grid-gap: 10px;
}

#plot_input {
  grid-column: 1;
  grid-row: 1;
  height: 100%;
}
.alias-manager {
  grid-row: 1/3;
  grid-column: 1;
}
.plot-analysis {
  grid-column: 1;
  grid-row: 2;
}

/* 以下用来保证textarea撑满容器 */

.plot_input .v-textarea {
  height: 100%;
}
>>> .v-window__container {
  height: 100%;
}
.plot_input .v-textarea >>> .v-input__control {
  height: 100%;
}
.plot_input .v-textarea >>> .v-input__control > .v-input__slot {
  height: 100%;
}
.plot_input
  .v-textarea
  >>> .v-input__control
  > .v-input__slot
  > .v-text-field__control {
  height: 100%;
}
.plot_input >>> .v-text-field__slot {
  height: 100%;
}
</style>