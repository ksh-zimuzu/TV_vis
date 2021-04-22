import githubApi from "../services/github-api";

const TOURIST = "tourist";

export default {
    state: {
        title: "",
        subtitle: "",
        access_token: null,
        user: {
            login: "",
            avatar_url: "",
            role: TOURIST,
        }
    },
    mutations: {
        setTitle(state, title) {
            state.title = title;
        },
        setSubtitle(state, subtitle) {
            state.subtitle = subtitle;
        },
        logout(state) {
            state.user.login = state.user.avatar_url = "";
            state.user.role = TOURIST;
            state.access_token = null
        },
        setAccessToken(state, access_token) {
            state.access_token = access_token;
        },
        setUser(state, user) {
            state.user.login = user.login;
            state.user.avatar_url = user.avatar_url;
            state.user.role = user.role || TOURIST;
        }
    },
    actions: {
        async loginUser(context, access_token) {
            context.commit("logout");
            context.commit("setAccessToken", access_token);
            const userData = await githubApi.getUser(access_token);
            context.commit("setUser", userData);
        }
    }
}