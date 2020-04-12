<template>
  <div id="app">
    <PlayerChartBox/>
  </div>
</template>

<script>
import PlayerChartBox from "./components/PlayerChartBox";

export default {
  name: "App",
  components: {
    PlayerChartBox
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
