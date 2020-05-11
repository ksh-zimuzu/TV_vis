<template>
    <smart-widget title="演员合作网络">
        <NetworkChart v-bind:acid="actorName" :ndata="networkData" ref="network_chart"/>
    </smart-widget>
</template>

<script>
import NetworkChart from "./NetworkChart";
import _ from "lodash";
export default {
    name:"NetworkChartBox",
    props:{
        actorName: {
            type: String,
            required: true
        },
        networkData: {
            type: Array,
            required: true
        }
        //actorName:String,
        //networkData:Array,
    },
    data:function(){
        return{};
    },
    components:{
        NetworkChart,
    },
    methods: {
        resizeEvent: function() {
            this.resizeFunc();
        },
        showData: function(){
            console.log("showdata");
            console.log(this.NetworkData);
            console.log(this.actorName);
        }
    },
    mounted: function() {
        console.log("sankeychartbox");
        this.showData();
        this.resizeFunc = _.debounce(this.$refs.network_chart.chart.resize, 500);
        this.resizeFunc();
        this.$parent.$on("resize", this.resizeEvent); 
    }
}
</script>