<template>
  <v-container class="home_container">
    <v-row>
      <v-col cols="2" v-for="TV in TVs" :key="TV.id">
        <ShowCard :tv_show="TV"></ShowCard>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ShowCard from "./ShowCard";
import { TV_Show } from "../MetadataEdit/model/tv_show";
import loader from "@/services/TV_loader";

export default {
  data: () => ({
    TVs: [], //list of TV_Show instances
  }),
  components: {
    ShowCard,
  },
  created: async function () {
    let id_list = await loader.list_main();
    this.TVs = id_list.map((item) => new TV_Show(item.name));
    this.TVs.forEach(function (item) {
      item.fetch_info_by_id();
    });
  },
};
</script>
<style scoped>
.home_container {
  width: 80vw;
}
</style>