import { mapState, mapActions, mapMutations } from "vuex";
import githubApi from "../services/github-api";


let githubLoginMixin = {
    methods: {
        github_login() {
            if (this.user.role != "tourist") {
                return;
            }
            this.saveCurrentURL();
            githubApi.redirectAuth();
        },
        saveCurrentURL() {
            const url = this.$router.currentRoute.path;
            sessionStorage.setItem("to", url);
        },
        resumeURL() {
            const url = sessionStorage.getItem("to");
            if (url != null) {
                this.$router.push(url);
                sessionStorage.removeItem("to");
            }
        },
        async handleAuth() {
            const access_token = await githubApi.handleAuth();
            await this.loginUser(access_token);
        }, ...mapActions(["loginUser"]), ...mapMutations(["logout"])
    },
    computed: {
        ...mapState(["user", "access_token"]),
        isLogin() {
            return this.user.role !== "tourist";
        }
    },
}
export default githubLoginMixin;