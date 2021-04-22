<template>
  <v-card class="mx-auto">
    <v-app-bar color="teal" dark>
      <v-toolbar-title>角色别名</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="upload = !upload">
        <v-icon>mdi-upload</v-icon>
      </v-btn>

      <v-btn icon @click="exportData">
        <v-icon>mdi-content-save</v-icon>
      </v-btn>

      <v-btn icon @click="show_adding_dialog = true">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-app-bar>
    <v-container style="overflow: auto; height: calc(100% - 64px)">
      <v-expand-transition>
        <file-pond
          v-show="upload"
          name="test"
          ref="pond"
          label-idle="请把JSON文件拖放到这里"
          v-bind:allow-multiple="false"
          accepted-file-types="application/json"
          v-bind:files="myFiles"
          @init="handleFilePondInit"
          @addfile="onFileAdd"
        />
      </v-expand-transition>
      <v-slide-y-transition group tag="v-list">
        <template v-for="role in roles">
          <v-list-group
            v-if="role.aliases.length > 0"
            :prepend-icon="mdiAccountCircle"
            :key="role.id"
            @contextmenu="onRoleContext($event, role)"
            v-model="role.active"
          >
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>{{ role.name }}</v-list-item-title>
              </v-list-item-content>
            </template>
            <v-slide-y-transition group>
              <v-list-item
                v-for="alias in role.aliases"
                :ripple="!alias.editing"
                :key="alias.id"
              >
                <v-list-item-content v-if="!alias.editing">
                  <v-list-item-title v-text="alias.name"></v-list-item-title>
                </v-list-item-content>
                <v-list-item-content v-else
                  ><v-text-field
                    dense
                    single-line
                    v-model="alias.name"
                  ></v-text-field
                ></v-list-item-content>

                <v-list-item-action class="alias_action">
                  <v-btn icon @click="alias.editing = !alias.editing">
                    <transition name="slide-fade-short" mode="out-in">
                      <v-icon v-if="!alias.editing" key="edit">{{
                        mdiPencil
                      }}</v-icon>
                      <v-icon v-else key="check" color="teal">{{
                        mdiCheck
                      }}</v-icon>
                    </transition>
                  </v-btn>
                  <v-btn icon @click="removeAlias(role, alias)"
                    ><v-icon v-text="mdiClose"></v-icon
                  ></v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-slide-y-transition>
          </v-list-group>
          <v-list-item
            v-else
            link
            :key="role.id"
            @contextmenu="onRoleContext($event, role)"
          >
            <v-list-item-icon>
              <v-icon v-text="mdiAccountCircle"></v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ role.name }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-slide-y-transition>
    </v-container>

    <v-menu
      v-model="showRoleMenu"
      :position-x="x"
      :position-y="y"
      absolute
      offset-y
    >
      <v-list>
        <v-list-item @click.stop="show_editing_dialog = true">
          <v-list-item-title>编辑角色名</v-list-item-title>
        </v-list-item>
        <v-list-item @click="removeRole">
          <v-list-item-title>删除角色名</v-list-item-title>
        </v-list-item>
        <v-list-item @click="addAlias">
          <v-list-item-title>新增别名</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <v-dialog
      class="name_edit_dialog"
      max-width="50%"
      v-model="show_editing_dialog"
    >
      <v-card v-if="show_editing_dialog">
        <v-card-title> 编辑角色名 </v-card-title>
        <v-card-text>
          <v-text-field label="输入角色名" v-model="target.name"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="show_editing_dialog = false">
            关闭
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      class="name_add_dialog"
      max-width="50%"
      v-model="show_adding_dialog"
    >
      <v-card v-if="show_adding_dialog">
        <v-card-title> 添加角色 </v-card-title>
        <v-card-text>
          <v-text-field label="输入角色名" v-model="inputCache"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="addRole"> 确定 </v-btn>
          <v-btn text @click="show_adding_dialog = false"> 关闭 </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import { mdiAccountCircle, mdiPencil, mdiClose, mdiCheck } from "@mdi/js";
import vueFilePond from "vue-filepond";
import "filepond/dist/filepond.min.css";

import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import _ from "lodash";
import { saveAs } from "file-saver";
import { Role, Alias } from "./model/role";

const FilePond = vueFilePond(FilePondPluginFileValidateType);

export default {
  model: {
    prop: "roles",
    event: "input",
  },
  props: {
    roles: {
      type: Array,
      require: false,
      default: () => new Array(),
    },
  },
  data: () => ({
    mdiAccountCircle,
    mdiPencil,
    mdiClose,
    mdiCheck,
    x: null,
    y: null,
    showRoleMenu: false,
    menuRole: null,
    target: null,
    show_editing_dialog: false,
    show_adding_dialog: false,
    inputCache: "",
    myFiles: [],
    upload: false,
    result: "",
  }),
  methods: {
    handleFilePondInit: function () {
      console.log("FilePond has initialized");

      // FilePond instance methods are available on `this.$refs.pond`
    },
    onFileAdd: function () {
      const file = this.$refs.pond.getFile().file;
      let reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          const result = _.toPairs(JSON.parse(reader.result)).filter(
            (item) => item[0].length > 0
          );
          this.roles = [];
          for (const [roleName, aliases] of result) {
            const aliasList = aliases
              .filter((item) => item.length > 0)
              .map((aliasName) => new Alias(aliasName));
            const role = new Role(roleName);
            role.aliases = aliasList;
            this.roles.push(role);
          }
        }
      };
      reader.readAsText(file);
    },
    onRoleContext: async function (e, role) {
      e.preventDefault();
      this.target = role;
      this.showRoleMenu = false;
      this.x = e.clientX;
      this.y = e.clientY;
      await this.$nextTick();
      this.showRoleMenu = true;
    },
    removeAlias: function (role, alias) {
      role.aliases.splice(
        role.aliases.findIndex((item) => item.id == alias.id),
        1
      );
    },
    removeRole: function () {
      let role = this.target;
      this.roles.splice(
        this.roles.findIndex((item) => item.id === role.id),
        1
      );
    },
    addRole: async function () {
      let newRole = new Role(this.inputCache);
      this.roles.push(newRole);
      await this.$nextTick();
      this.show_adding_dialog = false;
      this.inputCache = "";
    },
    addAlias: async function () {
      let new_alias = new Alias("");
      new_alias.editing = true;
      this.target.aliases.push(new_alias);
      await this.$nextTick();
      this.target.active = true;
    },
    exportData: function () {
      const downloadTarget = _.fromPairs(
        this.roles.map((role) => [
          role.name,
          role.aliases.map((alias) => alias.name),
        ])
      );
      const downloadText = JSON.stringify(downloadTarget);
      let blob = new Blob([downloadText], {
        type: "application/json;charset=utf-8",
      });
      saveAs(blob, "out.json");
    },
  },
  watch: {
    roles: function () {
      let res = {};
      for (const role of this.roles) {
        res[role.name] = role.aliases.map((item) => item.name);
      }
      this.$emit("input", res);
    },
  },
  components: {
    FilePond,
  },
};
</script>
<style scoped>
.alias_action {
  flex-direction: row;
}
.slide-fade-short-enter-active {
  transform: scale(0.5, 0.5);
  opacity: 0;
}
.slide-fade-short-leave-active {
  transform: scale(0.5, 0.5);
  opacity: 0;
}
</style>