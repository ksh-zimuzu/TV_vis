<template>
  <v-card max-height="500px" max-width="300px" class="progress_card">
    <v-fade-transition
      ><v-card-title style="justify-content: center">{{
        helpMessage
      }}</v-card-title>
    </v-fade-transition>

    <v-card-text class="progress_bar">
      <v-progress-circular
        :value="loginProgress"
        indeterminate
      ></v-progress-circular>
    </v-card-text>
  </v-card>
</template>

<script>
import githubLoginMixin from "../mixins/github-login";

export default {
  data: () => ({
    accessToken: "",
    loginProgress: 0,
    helpMessage: "请稍后，正在登陆GitHub...",
  }),
  mounted: async function () {
    await this.handleAuth();
    this.resumeURL();
  },
  mixins: [githubLoginMixin],
};
</script>

<style scoped>
.progress_card {
  margin: calc(40vh - 50px) auto 0;
}
.progress_bar {
  display: flex;
  justify-content: center;
}
</style>