import axios from "axios";

var API_KEY = process.env.VUE_APP_TMDBKEY;

var ENABLE_CLOUDFLARE = true;

export default {
    buildRequests() {
        var requests = axios.create({
            //预先配置API端点
            baseURL: ENABLE_CLOUDFLARE ? "https://tmdbapi.kxxh.workers.dev/3/" : "https://api.themoviedb.org/3/",
        });
        requests.interceptors.request.use(
            function (config) {
                //将API密钥和语言设定注入到请求中
                var defaultConfig = {
                    api_key: API_KEY,
                    language: "zh-CN"
                };
                config.params = Object.assign(defaultConfig, config.params);
                return config;
            },
            function (error) {
                return Promise.reject(error);
            }
        );
        return requests;
    },
}