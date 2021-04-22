<template>
  <v-window v-model="step" class="addTVWindow">
    <v-window-item class="fill-height">
      <v-row align="center" class="fill-height">
        <v-col align-self="center">
          <v-card class="mx-auto" max-width="500">
            <v-card-title>首先，让我们确认您已登录</v-card-title>
            <v-divider></v-divider>
            <v-card-text class="d-flex justify-center">
              <v-row align="center">
                <v-col align-self="center" class="text-center">
                  <div>
                    <v-avatar size="80" class="mx-auto">
                      <v-img v-if="isLogin" :src="user.avatar_url"></v-img>
                      <v-icon v-else>{{ mdiGithub }}</v-icon>
                    </v-avatar>
                  </div>
                  <template v-if="isLogin">
                    <div class="text-h6">
                      {{ user.login }}
                    </div>
                    <div style="text-align: center" class="text-subtitle-1">
                      请确认您登陆的账号
                    </div>
                  </template>
                  <template v-else>
                    <v-btn @click="github_login" depressed rounded text
                      >使用GitHub登陆</v-btn
                    >
                  </template>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                depressed
                :disabled="user.role === 'tourist'"
                @click="step++"
              >
                下一步
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-window-item>
    <v-window-item class="fill-height">
      <v-row align="center" class="fill-height">
        <v-col align-self="center">
          <v-card class="mx-auto" max-width="500">
            <v-card-title> 接下来，请检索您想要添加的电视剧 </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <v-autocomplete
                v-model="tv_name"
                :search-input.sync="tv_query"
                :items="searchResults"
                :loading="queryLoading"
                item-text="name"
                item-value="id"
                item-disabled="alreadyInDB"
                hide-no-data
              >
                <template v-slot:item="data">
                  <v-list-item-avatar tile size="72">
                    <v-img contain :src="mid_url + data.item.poster_path">
                      <template v-slot:placeholder>
                        <v-row
                          class="fill-height ma-0"
                          align="center"
                          justify="center"
                        >
                          <v-icon>mdi-youtube-tv</v-icon>
                        </v-row>
                      </template>
                    </v-img>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title
                      v-html="data.item.name"
                    ></v-list-item-title>
                    <v-list-item-subtitle>{{
                      data.item.first_air_date
                    }}</v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-progress-circular
                      indeterminate
                      color="green"
                      v-if="data.item.alreadyInDB == 'loading'"
                    ></v-progress-circular>
                    <v-btn icon v-else-if="data.item.alreadyInDB">
                      <v-icon>mdi-information</v-icon>
                    </v-btn>
                  </v-list-item-action>
                  <v-list-item-action-text
                    v-if="data.item.alreadyInDB === true"
                  >
                    已存在
                  </v-list-item-action-text>
                </template>
              </v-autocomplete>
              <v-btn
                @click="loadDetails(tv_name)"
                color="primary"
                block
                :disabled="!(tv_name && tv_name > 0) || target_tv_show.loading"
                :loading="target_tv_show.loading"
                >{{ show_detail ? "收起" : "编辑元信息" }}</v-btn
              >
              <v-expand-transition>
                <v-form v-model="valid" v-show="show_detail">
                  <v-divider class="mt-4"></v-divider>
                  <v-row class="my-2">
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="target_tv_show.id"
                        readonly
                        disabled
                        label="id"
                        hide-details="auto"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="target_tv_show.name"
                        readonly
                        disabled
                        label="电视剧名"
                        hide-details="auto"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-select
                        v-model="season"
                        :items="season_choices"
                        label="季"
                        @change="set_season"
                        hide-details="auto"
                        item-text="name"
                        item-value="season_number"
                        :rules="[rules.required]"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="episode"
                        disabled
                        readonly
                        label="集数"
                        hide-details="auto"
                      >
                      </v-text-field>
                    </v-col>
                  </v-row>
                  <v-divider></v-divider>
                  <v-row class="my-2">
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="target_tv_show.ratings.imDb"
                        label="IMDB评分"
                        type="number"
                        step="0.1"
                        min="0"
                        max="10.0"
                        hide-details="auto"
                      >
                      </v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="target_tv_show.ratings.theMovieDb"
                        disabled
                        readonly
                        label="TMDB评分"
                        type="number"
                        step="0.1"
                        min="0"
                        max="10.0"
                        hide-details="auto"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="target_tv_show.ratings.metacritic"
                        label="metacritic评分"
                        type="number"
                        step="1.0"
                        min="0.0"
                        max="100.0"
                        hide-details="auto"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="target_tv_show.ratings.rottenTomatoes"
                        label="烂番茄评分"
                        type="number"
                        step="1.0"
                        min="0.0"
                        max="100.0"
                        hide-details="auto"
                      ></v-text-field
                    ></v-col>
                  </v-row> </v-form
              ></v-expand-transition>
              <v-card-actions>
                <v-btn text @click="step--">返回</v-btn>
                <v-spacer></v-spacer>
                <v-btn
                  color="primary"
                  depressed
                  @click="step++"
                  :disabled="!valid"
                  >下一步</v-btn
                >
              </v-card-actions>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-window-item>
    <v-window-item>
      <metadata-edit-page
        :episodes_prop.sync="target_tv_show.episodes"
        :roles.sync="target_tv_show.roles"
        @uploadData="uploadData"
      ></metadata-edit-page>
    </v-window-item>
  </v-window>
</template>

<script>
import githubLoginMixin from "../../mixins/github-login";
import loadApiCfgMixin from "../../mixins/load-api-config";
import { mdiGithub } from "@mdi/js";
import MetadataEditPage from "./MetadataEditPage";
import searchTV from "../../services/searchtv";
import tv_loader from "../../services/TV_loader";

import { TV_Show } from "./model/tv_show";
import {
  createTVShowRecord,
  NotLoginError,
  KeyError,
} from "@/services/db_request";
import _ from "lodash";
import Episode from "./model/episode";

export default {
  mixins: [githubLoginMixin, loadApiCfgMixin],
  data: () => ({
    step: 0,
    mdiGithub,
    tv_name: "",
    tv_query: "",
    searchResults: [],
    queryLoading: false,
    target_tv_show: new TV_Show(0), //Should be a TV_Show instance or null
    show_detail: false,
    season: null,
    rules: {
      required: (value) => !!value || "必填项",
    },
    valid: false,
  }),
  components: {
    MetadataEditPage,
  },
  watch: {
    tv_query: _.debounce(async function () {
      this.show_detail = false;
      this.target_tv_show.loading = true;
      if (this.tv_query == null || this.tv_query.length == 0) {
        this.target_tv_show.loading = false;
        return;
      }
      this.queryLoading = true;
      let searchRes = await searchTV.search(this.tv_query);
      searchRes.results = searchRes.results.slice(0, 5);
      searchRes.results.forEach((item) => (item.alreadyInDB = "loading"));
      searchRes.results.forEach(async function (item) {
        item.alreadyInDB = await tv_loader.exists(item.id);
      });
      this.searchResults = searchRes.results;
      this.queryLoading = false;
      this.target_tv_show.loading = false;
    }, 1000),
  },
  methods: {
    async loadDetails(id) {
      if (this.show_detail) {
        this.show_detail = false;
        console.log();
        return;
      }
      id = id || this.tv_name;
      let show = new TV_Show(id);
      this.target_tv_show = show;
      await show.fetch_info_by_id();
      this.show_detail = true;
    },
    set_season() {
      this.target_tv_show.set_season(this.season);
    },
    async uploadData() {
      try {
        await createTVShowRecord(this.access_token, this.target_tv_show);
        this.$EventBus.$emit("snackbar", "成功");
        this.$router.push("/");
      } catch (e) {
        if (e instanceof NotLoginError) {
          this.$EventBus.$emit("snackbar", "请登陆后再试!");
          setTimeout(this.github_login, 1000);
        } else if (e instanceof KeyError) {
          this.$EventBus.$emit("snackbar", "该电视已存在！");
        } else {
          throw e;
        }
      }
    },
  },
  computed: {
    season_choices: function () {
      return _.sortBy(_.values(this.target_tv_show.seasons), "season_number");
    },
    episode: function () {
      return (_.maxBy(this.target_tv_show.episodes, "ep") || new Episode()).ep;
    },
  },
};
</script>
<style scoped>
.addTVWindow {
  height: 85vh;
}
.fill-height {
  height: 100%;
}
</style>