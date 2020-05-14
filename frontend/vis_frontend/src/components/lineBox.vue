<template>
    <smart-widget :simple="simple" title="折线图">
        <liner ref="liner" />
    </smart-widget>
</template>

<script>
    import liner from "./Liner";
    import _ from "lodash";

    export default {
        components: {
            liner
        },
        props: {
            simple: {
                default: true
            }
        },
        mounted: function() {
            this.resizeFunc = _.debounce(this.$refs.liner.chart.resize, 500);
            this.resizeFunc();
            this.$parent.$on("resized", this.resizeEvent);
        },
        methods: {
            resizeEvent: function() {
                this.resizeFunc();
            }
        }
    };
</script>