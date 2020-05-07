<template>
  <v-app id="app">
    <router-view />
    <p>
      导航:
      <router-link to="/">首页</router-link>
      <router-link to="/index">主页</router-link>
      <router-link to="/test">地图测试</router-link>
    </p>
    <v-snackbar v-model="snackbar">
      {{ snackbar_text }}
      <v-btn color="pink" text @click="snackbar = false">关闭</v-btn>
    </v-snackbar>
    <v-footer>
      <v-btn color="white" text rounded link to="/">首页</v-btn>
      <v-spacer></v-spacer>
      <div>&copy; 2020</div>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: "App",
  components: {},
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

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
