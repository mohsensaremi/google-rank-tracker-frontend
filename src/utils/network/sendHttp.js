import axios from 'axios';

export const sendHttp = (config) => {
    return axios({
        method: "GET",
        ...config,
        url: `${process.env.REACT_APP_API_URL || "/api"}${config.url}`,
    })
        .then(res => res.data)
        .then(data => {
            if (data.status === 200) {
                return data.data;
            } else {
                if (data.error) {
                    throw {
                        kind: "ErrorWithMessage",
                        error: data.error,
                        status: data.status,
                    }
                } else {
                    throw {
                        kind: "Error",
                        status: data.status,
                    }
                }
            }
        });
}