<template>
  <v-app-bar dark color="teal" app>
    <v-btn icon v-if="show_back" @click="$router.go(-1)">
      <v-icon>mdi-arrow-left</v-icon>
    </v-btn>
    <v-toolbar-title
      >{{ title
      }}<span v-if="subtitle.length > 0"
        >&nbsp;|&nbsp;{{ subtitle }}</span
      ></v-toolbar-title
    >
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
      @keydown.enter="jumpTo"
    ></v-autocomplete>
    <v-btn icon :disabled="select == null" @click="jumpTo">
      <v-icon>mdi-magnify</v-icon>
    </v-btn>
    <v-menu bottom rounded min-width="200px">
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on">
          <v-avatar size="36">
            <v-img
              v-if="user.avatar_url.length > 0"
              :src="user.avatar_url"
            ></v-img>
            <v-icon v-else-if="user.role == 'tourist'">mdi-account</v-icon>
            <span v-else>{{ user.login }}</span>
          </v-avatar>
        </v-btn>
      </template>
      <v-card>
        <v-list-item-content class="justify-center">
          <div class="mx-auto text-center">
            <v-avatar color="white">
              <v-img
                v-if="user.avatar_url.length > 0"
                :src="user.avatar_url"
              ></v-img>
              <v-icon v-else-if="user.role == 'tourist'">{{
                mdiGithub
              }}</v-icon>
              <span v-else>{{ user.login }}</span>
            </v-avatar>
            <h3>{{ user.login }}</h3>
            <v-divider class="my-3"></v-divider>
            <div class="userMenu">
              <v-btn
                v-if="user.role == 'tourist'"
                depressed
                rounded
                text
                @click="github_login"
              >
                使用GitHub登陆
              </v-btn>
              <template v-else>
                <v-btn depressed rounded text @click="logout"> 注销登陆 </v-btn>
                <v-btn depressed rounded text @click="addTV">
                  录入新电视剧
                </v-btn>
              </template>
            </div>
          </div>
        </v-list-item-content>
      </v-card>
    </v-menu>
  </v-app-bar>
</template>

<script>
import index from "../services/search";
import { mapState } from "vuex";
import { mdiGithub } from "@mdi/js";
import githubLoginMixin from "../mixins/github-login";

export default {
  data() {
    return {
      loading: false,
      items: [],
      search: null,
      select: null,
      mdiGithub,
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

      index.search(v).then((hits) => {
        console.log(hits);
        this.items = hits.hits.map((t) => t.name);
        this.loading = false;
      });
    },
    jumpTo() {
      this.$router.push(`/tv/${this.select}`);
    },
    addTV() {
      this.$router.push("/add");
    },
  },
  props: {},
  computed: {
    show_back: function () {
      return this.$route.path.split("/").length > 2;
    },
    ...mapState(["title", "subtitle"]),
  },
  mixins: [githubLoginMixin],
};
</script>

<style scoped>
.userMenu {
  display: flex;
  flex-direction: column;
  margin: 0 20px;
}
</style>