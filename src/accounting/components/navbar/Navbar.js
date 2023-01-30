import React from 'react';

import classes from './styles/Navbar.module.scss';

import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';

import LogoutIcon from '@mui/icons-material/Logout';
import WebIcon from '@mui/icons-material/Web';

import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { logoutAction } from '../../../redux/actions/UserActions';

const Navbar = () => {
    const reduxDispatch = useDispatch();
    const history = useNavigate();

    const logoutClickHandler = () => {
        reduxDispatch(logoutAction());
        history('/');
    };

    return (
        <AppBar className={classes.navbar}>
            <div className={classes.tollBar}>
                <div onClick={logoutClickHandler}>
                    <Typography className={`link ${classes.menuToolItem} ${classes.menuItem}`}>
                        <LogoutIcon fontSize="small" className={classes.iconItem} />
                        خروج
                    </Typography>
                </div>
            </div>
        </AppBar>
    );
};

export default Navbar