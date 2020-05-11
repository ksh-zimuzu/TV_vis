import axios from "axios";
var baseURL = process.env.BASE_URL;

export default {
    fetch_actor_network_data(){
        return axios.get(`${baseURL}actor_network2.json`);
    }
}