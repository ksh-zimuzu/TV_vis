<template>
  <div style="width:100%;height:100%" id="sankeychart" class="sankeychart">
  </div>
</template>

<script>
//import * as d3 from 'd3';
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
        create_chart(){
            var options=this.options;
            this.chart.setOption(options);
        },
        //转化为对应节点格式
        dataFormat(){
                var data=this.sdata["1"];
                var Nodes=[];
                for (var i= 0; i<data.length; i++){
                    data[i].forEach(function(x){
                    var re=new RegExp(',','g');
                    Nodes.push({name:x[0].join().replace(re,'-'),});
                    })
                }
                //console.log(Nodes);
                this.Nodes=Nodes;
                //多角色
                var multi_name=[],
                    multi_times=[];
                for (var j= 1; j<data.length; j++){
                    data[j].forEach(function(x){
                    multi_name.push(x[0]);
                    multi_times.push(x[1]);
                    });
                }

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
                this.Links=Links;

                //console.log(Links);
                //console.log(Nodes);
        },
        //D3的svg显示效果很差，这个函数应该没用了
        /*SankeyPlot(){
                //console.log("sankeyplot function!")
                d3.sankey = function() {
                    var sankey = {},
                        nodeWidth = 24,
                        nodePadding = 8,
                        size = [1,1],
                        nodes = [],
                        links = [];
                    
                    sankey.nodeWidth = function(_) {
                        if (!arguments.length) return nodeWidth;
                        nodeWidth = +_;
                        return sankey;
                    };
                    
                    sankey.nodePadding = function(_) {
                        if (!arguments.length) return nodePadding;
                        nodePadding = +_;
                        return sankey;
                    };
                    
                    sankey.nodes = function(_) {
                        if (!arguments.length) return nodes;
                        nodes = _;
                        return sankey;
                    };
                    
                    sankey.links = function(_) {
                        if (!arguments.length) return links;
                        links = _;
                        return sankey;
                    };
                    
                    sankey.size = function(_) {
                        if (!arguments.length) return size;
                        size = _;
                        return sankey;
                    };
                    
                    sankey.layout = function(iterations) {
                        computeNodeLinks(); //结点、链接的数据处理
                        computeNodeValues(); //修改结点值
                        computeNodeBreadths();
                        computeNodeDepths(iterations);
                        computeLinkDepths();
                        return sankey;
                    };
                    
                    sankey.relayout = function() {
                        computeLinkDepths();
                        return sankey;
                    };
                    
                    sankey.link = function() {
                        var curvature = 0.5;
                    
                        function link(d) {
                        var x0 = d.source.x + d.source.dx,
                            x1 = d.target.x,
                            xi = d3.interpolateNumber(x0, x1),
                            x2 = xi(curvature),
                            x3 = xi(1 - curvature),
                            y0 = d.source.y + d.sy + d.dy /2,
                            y1 = d.target.y + d.ty + d.dy / 2;
                        return "M" + x0 + "," + y0
                            + "C" + x2 + "," + y0
                            + " " + x3 + "," + y1
                            + " " + x1 + "," + y1;
                        }

                        link.curvature = function(_) {
                        if (!arguments.length) return curvature;
                        curvature = +_;
                        return link;
                        };
                    
                        return link;
                    };
                    
                    function computeNodeLinks() {
                        //console.log(nodes);
                        nodes.forEach(function(node) {
                        node.sourceLinks = [];
                        node.targetLinks = [];
                        });
                        links.forEach(function(link) {
                        var source = link.source,
                            target = link.target;
                        if (typeof source === "number"){
                            source = link.source = nodes[link.source];
                        } 
                        if (typeof target === "number"){
                            target = link.target = nodes[link.target];
                        }
                        //console.log(typeof source.sourceLinks);
                        source.sourceLinks.push(link);
                        target.targetLinks.push(link);
                        });
                        //console.log(links);
                    }
                    
                    // 结点值需要修改为入和与出和的最大值
                    function computeNodeValues() {
                        nodes.forEach(function(node) {
                        node.value = Math.max(
                            d3.sum(node.sourceLinks, value),
                            d3.sum(node.targetLinks, value)
                        );
                        });
                    }
                    
                    function computeNodeBreadths() {
                        var remainingNodes = nodes,
                            nextNodes,
                            x = 0;
                    
                        while (remainingNodes.length) {
                        nextNodes = [];
                        remainingNodes.forEach(function(node) {
                            node.x = x;
                            node.dx = nodeWidth;
                            node.sourceLinks.forEach(function(link) {
                            nextNodes.push(link.target);
                            });
                        });
                        remainingNodes = nextNodes;
                        ++x;
                        }
                    
                        moveSinksRight(x);
                        scaleNodeBreadths((size[0] - nodeWidth) / (x - 1));
                    }
                    function moveSinksRight(x) {
                        nodes.forEach(function(node) {
                        if (!node.sourceLinks.length) {
                            node.x = x - 1;
                        }
                        });
                    }
                    
                    function scaleNodeBreadths(kx) {
                        nodes.forEach(function(node) {
                        node.x *= kx;
                        });
                    }
                    
                    function computeNodeDepths(iterations) {
                        var nodesByBreadth = d3.nest()
                            .key(function(d) { return d.x; })
                            .sortKeys(d3.ascending)
                            .entries(nodes)
                            .map(function(d) { return d.values; });
                    
                        //
                        initializeNodeDepth();
                        resolveCollisions();
                        for (var alpha = 1; iterations > 0; --iterations) {
                        relaxRightToLeft(alpha *= .99);
                        resolveCollisions();
                        relaxLeftToRight(alpha);
                        resolveCollisions();
                        }
                    
                        function initializeNodeDepth() {
                        var ky = d3.min(nodesByBreadth, function(nodes) {
                            return (size[1] - (nodes.length - 1) * nodePadding) / d3.sum(nodes, value);
                        });
                        console.log("ky is");
                        console.log(ky);
                        nodesByBreadth.forEach(function(nodes) {
                            nodes.forEach(function(node, i) {
                            node.y = i;
                            node.dy = node.value * ky; //结点的ky
                            });
                        });
                    
                        links.forEach(function(link) {
                            link.dy = link.value * ky; //链接的ky
                        });
                        }
                    
                        function relaxLeftToRight(alpha) {
                        nodesByBreadth.forEach(function(nodes) {
                            nodes.forEach(function(node) {
                            if (node.targetLinks.length) {
                                var y = d3.sum(node.targetLinks, weightedSource) / d3.sum(node.targetLinks, value);
                                node.y += (y - center(node)) * alpha;
                            }
                            });
                        });
                    
                        function weightedSource(link) {
                            return center(link.source) * link.value;
                        }
                        }
                    
                        function relaxRightToLeft(alpha) {
                        nodesByBreadth.slice().reverse().forEach(function(nodes) {
                            nodes.forEach(function(node) {
                            if (node.sourceLinks.length) {
                                var y = d3.sum(node.sourceLinks, weightedTarget) / d3.sum(node.sourceLinks, value);
                                node.y += (y - center(node)) * alpha;
                            }
                            });
                        });
                    
                        function weightedTarget(link) {
                            return center(link.target) * link.value;
                        }
                        }
                    
                        function resolveCollisions() {
                        nodesByBreadth.forEach(function(nodes) {
                            var node,
                                dy,
                                y0 = 0,
                                n = nodes.length,
                                i;
                    
                            // Push any overlapping nodes down.
                            nodes.sort(ascendingDepth);
                            for (i = 0; i < n; ++i) {
                            node = nodes[i];
                            dy = y0 - node.y;
                            if (dy > 0) node.y += dy;
                            y0 = node.y + node.dy + nodePadding;
                            }
                    
                            // If the bottommost node goes outside the bounds, push it back up.
                            dy = y0 - nodePadding - size[1];
                            if (dy > 0) {
                            y0 = node.y -= dy;
                    
                            // Push any overlapping nodes back up.
                            for (i = n - 2; i >= 0; --i) {
                                node = nodes[i];
                                dy = node.y + node.dy + nodePadding - y0;
                                if (dy > 0) node.y -= dy;
                                y0 = node.y;
                            }
                            }
                        });
                        }
                    
                        function ascendingDepth(a, b) {
                        return a.y - b.y;
                        }
                    }
                    
                    function computeLinkDepths() {
                        nodes.forEach(function(node) {
                        node.sourceLinks.sort(ascendingTargetDepth);
                        node.targetLinks.sort(ascendingSourceDepth);
                        });
                        nodes.forEach(function(node) {
                        var sy = 0, ty = 0;
                        node.sourceLinks.forEach(function(link) {
                            link.sy = sy;
                            sy += link.dy;
                        });
                        node.targetLinks.forEach(function(link) {
                            link.ty = ty;
                            ty += link.dy;
                        });
                        });
                    
                        function ascendingSourceDepth(a, b) {
                        return a.source.y - b.source.y;
                        }
                    
                        function ascendingTargetDepth(a, b) {
                        return a.target.y - b.target.y;
                        }
                    }
                    
                    function center(node) {
                        return node.y + node.dy / 2;
                    }
                    
                    function value(link) {
                        return link.value;
                    }
                    
                    return sankey;
                };
                var units = "次数";
                var margin = {top: 50, right: 10, bottom: 30, left: 10},
                    width = 1500 - margin.left - margin.right, //900
                    height = 1000 - margin.top - margin.bottom; //540
                var formatNumber = d3.format(",.0f"),    // zero decimal places
                    format = function(d) { return formatNumber(d) + " " + units; },
                    //color = d3.scale.category20();
                    //结点颜色
                    mycolors = ["#4e79a7","#a0cbe8","#f28e2b","#ffbe7d","#59a14f",
                                "#8cd17d","#b6992d","#f1ce63","#499894","#86bcb6",
                                "#e15759","#ff9d9a","#79706e","#bab0ac","#d37295",
                                "#fabfd2","#b07aa1","#d4a6c8","#9d7660","#d7b5a6"];
                    console.log(mycolors.length);
                    //console.log(d3.schemeCategory10);
                    //console.log(mycolors);
                var color=d3.scaleOrdinal(mycolors);
                // 页面添加svg
                var svg = d3.select("#sankeychart").append("svg")
                    //.attr("width", width + margin.left + margin.right)
                    //.attr("height", height + margin.top + margin.bottom)
                    .attr("viewBox", "0 0 1500 1000")
                .append("g")
                    .attr("transform", 
                        "translate(" + margin.left + "," + margin.top + ")");
                
                // 设定桑吉图的属性
                var sankey = d3.sankey()
                    .nodeWidth(15)
                    .nodePadding(5) //当结点越多，该数值需要越小，保证kx、dx为正值
                    .size([width, height]);

                var path = sankey.link();
                // 读入单集数据
                var data=this.sdata["1"];
                var Nodes=[];
                for (var i= 0; i<data.length; i++){
                    data[i].forEach(function(x){
                    var re=new RegExp(',','g');
                    Nodes.push({name:x[0].join().replace(re,'-'),});
                    })
                }
                //console.log(Nodes);

                //多角色
                var multi_name=[],
                    multi_times=[];
                for (var j= 1; j<data.length; j++){
                    data[j].forEach(function(x){
                    multi_name.push(x[0]);
                    multi_times.push(x[1]);
                    });
                }

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

                    //console.log(Links);

                    //nodeMap设置，保证数据格式！
                var nodeMap = {};
                Nodes.forEach(function(x) { nodeMap[x.name] = x; });
                Links =Links.map(function(x) {
                    return {
                    source: nodeMap[x.source],
                    target: nodeMap[x.target],
                    value: x.value
                    };
                });

                //初始化桑基图
                sankey
                    .nodes(Nodes)
                    .links(Links)
                    .layout(32);

                // add in the links
                var link = svg.append("g").selectAll(".link")
                    .data(Links)
                    .enter().append("path")
                    .attr("class", "link")
                    .attr("d", path)
                    .style("stroke-width", function(d) { return Math.max(1,d.dy); })
                    .sort(function(a, b) { return b.dy - a.dy; });

                // add the link titles
                link.append("title")
                    .text(function(d) {
                    return d.source.name + " → " + 
                            d.target.name + "\n" + format(d.value); });

                //加入结点
                var node = svg.append("g").selectAll(".node")
                    .data(Nodes)
                .enter().append("g")
                    .attr("class", "node")
                    .attr("transform", function(d) { 
                   return "translate(" + d.x + "," + d.y + ")"; })
                .call(d3.drag()
                    .subject(function(d) { return d; })
                    //.origin(function(d) { return d; })
                    //.on("dragstart", function() {
                    .on("start",function(){ 
                        this.parentNode.appendChild(this); 
                    })
                    .on("drag", dragmove));

                //矩形结点
                node.append("rect")
                    .attr("height", function(dat) { return dat.dy; })
                    .attr("width", sankey.nodeWidth())
                    .attr("")
                    .style("fill", function(d) { 
                    //console.log(color);
                    return d.color = color(d.name.replace(/ .*//*, "")); })
                    .style("stroke", function(d) { 
                    return d3.rgb(d.color).darker(2); })
                .append("title")
                    .text(function(d) { 
                    return d.name + "\n" + format(d.value); });
                
                //结点名称
                node.append("text")
                    .attr("x",-3)
                    .attr("y", function(d) { return d.dy/2; })
                    .attr("dy", "0.35em") //not necessary
                    .attr("text-anchor", "end")
                    .attr("transform", null)
                    .text(function(d) { return d.name; })
                    .filter(function(d) { return d.x < width / 2; })
                    .attr("x", 6 + sankey.nodeWidth())
                    .attr("text-anchor", "start")
                    .style("font-size", "1.2em")
                    .style("color", "red");

                    //拖动结点
                function dragmove(d) {
                    d3.select(this).attr("transform", 
                        "translate(" + (
                            d.x = Math.max(0, Math.min(width - d.dx, d3.event.x))
                            ) + "," + (
                                    d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))
                            ) + ")");
                    sankey.relayout();
                    link.attr("d", path);
                }                
        }*/
    },
    computed:{
       options(){
           var op={
               //时间轴 待debug
               /*
               timeline:{  
                    data:(function(){  
                        var data=[];  
                        for(var i=1;i<=this.edata;i++){  
                            data.push("第"+String(i)+"集");   
                        }  
                            return data;  
                    })(),  
                    autoPlay : true,  
                    playInterval : 1000  
                },
                //option
                options:(function(){  
                    var options=[];  
                    for(var i=0;i<this.edata;i++){   
                        options.push({
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
                        });   
                    }  
                    return options;  
                })()  
            }
            */
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
       }
    },
};
</script>