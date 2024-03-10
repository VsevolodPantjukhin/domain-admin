import axios from "axios";
let fp = null;


const refreshAccessToken = async (rt) => {
    return await axios.post(window.url + "auth/refresh-tokens", { "refreshToken": rt }, {
        // withCredentials: true,
        authFree: true,
    }).then(res => {
        if (res.status !== 200) {
            logOut()
        } else {
            localStorage.setItem("access", res.data.access.token);
            localStorage.setItem("access_expires", res.data.access.expires);
            localStorage.setItem("refresh", res.data.refresh.token);
            localStorage.setItem("refresh_expires", res.data.refresh.expires);
            axios.defaults.headers.common['Authorization'] = "bearer " + res.data.access.token;
            return res.data.access.token;
        }
    })
}

function resolveRefresh(r, f, u) {
    fp = new Promise(async (resolve) => {
        const result = await refreshAccessToken(r, f, u);
        resolve(result);
    });
    return fp;
}

export const logOut = () => {
    localStorage.clear()
    window.location.replace("/login")
}

const getAccess = () => localStorage.getItem("access");
const getRefresh = () => localStorage.getItem("refresh");

axios.interceptors.request.use(
    async function (config) {
        if (config.authFree) {
            return config;
        }
        if ((!getAccess() && !getRefresh())) {
            logOut();
        } else if (!getAccess() && getRefresh()) {
            try {
                if (fp != null) {
                    return fp.then((n) => {
                        config.headers.Authorization = "bearer " + n;
                        return config;
                    });
                } else {
                    const access = await resolveRefresh(
                        getRefresh(),
                        fp
                    );
                    config.headers.Authorization = "bearer " + access;
                    fp = null;
                }
            } catch (e) {
                logOut();
            }
        } else if (getAccess()) {
            config.headers.Authorization = "bearer " + getAccess()
        }
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

axios.interceptors.response.use(
    (response) => {
        return response;
    },
    function (error) {
        if (error.response.config.authFree) {
            return Promise.reject(error.response);
        }
        if (error.response.status === 401 || error.response.status === 403) {
            logOut();
        }
        return Promise.reject(error.response);
    }
);

export default axios;

