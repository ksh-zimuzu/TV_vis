<template>
  <div class="plotw-meta">
    <h2>剧情</h2>
    <div id="plot" v-html="raw_html"></div>
  </div>
</template>


<script>
import _ from "lodash";
export default {
  name: "ActorPlot",
  props: {
    plot: {
      type: String,
      required: true
    },
    highlightRole: {
      type: [String, Array],
      required: false,
      default: ""
    },
    highlightColor: {
      type: String,
      required: false,
      default: "#cf312c"
    },
    roles: {
      default: () => ({})
    },
    colors: {
      default: () => [
        "#9a3e25",
        "#166b90",
        "#708259",
        "#bd2d28",
        "#0f8c79",
        "#5c8100"
      ]
    }
  },
  computed: {
    raw_html: function() {
      if (this.highlightRole == "") {
        return this.plot;
      } else {
        var highlightRole = this.highlightRole;
        if (typeof highlightRole == "string") {
          highlightRole = [highlightRole];
        }
        var that = this;
        highlightRole = highlightRole.map(function(role) {
          return that.roles[role] ? [role].concat(that.roles[role]) : [role];
        });
        highlightRole = _.flatten(highlightRole);
        var re = new RegExp(highlightRole.join("|"), "g");
        return this.plot.replace(
          re,
          match =>
            `<mark class="font-weight-black" style="background-color:${this.roleColors.get(
              match
            )};color:white">${match}</mark>`
        );
      }
    },
    roleColors: function() {
      return new Map(
        _.chain(this.roles)
          .toPairs()
          .map(([role, alias]) => {
            var color = _.sample(this.colors);
            var aliasColor = alias.map(t => [t, color]);
            var roleColor = aliasColor.concat([[role, color]]);
            return roleColor;
          })
          .flatten()
          .value()
      );
    }
  },
  methods: {
    actor: function(actor) {
      if (actor != null) {
        checkflag(actor.show, actor.content);
        actor.show = !actor.show;
      } else {
        alert(" error1! ");
      }
    }
  },
  data() {
    return {
      msg: "剧情"
    };
  },
  watch: {
    raw_html() {
      this.$nextTick(() => {
        this.$vuetify.goTo("mark.font-weight-black", {
          container: this.$el
        });
      });
    }
  }
};

function checkflag(flag, searchtext) {
  if (flag == 1) {
    replaceTarget(searchtext);
  } else {
    revertTarget(searchtext);
  }
}

function replaceTarget(searchtext) {
  //查找处理
  var reg = new RegExp(searchtext, "g");
  var objtext = document.getElementById("plot").innerHTML;
  if (!reg.test(objtext)) {
    //没找到
    alert(" can not find!");
    return;
  } else {
    //找到
    var prehtml = document.getElementById("plot").innerHTML; //获取目标文本容器的HTML字符串
    var newinner = prehtml.replace(
      reg,
      '<span class="font-weight-black" style="color:red">' +
        searchtext +
        "</span>"
    );
    document.getElementById("plot").innerHTML = newinner; //把处理后的HTML字符串写回到容器中
  }
}

function revertTarget(searchtext) {
  //查找处理
  var reg = new RegExp(
    '<span class="font-weight-black" style="color:red">' +
      searchtext +
      "</span>",
    "g"
  );
  var objtext = document.getElementById("plot").innerHTML;
  if (!reg.test(objtext)) {
    //没找到
    alert(" error!");
    return;
  } else {
    //找到
    var prehtml = document.getElementById("plot").innerHTML; //获取目标文本容器的HTML字符串
    var newinner = prehtml.replace(reg, "<span>" + searchtext + "</span>");
    document.getElementById("plot").innerHTML = newinner; //把处理后的HTML字符串写回到容器中
  }
}
</script>
<style scoped>
.plotw-meta {
  overflow-y: auto;
  height: inherit;
  background-color: white;
  border: 1px solid #ebeef5;
  box-shadow: 0 0 10px 0 #e9e9e9;
  padding: 15px;
}
</style>