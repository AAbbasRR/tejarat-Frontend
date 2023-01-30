import UserTypes from '../types/UserTypes';

const initialState = {
    mobile_number: null,
    email: null,
    national_id: null,
    profile_image: null,
    position: null,
    first_name: null,
    last_name: null,
    token: null,
};

const UserReducer = (state = initialState, action) => {
    switch (action.type) {
        case UserTypes.login:
            return {
                ...state,
                mobile_number: action.result.mobile_number,
                email: action.result.email,
                national_id: action.result.national_id,
                profile_image: action.result.profile_image,
                position: action.result.position,
                first_name: action.result.first_name,
                last_name: action.result.last_name,
                token: action.result.token,
            };

        case UserTypes.logout:
            return initialState;

        default:
            return state;
    };
};

export default UserReducer;

