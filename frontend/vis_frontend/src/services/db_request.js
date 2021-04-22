import axios from "axios";

const CREATE_TV_URL = "https://add_tv.kxxh.workers.dev/";

class NotLoginError extends Error { }

class KeyError extends Error { }

async function createTVShowRecord(access_token, tv_instance) {
    const payload = tv_instance.toString();
    try {
        await axios.post(CREATE_TV_URL, {
            key: tv_instance.id,
            payload,
            access_token
        });
    } catch (e) {
        if (e.response) {
            switch (e.response.status) {
                case 401: throw new NotLoginError();
                case 403: throw new KeyError();
            }
        }
        throw e;
    }

}

export { createTVShowRecord, NotLoginError, KeyError };