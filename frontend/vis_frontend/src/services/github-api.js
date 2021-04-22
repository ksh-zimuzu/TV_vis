import qs from "qs";
import axios from "axios";

const client_id = "4bbcae3329bde7ed0471";
const githubBaseURL = "https://github.com"
const githubAPIBaseURL = "https://api.github.com";
const redirectAuthURL = "/login/oauth/authorize";
const getTokenURL = "/login/oauth/access_token";
const redirectURL = "http://localhost:8080/callback";
const client_secret = "91ac995bf3bcb860b867aed77cfa799b432014c5";
const cors_free = {
    "http:": "https://cors-free-http.kxxh.workers.dev/",
    "https:": "https://cors-free.kxxh.workers.dev/"
}
const scope = "read:org";

var cors_free_client = axios.create();
cors_free_client.interceptors.request.use(function (config) {
    let url = new URL(config.url);
    let new_url = cors_free[url.protocol] + url.hostname + url.pathname;
    config.url = new_url;
    return config;
})

//参考自：https://github.com/meteorlxy/vssue/blob/master/packages/@vssue/api-github-v3/src/index.ts

function redirectAuth() {
    const url = `${githubBaseURL}${redirectAuthURL}?client_id=${client_id}&redirect_uri=${redirectURL}&scope=${scope}`
    window.location.href = encodeURI(url);
}

async function handleAuth() {
    const searchStr = window.location.search;
    const query = qs.parse(searchStr.slice(1));
    if (query.code == null) {
        return null;
    }
    const payload = {
        client_id, client_secret, code: query.code
    };
    const url = githubBaseURL + getTokenURL;
    const res = await cors_free_client.post(url, payload, { headers: { accept: "application/json" } });
    console.log(res);
    return res.data.access_token;
}

async function getUser(access_token) {
    const url = githubAPIBaseURL + "/user";
    //cors_free_client.defaults.headers.common['Authorization'] = "token " + access_token;
    const res = await cors_free_client.get(url, { headers: { Authorization: "token " + access_token } });
    return res.data;
}


export default {
    redirectAuth, handleAuth, getUser
};