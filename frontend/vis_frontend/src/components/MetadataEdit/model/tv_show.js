import tmdb_api from "@/services/tv_meta";
import { Role } from "./role";
import _ from "lodash";
import Episode from "./episode";

class Cast {
    constructor(id, name, original_name) {
        this.id = id;
        this.name = name;
        this.original_name = original_name;
    }

    toJSON() {
        return this;
    }
}

class Season {
    constructor(season_number, name, episode_count, overview, poster_path) {
        this.season_number = season_number;
        this.name = name;
        this.episode_count = episode_count;
        this.overview = overview;
        this.poster_path = poster_path;
    }

    toString() {
        return this.season_number;
    }
}

class TV_Show {
    season = 1;
    episodes = [];
    seasons = {};
    seasonCount = 0;
    name = "";
    actors = [];  //list of Cast.之所以不叫casts是历史遗留问题
    ratings = {
        "imDb": 0,
        "metacritic": 0,
        "theMovieDb": 0,
        "rottenTomatoes": 0
    };
    roles = [];   //list of Role.
    loading = false;
    loaded = false;
    poster_path = "";
    constructor(id) {
        this.id = id;
    }

    async fetch_info_by_id() {
        this.loading = true;
        //获取tv detail
        let res = await tmdb_api.fetch_info(this.id);
        let { name, seasons, vote_average, poster_path } = res.data;
        this.name = name;
        this.seasonCount = seasons.length;
        this.seasons = _.fromPairs(
            _.map(seasons, item => [
                item.season_number,
                _.assign(new Season(), item)
            ])
        );
        this.ratings.theMovieDb = vote_average;
        this.loading = false;
        this.poster_path = poster_path;
        this.fetch_cast();
        this.loaded = true;
    }

    set_season(season) {
        this.season = season;
        const episode_nums = _.range(1, this.seasons[season].episode_count + 1);
        this.episodes = episode_nums.map(item => new Episode(item));
    }

    async fetch_cast() {
        this.loading = true;
        let res = await tmdb_api.fetch_cast(this.id);
        let { cast } = res.data;
        this.actors = cast.map(item => new Cast(item.id, item.character, item.original_name));
        this.roles = cast.map(item => new Role(item.character));
        this.loading = false;
    }

    toString() {
        let roles = _.assign({}, ...this.roles.map(item => item.toJSON()));
        let episodes = this.episodes.map(item => item.toString());
        let season = this.season;
        let actors = this.actors.map(item => item.toJSON());
        const meta = {
            tv_id: this.id,
            season, episodes
        };
        let episode_records = this.episodes.map(item => item.toJSON());
        const tv = {
            episodes: episode_records,
            meta,
            name: this.name,
            actors,
            rating: this.ratings,
            roles
        }
        return JSON.stringify(tv);
    }
}

export { TV_Show, Cast };