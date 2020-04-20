import api from "./requests";

var requests = api.buildRequests();

export default {
    fetch_people_info(id) {
        return requests.get(`/person/${id}`);
    },
}