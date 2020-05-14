import Axios from "axios"

var baseURL = process.env.BASE_URL;
var API_KEY = process.env.VUE_APP_TMDBKEY;

export default {
    fetch(actor_id) {
        return Axios.get(`${baseURL}data_id/${actor_id}.json`);
    },
    pop(b){
        return new Promise((resolve, reject) => {
            Axios.get(`https://tmdbapi.kxxh.workers.dev/3/search/tv?api_key=${API_KEY}&query=${b}&translate=false&language=zh-CN`).then((t)=>{
            var re = t.data.results;
            console.log(re);
            if(re[0] == undefined){
                console.log("0");
                resolve(undefined);
            } else{
                console.log(re[0].vote_average);
                var pop = re[0].vote_average
                resolve(pop);
            }
            }).catch((err) =>{
                reject(err)
            })
        })
    }
}