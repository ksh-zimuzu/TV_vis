<template>
  <v-list-group v-model="is_active">
    <template v-slot:activator>
      <v-list-item-content>
        <v-list-item-title>第{{episode}}集</v-list-item-title>
      </v-list-item-content>
    </template>
    <v-skeleton-loader
      class="mx-auto"
      type="list-item-avatar-two-line,list-item-avatar-two-line,list-item-avatar-two-line,image"
      :loading="loading"
    >
      <v-list-item>
        <v-list-item-avatar>
          <v-icon>{{mdiThumbsUpDown }}</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>评分</v-list-item-title>
          <v-list-item-subtitle>
            <v-icon v-for="star in stars" :key="star" color="#ffac2d">{{mdiStar}}</v-icon>
            <v-icon v-if="rating%2>=1" color="#ffac2d">{{mdiStarHalf}}</v-icon>
            {{this.rating}}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-avatar>
          <v-icon>{{mdiChairRolling}}</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>导演</v-list-item-title>
          <v-list-item-subtitle>{{this.director}}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-avatar>
          <v-icon>{{mdiCalendar}}</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>发行日期</v-list-item-title>
          <v-list-item-subtitle>{{this.air_date}}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-img :src="IMG_BASE_URL+image" :lasy-src="LASY_IMG_BASE_URL+image"></v-img>
      </v-list-item>
    </v-skeleton-loader>
  </v-list-group>
</template>

<script>
import {
  mdiStar,
  mdiStarHalf,
  mdiThumbsUpDown,
  mdiChairRolling,
  mdiCalendar
} from "@mdi/js";
import TVMetaService from "../services/tv_meta";
import _ from "lodash";

export default {
  data: () => ({
    mdiStar,
    mdiStarHalf,
    mdiThumbsUpDown,
    mdiChairRolling,
    mdiCalendar,
    loading: true,
    raw_rating: 0,
    director: undefined,
    air_date: undefined,
    image: undefined,
    IMG_BASE_URL: "https://image.tmdb.org/t/p/w780",
    LASY_IMG_BASE_URL: "https://image.tmdb.org/t/p/w300",
    is_active: false
  }),
  props: {
    tv_id: {
      type: [String, Number],
      required: true
    },
    season: {
      type: [String, Number],
      default: 1,
      required: false
    },
    episode: {
      type: Number,
      default: 1,
      required: false
    },
    active: {
      default: false,
      required: false
    }
  },
  created: function() {
    this.refresh_metadata();
  },
  methods: {
    refresh_metadata: function() {
      this.loading = true;
      TVMetaService.fetch_episode_info(
        this.tv_id,
        this.season,
        this.episode
      ).then(res => {
        this.loading = false;
        this.raw_rating = res.data.vote_average;
        this.air_date = res.data.air_date;
        var directorFind = res.data.crew.find(item => {
          return item.job.toLowerCase() === "director";
        });

        this.director = directorFind == undefined ? "未知" : directorFind.name;
        this.image = res.data.still_path;
      });
    }
  },
  computed: {
    stars: function() {
      return _.range(Math.floor(this.rating / 2));
    },
    rating: function() {
      return this.raw_rating.toFixed(1);
    }
  },
  watch: {
    episode: function() {
      this.refresh_metadata();
    },
    season: function() {
      this.refresh_metadata();
    },
    tv_id: function() {
      this.refresh_metadata();
    },
    active: function() {
      this.is_active = this.active;
    }
  }
};
</script>
