<template>
  <v-hover v-slot="{ hover }">
    <v-card>
      <v-img
        :lazy-src="thumbnail_url + tv_show.poster_path"
        :src="mid_url + tv_show.poster_path"
        height="342"
        width="100%"
      ></v-img>
      <v-card-title>{{ cuttedName }}</v-card-title>
      <router-link :to="'/tv/' + tv_show.id">
        <v-overlay absolute :value="hover">
          <v-btn x-large fab color="primary" depressed
            ><v-icon dark>mdi-chart-bar</v-icon></v-btn
          >
        </v-overlay>
      </router-link>
    </v-card></v-hover
  >
</template>

<script>
import { TV_Show } from "../MetadataEdit/model/tv_show";
import loadApiCfgMixin from "@/mixins/load-api-config";
import _ from "lodash";

export default {
  props: {
    tv_show: {
      type: TV_Show,
      require: true,
    },
  },
  data: () => ({
    overlay: false,
  }),
  created: async function () {
    if (!this.tv_show.loaded) {
      await this.tv_show.fetch_info_by_id();
    }
  },
  mixins: [loadApiCfgMixin],
  computed: {
    cuttedName() {
      return _.truncate(this.tv_show.name, {
        length: 10,
        omission: "...",
      });
    },
  },
};
</script>