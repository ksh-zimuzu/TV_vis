<template>
    <smart-widget title="剧情">
        <v-app>
            <div class="text-center" id="plot">
                {{actorplots.content}}
            </div>
            <div class="text-center">
                <a v-for="user in actor_name" :key="user" class="nowrap">
                    <v-chip draggable
                      class="ma-2"
                      color="red"
                      text-color="white"
                      large
                      @click="actor(user)"
                    >
                    <v-avatar>
                        <img :src="user.src"/>
                      </v-avatar>
                      {{user.content}}
                    </v-chip>
                </a>
            </div>
        </v-app>
    </smart-widget>
    
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
            if(actor!=null)
            {
                checkflag(actor.show,actor.content);
                actor.show=!actor.show;
            }
            else
            {
                alert(" error1! ");
            }
        },
    },
    data() {
        return{
            msg:'剧情',
        }
    },
    
}

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
.div2{overflow-y:scroll}
</style>