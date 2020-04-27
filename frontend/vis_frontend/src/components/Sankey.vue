<template>
  <div style="width:100%;height:100%" id="sankeychart" class="sankeychart">
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
    name:"Sankey",
    props:{
        sdata:Object,
        edata:Number,
    },
    data: function(){
        return{
            chart:undefined,
            Nodes:Array,
            Links:Array,
        }
    },
    mounted() {
        this.dataFormat();
        this.chart=echarts.init(this.$el);
        this.create_chart();
    },
    methods:{
        dataFormat(){
            var all_Nodes=[];
            var all_Links=[];
            //转化为对应节点格式
            function getSubArray(arr){
                var res=[];
                var n=arr.length-1;
                var s1=arr.slice(0,n);
                var s2=arr.slice(1,n+1);
                res.push(s1);
                res.push(s2);
                if(n>1){
                    var s3=arr.slice(0,n-1);
                    s3.push(arr[n]);
                    res.push(s3);
                }
                return res;
            }
            for(var m=1;m<=this.edata;m++){
                var data=this.sdata[m];
                var Nodes=[];
                for (var i= 0; i<data.length; i++){
                    data[i].forEach(function(x){
                    var re=new RegExp(',','g');
                    Nodes.push({name:x[0].join().replace(re,'-'),});
                    })
                }
                all_Nodes.push(Nodes);
                //多角色
                var multi_name=[],
                    multi_times=[];
                for (var j= 1; j<data.length; j++){
                    data[j].forEach(function(x){
                    multi_name.push(x[0]);
                    multi_times.push(x[1]);
                    });
                }

                //Link
                var Links=[];
                for(var k=0;k<multi_name.length;k++){
                    var re=new RegExp(',','g');
                    var names=multi_name[k].join().replace(re,'-');
                    var sub=getSubArray(multi_name[k]);
                    //console.log(names);
                    //console.log(sub);
                    for(var l=0;l<sub.length;l++){
                    //console.log(sub[l]);
                        var tmp={
                            source:sub[l].join().replace(re,'-'),
                            target:names,
                            value:(multi_times[k]).toString(),
                        }
                        Links.push(tmp);
                    }
                    var len=multi_name[k].length;
                    if(sub.length>=3){
                        var tmp1={
                            source:multi_name[k][0],
                            target:names,
                            value:(multi_times[k]).toString(),
                        };
                        var tmp2={
                            source:multi_name[k][len-1],
                            target:names,
                            value:(multi_times[k]).toString(),
                        };
                        var tmp3={
                            source:multi_name[k][len-2],
                            target:names,
                            value:(multi_times[k]).toString(),
                        };
                        Links.push(tmp1);
                        Links.push(tmp2);
                        Links.push(tmp3);
                    }
                }
                all_Links.push(Links);
            }
            this.Nodes=all_Nodes;
            this.Links=all_Links;
            //console.log(this.Nodes);
            //console.log(this.Links);
        },
        create_chart(){
            //console.log(this.debug);
            var options=this.animate_option;
            this.chart.setOption(options);
        },
    },
    
    computed:{
       options(){
           var op={
            backgroundColor: "#FFFFFF",
            series: [{
                type: "sankey",
                left: "10%",
                top: "10%",
                right: "10%",
                bottom: "10%",
                data: this.Nodes,
                links:this.Links,
                lineStyle: {
                    color: "source",
                    curveness: 0.5
                },
                itemStyle: {
                    //color: "#1f77b4",
                    borderColor: "#1f77b4"
                },
                label: {
                    color: "rgba(0,0,0,0.7)",
                    fontFamily: "Arial",
                    fontSize: 15
                }
            }],
            tooltip: {
                trigger: "item",
                //triggerOn: 'mousemove',
             },
           }
           return op;
       },
       animate_option(){
           var times=this.edata;
           var Nodes=this.Nodes;
           var Links=this.Links;
           var op={
               baseOption:{
                timeline:{  
                data:(function(){  
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
                            backgroundColor: "#FFFFFF",
                            series: [{
                                type: "sankey",
                                left: "10%",
                                top: "10%",
                                right: "10%",
                                bottom: "10%",
                                data: Nodes[i],
                                links:Links[i],
                                lineStyle: {
                                    color: "source",
                                    curveness: 0.5
                                },
                                itemStyle: {
                                    //color: "#1f77b4",
                                    borderColor: "#1f77b4"
                                },
                                label: {
                                    color: "rgba(0,0,0,0.7)",
                                    fontFamily: "Arial",
                                    fontSize: 15
                                }
                            }],
                            tooltip: {
                                trigger: "item",
                                triggerOn: 'mousemove',
                            },
                        });   
                    }  
                    //console.log(opt);
                    return opt;  
                })(times)  
            };
           //console.log(op);
           return op;
       },
    },
};
</script>