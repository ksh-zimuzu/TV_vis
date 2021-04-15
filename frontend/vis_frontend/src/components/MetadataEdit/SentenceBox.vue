<template>
  <v-tooltip top :value="show" open-on-click :open-on-hover="true">
    <template v-slot:activator="{ on, attrs }">
      <span
        v-bind="attrs"
        :class="lock ? 'span-active' : ''"
        @blur="onHover(on, $event)"
        @focus="onHover(on, $event)"
        @keydown="onHover(on, $event)"
        @mouseenter="onHover(on, $event)"
        @mouseleave="onHover(on, $event)"
        @click="lock = !lock"
      >
        {{ sentence }}
      </span>
    </template>
    <v-chip
      class="px-2 mx-1"
      v-for="(roleName, i) in roleInSentence"
      :key="i"
      small
    >
      {{ roleName }}
    </v-chip>
    <span v-if="roleInSentence.length == 0">无</span>
  </v-tooltip>
</template>

<script>
import _ from "lodash";

export default {
  props: {
    sentence: {
      type: String,
      require: true,
    },
    roleArray: {
      type: Array,
      require: true,
    },
  },
  computed: {
    roleInSentence: function () {
      let inSentence = [];
      for (let role of this.roleArray) {
        role = _.flatten(role);
        const targetReg = new RegExp(role.join("|"));
        const roleName = role[0];
        if (targetReg.test(this.sentence)) {
          inSentence.push(roleName);
        }
      }
      return inSentence;
    },
  },
  data: () => ({
    show: false,
    lock: false,
  }),
  methods: {
    onHover(onFunc, e) {
      if (e.type == "keydown") {
        this.lock = !this.lock;
        onFunc.keydown(e);
      } else {
        if (!this.lock) {
          onFunc[e.type](e);
        }
      }
    },
  },
};
</script>

<style scoped>
span {
  padding: 2px;
}
.span-active,
span:hover {
  background-color: #8a8a8a;
  color: white;
  transition: 0.5s;
  border-radius: 3px;
}
</style>