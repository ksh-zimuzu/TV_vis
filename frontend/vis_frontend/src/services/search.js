import algoliasearch from "algoliasearch";
const client = algoliasearch(process.env.VUE_APP_ALGOLIA_ID, process.env.VUE_APP_ALGOLIA_KEY);
const index = client.initIndex('prod_TV_vis');
export default {
    search: index.search
}