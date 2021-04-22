import axios from "axios";

const API_KEY = process.env.VUE_APP_TMDBKEY;

const CONFIG_URL = "https://api.themoviedb.org/3/configuration";

let api_config = null;

async function getApiConfig() {
    if (api_config != null) {
        return api_config
    }

    let config = await axios.get(CONFIG_URL, {
        params: {
            api_key: API_KEY
        }
    });

    api_config = config.data;
    return api_config;

}

export default { getApiConfig };