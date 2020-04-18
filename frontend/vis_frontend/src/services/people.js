import axios from "axios";

var API_KEY = process.env.VUE_APP_TMDBKEY;
var requests = axios.create({
    //预先配置API端点
    baseURL: "https://api.themoviedb.org/3/",
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

export default {
    fetch_people_info(id) {
        return requests.get(`/person/${id}`);
    },
}