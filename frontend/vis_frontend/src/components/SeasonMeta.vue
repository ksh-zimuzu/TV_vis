<template>
  <div class="season-meta">
    <v-list no-action>
      <v-list-item-group @change="change" v-model="model" ref="epList">
        <EpisodeMeta
          v-for="(record,index) in zippedEp"
          :episode="record[0]"
          :season="season"
          :tv_id="tv_id"
          :active="record[1]"
          :key="record[0]"
          :id="'i'+index"
        />
      </v-list-item-group>
    </v-list>
  </div>
</template>
<script>
import EpisodeMeta from "./EpisodeMeta";
import _ from "lodash";
import goTo from "vuetify/es5/services/goto";

export default {
  components: {
    EpisodeMeta
  },
  data: () => ({
    model: 0,
    active: []
  }),
  props: {
    tv_id: {
      required: true,
      type: [String, Number]
    },
    season: {
      required: false,
      default: 1,
      type: [String, Number]
    },
    episodes: {
      required: false,
      type: Array,
      default: () => [1]
    }
  },
  methods: {
    change(msg) {
      if (msg >= this.episodes.length) {
        return;
      }
      msg = msg >= 0 ? msg : -1;
      this.$EventBus.$emit("episode-focus", {
        focusIndex: msg
      });
    },
    onChange(msg) {
      console.log("change!", msg, this.model);
      if (msg.focusIndex != this.model) {
        if (this.model >= 0) {
          this.active[this.model] = false;
        }

        this.model = msg.focusIndex;
        //用一秒的延迟来保证dom事件完成更新，保证滚动定位准确
        setTimeout(() => {
          goTo(`#i${msg.focusIndex}`, {
            container: this.$el
          });
        }, 1000);
        //this.active[this.model] = true;
        console.log(this.$refs.epList.$children[this.model]);
      }
    }
  },
  created() {
    this.$EventBus.$on("episode-focus", this.onChange);
  },
  computed: {
    zippedEp() {
      return _.zip(this.episodes, this.active);
    }
  },
  watch: {
    episodes: function() {
      if (this.active.length != this.episodes.length) {
        var l = this.episodes.length;
        this.active = new Array(l);
        this.active.fill(false);
      }
    }
  }
};
</script>

<style scoped>
.season-meta {
  overflow-y: auto;
  height: inherit;
  background-color: white;
  border: 1px solid #ebeef5;
  box-shadow: 0 0 10px 0 #e9e9e9;
}
</style>