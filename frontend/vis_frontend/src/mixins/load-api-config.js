import api_config from "../services/tmdb_api_config";
import _ from "lodash";

let loadApiCfgMixin = {
    data: () => ({
        api_config: {
            base_url: "http://image.tmdb.org/t/p/",
            backdrop_sizes: [],
            logo_sizes: [],
            poster_sizes: [],
            profile_sizes: [],
            still_sizes: []
        }
    }),
    created: async function () {
        let config = await api_config.getApiConfig();
        const imageCfg = _.mapValues(config.images, (item) => {
            if (item instanceof Array) {
                return _.sortBy(item, item => parseInt(item.slice(1)))
            }
            else {
                return item;
            }
        });
        _.assign(this.api_config, imageCfg);
    },
    computed: {
        thumbnail_url: function () {
            return this.api_config.base_url + (this.api_config.poster_sizes[0] || "w92");
        },
        large_url: function () {
            let poster_sizes = this.api_config.poster_sizes;
            return this.api_config.base_url + (poster_sizes[poster_sizes.length - 1] || "original");
        },
        mid_url: function () {
            let poster_sizes = this.api_config.poster_sizes;
            return this.api_config.base_url + (poster_sizes[poster_sizes.length >> 1] || "w342");
        }
    }
}

export default loadApiCfgMixin;