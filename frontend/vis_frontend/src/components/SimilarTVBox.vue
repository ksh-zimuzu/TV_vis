<template>
  <smart-widget title="类似剧集热度对比" :loading="loading" :simple="simple">
    <SimilarTVBar ref="tvbar" :current_tv="current_tv" :similar_tvs="similar_tvs" />
  </smart-widget>
</template>

<script>
import SimilarTVBar from "./SimilarTVBar";
import TVMetaService from "../services/tv_meta";
import _ from "lodash";

export default {
  components: {
    SimilarTVBar
  },
  data: () => ({
    current_tv: {
      name: "",
      popularity: 0
    },
    similar_tvs: [],
    loading: true
  }),
  props: {
    current_tv_id: {
      required: true
    },
    simple: {
      type: Boolean
    }
  },
  watch: {
    current_tv_id: function() {
      this.loading = true;
      var curPop = TVMetaService.fetch_info(this.current_tv_id).then(res => {
        this.current_tv.popularity = res.data.popularity;
        this.current_tv.name = res.data.name;
      });
      var similarPop = TVMetaService.fetch_similar(this.current_tv_id).then(
        res => {
          this.similar_tvs = _.slice(res.data.results, 0, 5).map(t => ({
            name: t.name,
            popularity: t.popularity
          }));
        }
      );
      Promise.all([curPop, similarPop]).then(this.loadFinish);
    }
  },
  mounted: function() {
    //防抖动，降低重绘开销，500ms
    this.resizeFunc = _.debounce(this.$refs.tvbar.resize, 500);
    this.resizeFunc(); //绘制完成后修改一下尺寸
    this.$parent.$on("resized", this.resizeEvent); //接收外层resize事件
    this.$parent.$on("container-resized", this.resizeEvent);
  },
  methods: {
    resizeEvent: function() {
      this.resizeFunc();
    },
    loadFinish: function() {
      this.loading = false;
    }
  }
};
</script>