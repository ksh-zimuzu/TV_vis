<template>
    <v-app>
        <div>
            <h1>
                {{msg}}
            </h1>
            <div class="text-center" id="plot">
                晚上，聂怀桑揣着花生米来找魏无羡，江澄也在魏无羡这里凑热闹喝酒。三个人正在打闹时候，蓝湛忽然来到，见三个人喝酒要将他们带去领罚，结果三个人都装醉不肯去。
                在魏无羡的掩护下江澄和聂怀桑慌忙逃走了。魏无羡趁蓝湛不防备，给他贴上了一个符咒，让蓝湛受他控制陪着喝酒。
                蓝湛不胜酒力一杯酒就倒了，魏无羡只好把他扶上床，看到他抹额歪了，蓝湛好意要给他扶正，蓝湛却躲开了，并且醉意朦胧告诉魏无羡抹额很重要，除非父母妻子不可以碰触，
                魏无羡忍不住大笑，认为蓝家为人古板，且戒律很多，没有女孩愿意嫁给蓝家做妻子，蓝家的人也必定要打光棍，蓝湛反而认为那样很好。
                次日，蓝涣和叔父谈论水祟的事情，并且告诉叔父魏无羡说过水祟和摄灵有必然的联系，这让叔父大为吃惊关心询问魏无羡的父母，
                一听说魏无羡母亲是藏色散人，叔父立刻神色大变，认为魏无羡调皮捣蛋倒是和他母亲如出一辙。
                此时，有人传报魏无羡聚众喝酒被抓住，蓝涣忍不住笑了，倒是意料之中的事情，可随后听闻还有蓝湛倒是让蓝涣吃惊不小。
                魏无羡本想独立承担罪责，领受惩罚，为蓝湛辩护，可蓝湛却甘愿被罚，结果三人都被打了三百下。
            </div>
    
            <div class="text-center">
                <v-chip draggable
                  class="ma-2"
                  color="red"
                  text-color="white"
                  large
                  @click="actor(actor0_name)"
                >
                <v-avatar>
                    <img :src="imgUrl0"/>
                  </v-avatar>
                  {{actor0_name}}
                </v-chip>

                <v-chip draggable
                  class="ma-2"
                  color="indigo"
                  text-color="white"
                  large
                  @click="actor(actor1_name)"
                >
                <v-avatar>
                    <img :src="imgUrl1"/>
                  </v-avatar>
                  {{actor1_name}}
                </v-chip>

            </div>
        </div>
    </v-app>
</template>


<script>

export default {
    name: 'ActorPlot',
    methods:{
        actor: function(actor){
            if(actor==this.actor0_name)
            {
                 checkflag(actorFlag[0],actor);
                actorFlag[0]=!actorFlag[0];
            }
            else{
                if(actor==this.actor1_name)
                {
                    checkflag(actorFlag[1],actor);
                    actorFlag[1]=!actorFlag[1];
                }
                else{
                     alert(" error1! ");
                 }
            }
        },
    },
    data() {
        return{
            msg:'剧情',
            imgUrl0:"./static/xiaozhan.jpg",
            imgUrl1:"./static/wangyibo.jpg",
            actor0_name:"魏无羡",
            actor1_name:"蓝湛",
        }
    },
    
}

var actorFlag=[true,true];
var actor0_name=this.actor0_name;
String.prototype.Trim = function()
{//去空格
    return this.replace(/\s/gi,"")
}
function searchActor(searchtext){
    
}
function checkflag(flag,searchtext){
    if(flag==1)
    {
        replaceTarget(searchtext);
    }
    else
    {
        revertTarget(searchtext);
    }
}


function replaceTarget(searchtext){//查找处理
    var reg = new RegExp(searchtext,"g");
    var objtext = document.getElementById("plot").innerHTML;
    var sCurText;
    if(!reg.test(objtext)){//没找到
        alert(" can not find!");
        return;
    }
    else{//找到
        var prehtml = document.getElementById("plot").innerHTML;//获取目标文本容器的HTML字符串
        var newinner = prehtml.replace(reg,'<span class="font-weight-black" style="color:red">'+searchtext+'</span>')
        document.getElementById("plot").innerHTML = newinner;//把处理后的HTML字符串写回到容器中
    }

}

function revertTarget(searchtext){//查找处理
    var reg = new RegExp('<span class="font-weight-black" style="color:red">'+searchtext+'</span>',"g");
    var objtext = document.getElementById("plot").innerHTML;
    var sCurText;
    if(!reg.test(objtext)){//没找到
        alert(" error!");
        return;
    }
    else{//找到
        var prehtml = document.getElementById("plot").innerHTML;//获取目标文本容器的HTML字符串
        var newinner = prehtml.replace(reg,'<span>'+searchtext+'</span>')
        document.getElementById("plot").innerHTML = newinner;//把处理后的HTML字符串写回到容器中
    }

}

/*window.onload = function(){
    document.getElementById("searchbtn").onclick = function(){
        var searchtext = document.getElementById("search").value.Trim();
        searchTarget(searchtext);
    }
}*/
</script>
<style scoped>

</style>