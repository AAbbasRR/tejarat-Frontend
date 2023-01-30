import { combineReducers } from 'redux';

import UserReducer from './UserReducer';
import DashboardReducer from './DashboardReducer';

const rootReducer = combineReducers({
    UserReducer,
    DashboardReducer,
});

export default rootReducer;
