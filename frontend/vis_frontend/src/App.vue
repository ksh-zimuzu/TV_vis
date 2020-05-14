<template>
  <v-app id="app">
    <AppBar />
    <v-content>
      <keep-alive>
        <router-view />
      </keep-alive>
    </v-content>
    <v-snackbar v-model="snackbar">
      {{ snackbar_text }}
      <v-btn color="pink" text @click="snackbar = false">关闭</v-btn>
    </v-snackbar>
    <v-footer absolute>
      <router-link to="/" class="footer-link">地图</router-link>
      <v-spacer></v-spacer>
      <img src="./assets/images/algolia.svg" class="algolia" />可视化字幕组
      <div style="margin-left:5px">&copy; 2020</div>
    </v-footer>
  </v-app>
</template>

<script>
import AppBar from "./components/AppBar";
export default {
  name: "App",
  components: {
    AppBar
  },
  data: function() {
    return {
      snackbar: false,
      snackbar_text: "没事啊"
    };
  },
  created() {
    this.$EventBus.$on("snackbar", msg => {
      this.snackbar_text = msg;
      this.snackbar = true;
    });
  }
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
