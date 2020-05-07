import axios from "axios";

const requests = axios.create({
    baseURL: process.env.publicPath
})

export default {
    fetch_all(tv_name) {
        var meta = this.fetch_meta(tv_name);
        var plots = meta.then(res => (this.fetch_plots(tv_name, res.data)));

        var FPs = meta.then(res => (this.fetch_fps(tv_name, res.data)));

        var word_freq = this.fetch_word_freq(tv_name);
        var actors = this.fetch_actors(tv_name);
        return {
            meta, FPs, word_freq, actors, plots
        };
    },
    fetch_meta(tv_name) {
        return requests.get(`/TVs/${tv_name}/meta.json`);
    },
    fetch_word_freq(tv_name) {
        return requests.get(`/TVs/${tv_name}/word_freq.json`);
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
        return requests.get(`/TVs/${tv_name}/FP_S${season_str}E${episode_str}.json`);
    },
    fetch_actors(tv_name) {
        return requests.get(`/TVs/${tv_name}/actor_list.json`);
    },
    fetch_plot(tv_name, season, episode) {
        var season_str = String(season).padStart(2, "0");
        var episode_str = String(episode).padStart(2, "0");
        return requests.get(`/TVs/${tv_name}/plot_S${season_str}E${episode_str}.txt`);
    },
    fetch_plots(tv_name, meta) {
        var res = meta.episodes.map((ep) => ({
            episode: ep,
            p: this.fetch_plot(tv_name, meta.season, ep)
        }));
        return res;
    }
}