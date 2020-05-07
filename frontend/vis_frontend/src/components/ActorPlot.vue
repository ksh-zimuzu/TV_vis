<template>
    <div class="plotw-meta">
        <h1>
            {{msg}}
        </h1>
        <div class="text-center" id="plot">
            {{actorplots.content}}
        </div>
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

/*String.prototype.Trim = function()
{//去空格
    return this.replace(/\s/gi,"")
}*/

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
.plotw-meta {
  overflow-y: auto;
  height: inherit;
  background-color: white;
  border: 1px solid #ebeef5;
  box-shadow: 0 0 10px 0 #e9e9e9;
}
</style>