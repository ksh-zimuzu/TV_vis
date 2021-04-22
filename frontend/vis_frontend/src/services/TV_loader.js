import axios from "axios";
import _ from "lodash";

var baseURL = process.env.BASE_URL;
const read_api_url = "https://tv.kxxh.workers.dev/";
const LIST_MAIN_URL = "https://list_main.kxxh.workers.dev/";

export default {
    async fetch_all(tv_id) {

        let tv_info = await axios.get(
            read_api_url + tv_id
        );
        let meta = tv_info.data.meta;
        let plots = tv_info.data.episodes.map(item => item.plot);
        let FPs = _.fromPairs(tv_info.data.episodes.map((item, ep) => [ep + 1, item.FP]));
        let roles = tv_info.data.roles;
        let actors = tv_info.data.actors;
        let ratings = tv_info.data.rating;
        let popularity = await this.fetch_popularity(meta);
        let name = tv_info.data.name

        // var meta = this.fetch_meta(tv_name);
        // var plots = meta.then(res => (this.fetch_plots(tv_name, res.data)));
        // var FPs = meta.then(res => (this.fetch_fps(tv_name, res.data)));
        // var popularity = meta.then(res => this.fetch_popularity(res.data));
        // //var imdbId = meta.then(res => (tv_meta.fetch_external_id(res.data.tv_id)));
        // //var CPs = meta.then(res => (this.fetch_cps(tv_name, res.data)))
        // var roles = this.fetch_roles(tv_name);
        // //var word_freq = this.fetch_word_freq(tv_name);
        // var actors = this.fetch_actors(tv_name);
        // var ratings = this.fetch_rating(tv_name);

        return {
            meta, FPs, roles, actors, plots, ratings, popularity, name
        };
    },
    fetch_meta(tv_name) {
        return axios.get(`${baseURL}TVs/${tv_name}/meta.json`);
    },
    fetch_word_freq(tv_name) {
        return axios.get(`${baseURL}TVs/${tv_name}/word_freq.json`);
    },
    fetch_fps(tv_name, meta) {
        var res = meta.episodes.map((ep) => ({
            episode: ep,
            p: this.fetch_fp(tv_name, meta.season, ep)
        }));
        return res;
    },
    fetch_fp(tv_name, season, episode) {
        var season_str = String(season).padStart(2, "0");
        var episode_str = String(episode).padStart(2, "0");
        return axios.get(`${baseURL}TVs/${tv_name}/FP_S${season_str}E${episode_str}.json`);
    },
    fetch_cps(tv_name, meta) {
        var res = meta.episodes.map((ep) => ({
            episode: ep,
            p: this.fetch_cp(tv_name, meta.season, ep)
        }));
        return res;
    },
    fetch_cp(tv_name, season, episode) {
        var season_str = String(season).padStart(2, "0");
        var episode_str = String(episode).padStart(2, "0");
        return axios.get(`${baseURL}TVs/${tv_name}/CP_S${season_str}E${episode_str}.json`);
    },
    fetch_actors(tv_name) {
        return axios.get(`${baseURL}TVs/${tv_name}/actor_list.json`);
    },
    fetch_plot(tv_name, season, episode) {
        var season_str = String(season).padStart(2, "0");
        var episode_str = String(episode).padStart(2, "0");
        return axios.get(`${baseURL}TVs/${tv_name}/plot_S${season_str}E${episode_str}.txt`);
    },
    fetch_plots(tv_name, meta) {
        var res = meta.episodes.map((ep) => ({
            episode: ep,
            p: this.fetch_plot(tv_name, meta.season, ep)
        }));
        return res;
    },
    fetch_roles(tv_name) {
        return axios.get(`${baseURL}TVs/${tv_name}/roles.json`);
    },
    fetch_rating(tv_name) {
        return axios.get(`${baseURL}TVs/${tv_name}/ratings.json`);
    },
    fetch_popularity(meta) {
        return axios.get(`https://tmdb.kxxh.workers.dev/tv/${meta.tv_id}/remote/popularity?translate=false&language=zh-CN`);
    },
    async exists(tv_id) {
        let res = await axios.head(read_api_url + tv_id, {
            validateStatus: status => (status == 200 || status == 404)
        });
        return res.status !== 404;
    },
    async list_main() {
        let res = await axios.get(LIST_MAIN_URL);
        return res.data.tv_ids;
    }
}