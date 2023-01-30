import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useSnackbar } from 'notistack';

import { logoutAction } from "../../redux/actions/UserActions";


export const ProtectedRoute = ({ children }) => {
    const { enqueueSnackbar } = useSnackbar();
    const history = useNavigate();
    const reduxDispatch = useDispatch();
    const reduxUserData = useSelector(state => state.UserReducer);

    if (!reduxUserData.token) {
        reduxDispatch(logoutAction());
        enqueueSnackbar('لطفا وارد شوید', { variant: 'error' });
        history('/');
    };
    return children;
};
