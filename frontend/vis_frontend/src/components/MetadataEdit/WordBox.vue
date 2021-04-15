<template>
  <v-menu v-model="menu">
    <template v-slot:activator="{ on }">
      <v-chip small v-on="on">
        {{ word }}
      </v-chip>
    </template>
    <v-card width="300">
      <v-list dark>
        <v-list-item>
          <v-list-item-avatar>
            <v-img src="https://cdn.vuetifyjs.com/images/john.png"></v-img>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>John Leider</v-list-item-title>
            <v-list-item-subtitle>john@vuetifyjs.com</v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn icon @click="menu = false">
              <v-icon>mdi-close-circle</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>
      <v-list>
        <v-list-item @click="() => {}">
          <v-list-item-action>
            <v-icon>mdi-briefcase</v-icon>
          </v-list-item-action>
          <v-list-item-subtitle>john@gmail.com</v-list-item-subtitle>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script>
export default {
  data: () => ({
    menu: false,
  }),
  props: {
    word: {
      type: String,
    },
  },
};
</script>

<style scoped>
.word {
  background-color: #ddd;
  border-radius: 5px;
  transition: 0.5s;
}
.word:hover {
  background-color: #555;
  color: #fff;
  transition: 0.5s;
}
</style>