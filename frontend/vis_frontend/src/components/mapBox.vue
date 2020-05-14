<template>
    <smart-widget :simple="simple" title="地图">
        <worldMap ref="worldMap" />
    </smart-widget>
</template>

<script>
    import worldMap from "./worldMap";
    import _ from "lodash";

    export default {
        components: {
            worldMap
        },
        props: {
            simple: {
                default: true
            }
        },
        mounted: function() {
            //防抖动，降低重绘开销，500ms
            this.resizeFunc = _.debounce(this.$refs.worldMap.chart.resize, 500);
            this.resizeFunc(); //绘制完成后修改一下尺寸
            this.$parent.$on("resized", this.resizeEvent); //接收外层resize事件
            this.$parent.$on("container-resized", this.resizeEvent);
        },
        methods: {
            resizeEvent: function() {
                this.resizeFunc();
            }
        }
    };
</script>