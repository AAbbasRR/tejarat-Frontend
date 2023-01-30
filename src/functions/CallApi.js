import axios from 'axios';

import store from '../redux/Store';

const CallApi = ({ headers, token = false, ...options }) => {
    let { UserReducer: reduxUserData } = store.getState();

    const promise = new Promise(async (resolve, reject) => {
        try {
            const res = await axios({
                timeout: 15000,
                headers: token ? { ...headers, Authorization: `Token ${reduxUserData.token}` } : { ...headers },
                ...options,
            });
            resolve(res.data);
        } catch (error) {
            reject(error);
        };
    });

    return promise;
};

export default CallApi;