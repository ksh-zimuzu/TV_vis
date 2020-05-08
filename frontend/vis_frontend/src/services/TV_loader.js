import axios from "axios";

var baseURL = process.env.BASE_URL;


export default {
    fetch_all(tv_name) {
        var meta = this.fetch_meta(tv_name);
        var plots = meta.then(res => (this.fetch_plots(tv_name, res.data)));

        var FPs = meta.then(res => (this.fetch_fps(tv_name, res.data)));
        //var CPs = meta.then(res => (this.fetch_cps(tv_name, res.data)))
        var roles = this.fetch_roles(tv_name);
        //var word_freq = this.fetch_word_freq(tv_name);
        var actors = this.fetch_actors(tv_name);
        return {
            meta, FPs, roles, actors, plots
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
    }
}