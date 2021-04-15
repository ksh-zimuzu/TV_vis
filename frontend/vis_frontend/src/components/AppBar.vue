<template>
  <v-app-bar dark color="teal" app>
    <v-btn icon v-if="show_back" @click="$router.go(-1)">
      <v-icon>mdi-arrow-left</v-icon>
    </v-btn>
    <v-toolbar-title>{{ title }}</v-toolbar-title>
    <v-autocomplete
      v-model="select"
      :loading="loading"
      :items="items"
      :search-input.sync="search"
      cache-items
      class="mx-4"
      flat
      hide-no-data
      hide-details
      label="搜索剧集"
      solo-inverted
    ></v-autocomplete>
    <v-btn icon :disabled="select == null" @click="jumpTo">
      <v-icon>mdi-magnify</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script>
import index from "../services/search";

export default {
  data() {
    return {
      loading: false,
      items: [],
      search: null,
      select: null,
    };
  },
  watch: {
    search(val) {
      val && val !== this.select && this.querySelections(val);
    },
    select() {
      console.log(this.select);
    },
  },
  methods: {
    querySelections(v) {
      this.loading = true;
      // Simulated ajax query

      index.search(v).then((hits) => {
        console.log(hits);
        this.items = hits.hits.map((t) => t.name);
        this.loading = false;
      });
    },
    jumpTo() {
      this.$router.push(`/tv/${this.select}`);
    },
  },
  props: {},
  computed: {
    title: function () {
      var title = this.$route.name;
      var sub = "";
      if (title == "剧集详情") {
        sub = this.$route.path.split("/")[2];
      } else if (title == "演员详情") {
        sub = this.$route.query.name;
      }

      return sub ? `${title} | ${sub}` : title;
    },
    show_back: function () {
      return this.$route.path.split("/").length > 2;
    },
  },
};
</script>