<template>
    <smart-widget title="演员合作网络" :loading="networkloading">
        <NetworkChart 
        :acid="actorid" 
        :loading="networkloading"
        :ndata="networkdata"
        ref="network_chart"/>
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
        },
        networkloading: {
            default: true
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
            console.log("--------NetworkChartBox--------");
            console.log(this.networkdata);
            console.log(this.actorid);
            console.log(this.networkloading);
        }
    },
    mounted: function() {
        //this.showData();
        this.resizeFunc = _.debounce(this.$refs.network_chart.chart.resize, 500);
        this.resizeFunc();
        this.$parent.$on("resize", this.resizeEvent); 
    },
    watch: {
        deep:true,
        networkdata() {
            //console.log(this.networkdata);
            //console.log(this.networkloading);
            if(!this.networkloading){
                this.resizeFunc();
                this.$refs.network_chart.getData();
                this.$refs.network_chart.create_chart();
               // this.$refs.network_chart.showExist();
                this.showData();
            }
        },
    }
}
</script>