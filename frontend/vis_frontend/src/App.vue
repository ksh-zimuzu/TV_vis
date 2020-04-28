<template>
  <v-app id="app">
    <router-view/>
      <p>导航:
        <router-link to="/">首页</router-link>
        <router-link to="/index">主页</router-link>
        <router-link to="/test">地图测试</router-link>
      </p>
  </v-app>
</template>

<script>

export default {
  name: "App",
  components: {
  },
  data: function() {
    return {
    };
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
