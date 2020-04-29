<template>
  <div style="width:100%;height:100%" id="sankeychart" class="mainchart">
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
    name:"MainChart",
    props:{
        sdata:Object,
        edata:Number,
    },
    data: function(){
        return{
            chart:undefined,
            Nodes:Array,
            Links:Array,
            relationNumber:Number,//最大关系
        }
    },
    mounted() {
        this.dataFormat();
        this.chart=echarts.init(this.$el);
        this.create_chart();
    },
    methods:{
        dataFormat(){
            function unique(arr){
                //去重数组
                return Array.from(new Set(arr));
            }
            function relation(s, re) {
                //正则表达式出现次数
                re = eval("/" + re + "/ig")
                return s.match(re) ? s.match(re).length : 0;
            }
            //所有结点
            var allNodes=[];
            for(var m=1;m<=this.edata;m++){
                var data=this.sdata[m];
                for (var i= 0; i<data.length; i++){
                    data[i].forEach(function(x){
                        var re=new RegExp(',','g');
                        allNodes.push(x[0].join().replace(re,'-'));
                    });  
                }
            }
            allNodes=unique(allNodes);
            var n=0;
            var num=0;
            var NewNodes=[];
            var reverseNodes={};//倒排索引
            allNodes.forEach(function(node){
                reverseNodes[node]=num;
                NewNodes.push({
                    id:String(num++),
                    name:node,
                    category:relation(node,'-'),
                    value:0,
                });
                if(relation(node,'-')>n){
                    n=relation(node,'-');
                }
            });
            this.relationNumber=n+1;
            var Links=[];
            var Nodes=[];
            var regularexp=new RegExp(',','g')
            for(var d=1;d<=this.edata;d++){
                var singleLinks=[];
                var singleNodes=[];
                singleNodes=JSON.parse(JSON.stringify(NewNodes)); //深拷贝
                var ndata=this.sdata[d];
                for (var j=0;j<ndata.length;j++){//关系结点数组
                    for(var k=0;k<ndata[j].length;k++){//每组关系
                        if(ndata[j][k][0].length>1){//多角色情况下   
                            for(var chanum=0;chanum<ndata[j][k][0].length;chanum++){//每个角色                    
                                singleLinks.push({
                                    source:String(reverseNodes[ndata[j][k][0][chanum]]),
                                    target:String(reverseNodes[ndata[j][k][0].join().replace(regularexp,'-')]),
                                    value:ndata[j][k][1],
                                });
                            }
                        }
                        var key=reverseNodes[ndata[j][k][0].join().replace(regularexp,'-')];
                        singleNodes[key].value=ndata[j][k][1];
                    }
                }
                Links.push(singleLinks);
                Nodes.push(singleNodes);         
            }
            this.Links=Links;
            this.Nodes=Nodes;
        },

        create_chart(){
            var options=this.animate_option;
            this.chart.setOption(options);
        },
    },
    
    computed:{
       animate_option(){
           var times=this.edata;
           var Nodes=this.Nodes;
           var Links=this.Links;
            for(var c=0;c<Nodes.length;c++){
                Nodes[c].forEach(function (node) {
                    node.itemStyle = null;
                    node.symbolSize=node.value*2;
                    node.label = {
                        normal: {
                            show: node.symbolSize>4,
                        }
                    };
                });
            }
           var categories = [];
           //var colors=["#f2da57","#f6b656","#e25a42","#dcbdcf","#b396ad",
           //             "#b0cbdb","#33b6d0","#7abfcc","#c8d7a1","#a9b700",]
           var colors=["#e3ba22","#e58429","#bd2d28","#8e6c8a",
                        "#6b99a1","#42a5b3","#0f8c79","#6bbba1","#5c8100"];
           var color=0;
           //var na=["","单","二","三","四","五","六","七","八","九","十"];
            for (var i =0; i <this.relationNumber; i++) {
                categories[i] = {
                        name: String(i+1)+"人关系",
                        itemStyle:{
                            color:colors[color++],
                        }
                };
            }
            categories[0].name="单人";
            console.log(categories);
            var op={
               baseOption:{
                timeline:{
                    controlStyle:{
                        color:"#000000",
                    },
                    data:(function(times){  
                        var data=[];  
                        for(var i=1;i<=times;i++){  
                            data.push("第"+String(i)+"集");   
                        } 
                        return data;  
                    })(times),
                    axisType: 'category',
                    autoPlay : false,  
                    playInterval : 1000  
                },
               },
               options:(function(){  
                    var opt=[]; 
                    for(var i=0;i<times;i++){   
                        opt.push({
                            tooltip: {},
                            legend: [{
                                data: categories.map(function (a) {
                                    return a.name;
                                })
                            }],
                            animationDurationUpdate: 2000,
                            animationEasingUpdate: 'quinticInOut',
                            series: [
                                {
                                    type: 'graph',
                                    layout: 'circular',
                                    circular: {
                                        rotateLabel: true
                                    },
                                    data: Nodes[i],
                                    links: Links[i],
                                    categories: categories,
                                    roam: true,
                                    label: {
                                        position: 'right',
                                        formatter: '{b}'
                                    },
                                    lineStyle: {
                                        color: 'target',
                                        //width:3,
                                        curveness: 0.3
                                    }
                                }
                            ]
                        });   
                    }  
                    return opt;  
                })(times)  
            };
           return op;
       },
    },
};
</script>