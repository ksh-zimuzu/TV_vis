<template>
    <smart-widget title="演员合作网络">
        <NetworkChart v-bind:acid="actorid" :ndata="networkdata" ref="network_chart"/>
    </smart-widget>
</template>

<script>
import NetworkChart from "./NetworkChart";
import _ from "lodash";
export default {
    name:"NetworkChartBox",
    props:{
        actorid: {
            type: String,
            required: true
        },
        networkdata: {
            type: Array,
            required: true
        }
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
            console.log("--------NetworkChartBox---------------");
            console.log(this.networkdata);
            console.log(this.actorid);
        }
    },
    mounted: function() {
        this.showData();
        this.resizeFunc = _.debounce(this.$refs.network_chart.chart.resize, 500);
        this.resizeFunc();
        this.$parent.$on("resize", this.resizeEvent); 
    }
}
</script>