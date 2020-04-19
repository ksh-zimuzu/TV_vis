<template>
    <div>
        <v-app>
            <h1>
                {{msg}}
            </h1>
            <div class="text-center" id="plot">
                {{actorplots.content}}
            </div>
    
            <div class="text-center">
                <v-chip draggable
                  class="ma-2"
                  color="red"
                  text-color="white"
                  large
                  @click="actor(actor_name[0].content)"
                >
                <v-avatar>
                    <img src="../assets/images/xiaozhan.jpg"/>
                </v-avatar>
                  {{actor_name[0].content}}
                </v-chip>

                <v-chip draggable
                  class="ma-2"
                  color="indigo"
                  text-color="white"
                  large
                  @click="actor(actor_name[1].content)"
                >
                <v-avatar>
                    <img src="../assets/images/wangyibo.jpg"/>
                  </v-avatar>
                  {{actor_name[1].content}}
                </v-chip>
            </div>
        </v-app>
    </div>
</template>


<script>

export default {
    name: 'ActorPlot',
    props:{
        actorplots:{
            type:Object,
            required:true
        },
        actor_name:{
            type:Array,
            required:true,
        }
    },
    methods:{
        actor: function(actor){
            if(actor==this.actor_name[0].content)
            {
                 checkflag(actorFlag[0],actor);
                actorFlag[0]=!actorFlag[0];
            }
            else{
                if(actor==this.actor_name[1].content)
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
            /*actorname:[
                {content:actor_name[0].content},
                {content:actor_name[1].content},
            ]*/
        }
    },
    
}

var actorFlag=[true,true];
String.prototype.Trim = function()
{//去空格
    return this.replace(/\s/gi,"")
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

</script>
<style scoped>

</style>