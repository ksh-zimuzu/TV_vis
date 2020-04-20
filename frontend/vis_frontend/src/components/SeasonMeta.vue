<template>
  <div class="season-meta">
    <v-list no-action>
      <EpisodeMeta
        v-for="episode in episodes"
        :episode="episode"
        :season="season"
        :tv_id="tv_id"
        :key="episode"
      />
    </v-list>
  </div>
</template>
<script>
import EpisodeMeta from "./EpisodeMeta";
export default {
  components: {
    EpisodeMeta
  },
  data: () => ({}),
  props: {
    tv_id: {
      required: true,
      type: String
    },
    season: {
      required: false,
      default: 1,
      type: Number
    },
    episodes: {
      required: false,
      type: Array,
      default: () => [1]
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