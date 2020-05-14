<template>
    <smart-widget title="国家选择" >
        <div class="d-flex flex-column">
            <v-btn color='#799800' small style="margin-top:10px" @click="getCountry('中国')">
                <font color='#ffffff'>中国</font>
            </v-btn>
            <v-btn color='#0c4e00' small style="margin-top:10px" @click="getCountry('美国')">
                <font color='#ffffff'>美国</font>
            </v-btn>
            <v-btn color='#296000' small style="margin-top:10px" @click="getCountry('英国')">
                <font color='#ffffff'>英国</font>
            </v-btn>
            <v-btn color='#457200' small style="margin-top:10px" @click="getCountry('日本')">
                <font color='#ffffff'>日本</font>
            </v-btn>
            <v-btn color='#91ab00' small style="margin-top:10px" @click="getCountry('韩国')">
                <font color='#ffffff'>韩国</font>
            </v-btn>
        </div>
    </smart-widget>
</template>

<script>

    export default {
        components: {
            //mapButtons
        },
        methods: {
            getCountry: function (val) {
                switch (val) {
                    case '中国':
                        this.$EventBus.$emit('getCountry', '中国')
                        //this.$emit('getCountry', 'China')
                        break;
                    case '美国':
                        this.$EventBus.$emit('getCountry', '美国')
                        break;
                    case '英国':
                        this.$EventBus.$emit('getCountry', '英国')
                        break;
                    case '日本':
                        this.$EventBus.$emit('getCountry', '日本')
                        break;
                    case '韩国':
                        this.$EventBus.$emit('getCountry', '韩国')
                        break;
                }
            }
        }
    };
</script>