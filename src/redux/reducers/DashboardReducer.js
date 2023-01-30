import DashboardTypes from '../types/DashboardTypes';

const initialState = {
    loading: false,
};

const DashboardReducer = (state = initialState, action) => {
    switch (action.type) {
        case DashboardTypes.loading:
            return {
                ...state,
                loading: action.isLoading
            };

        default:
            return state;
    };
};

export default DashboardReducer;

