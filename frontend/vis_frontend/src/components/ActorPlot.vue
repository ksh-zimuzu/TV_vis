<template>
  <div class="plotw-meta">
    <h2>剧情</h2>
    <div id="plot" v-html="raw_html"></div>
  </div>
</template>


<script>
export default {
  name: "ActorPlot",
  props: {
    plot: {
      type: String,
      required: true
    },
    highlightRole: {
      type: String,
      required: false,
      default: ""
    }
  },
  computed: {
    raw_html: function() {
      if (this.highlightRole.length > 0) {
        var re = new RegExp(this.highlightRole, "g");
        return this.plot.replace(
          re,
          `<span class="font-weight-black" style="color:red">${this.highlightRole}</span>`
        );
      } else {
        return this.plot;
      }
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