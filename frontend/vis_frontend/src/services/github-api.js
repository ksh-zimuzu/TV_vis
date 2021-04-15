const clientId = "4bbcae3329bde7ed0471";
const githubBaseURL = "https://github.com"
const redirectAuthURL = "/login/oauth/authorize";
const redirectURL = "http://localhost:8080/#/callback";

function redirectAuth() {

    const url = `${githubBaseURL}${redirectAuthURL}?client_id=${clientId}&redirect_uri=${redirectURL}`;
    window.location.href = encodeURI(url);

}

export default {
    redirectAuth
};