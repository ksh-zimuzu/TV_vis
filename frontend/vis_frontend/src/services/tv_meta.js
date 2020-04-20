import api from "./requests";

var requests = api.buildRequests();

export default {
    fetch_episode_info(tv_id, season_number, episode_number) {
        return requests.get(`/tv/${tv_id}/season/${season_number}/episode/${episode_number}`);
    },
    fetch_season_info(tv_id, season_number) {
        return requests.get(`/tv/${tv_id}/season/${season_number}`);
    },
    fetch_info(tv_id) {
        return requests.get(`/tv/${tv_id}`);
    }
}