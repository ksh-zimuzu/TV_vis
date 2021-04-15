<template>
  <v-app id="app">
    <title>影视分析系统</title>
    <AppBar />
    <v-content>
      <v-container fluid>
        <keep-alive>
          <router-view :mobile="isMobile" />
        </keep-alive>
      </v-container>
      <v-snackbar v-model="snackbar">
        {{ snackbar_text }}
        <v-btn color="pink" text @click="snackbar = false">关闭</v-btn>
      </v-snackbar>
    </v-content>

    <v-footer>
      <router-link to="/" class="footer-link">地图</router-link>
      <v-spacer></v-spacer>
      <img src="./assets/images/algolia.svg" class="algolia" />可视化字幕组
      <div style="margin-left: 5px">&copy; 2020</div>
    </v-footer>
  </v-app>
</template>

<script>
import AppBar from "./components/AppBar";
export default {
  name: "App",
  components: {
    AppBar,
  },
  data: function () {
    return {
      snackbar: false,
      snackbar_text: "没事啊",
    };
  },
  created() {
    this.$EventBus.$on("snackbar", (msg) => {
      this.snackbar_text = msg;
      this.snackbar = true;
    });
  },
  computed: {
    isMobile() {
      let flag = navigator.userAgent.match(
        /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
      );
      return flag;
    },
  },
  metaInfo: {
    // if no subcomponents specify a metaInfo.title, this title will be used
    title: "剧情可视化系统",
    // all titles will be injected into this template
    titleTemplate: "%s | 可视化字幕组",
  },
};
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
.footer-link {
  text-decoration: none;
  color: #2c3e50;
  margin: 0 10px;
}
.algolia {
  margin: 10px;
  height: 16px;
}
</style>
