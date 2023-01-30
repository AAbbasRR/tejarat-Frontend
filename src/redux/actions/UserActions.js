import UserTypes from '../types/UserTypes';

export const loginAction = (result) => {
    return {
        type: UserTypes.login,
        result,
    };
};

export const logoutAction = () => {
    return {
        type: UserTypes.logout,
    };
};
