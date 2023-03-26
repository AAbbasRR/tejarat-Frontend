import React, { useState } from 'react';

import classes from './styles/Sidebar.module.scss';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HubIcon from '@mui/icons-material/Hub';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';

import PersonIcon from '@mui/icons-material/Person';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import PeopleIcon from '@mui/icons-material/People';

import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';

import SidebarNavItem from '../sidebarNavItem/SidebarNavItem';

const Sidebar = () => {
    const reduxUserData = useSelector(state => state.UserReducer);
    const history = useNavigate();
    let router = useLocation();

    const items = [
        {
            title: "داشبورد",
            link: "/panel/dashboard",
            icon: (<DashboardIcon fontSize="small" />)
        },
        {
            title: "مدیریت انبار",
            link: "/panel/store",
            icon: (<InventoryIcon fontSize="small" />)
        },
        {
            title: "مدیریت کاربران",
            link: "/panel/users",
            icon: (<PeopleIcon fontSize="small" />)
        },
        {
            title: "مدیریت psp",
            link: "/panel/managePSP",
            icon: (<HubIcon fontSize="small" />)
        },
        {
            title: "مدیریت دستگاه",
            link: "/panel/machines",
            icon: (<PointOfSaleIcon fontSize="small" />)
        },
    ];

    const [value, setValue] = useState(router.pathname);

    return (
        <>
            <Box className={classes.sidebar}>
                <div className={classes.header}>
                    <PersonIcon className={classes.accountIcon} fontSize="large" />
                    <Typography variant="subtitle1" className={`subtitle ${classes.text}`}>
                        {reduxUserData.first_name} {reduxUserData.last_name}
                    </Typography>
                </div>
                <div className={classes.sidebarMenu}>
                    {items.map((item, index) => (
                        <SidebarNavItem key={`dashboardSideItem_${index}`} title={item.title} icon={item.icon} link={item.link} badge={item?.badge} />
                    ))}
                </div>
            </Box>
            <Box className={classes.bottomNavigationBox}>
                <BottomNavigation
                    showLabels
                    value={value}
                    onChange={(event, newValue) => {
                        history(newValue);
                    }}
                    className={classes.bottomNavigation}
                >
                    {items.map((item, index) => (
                        <BottomNavigationAction className={`${classes.bottomNavigationAction} ${item.link === value && classes.activeNavigationAction}`} key={`dashboardSideItem_${index}`} label={item.title} icon={item.icon} value={item.link} />
                    ))}
                </BottomNavigation>
            </Box>
        </>
    );
};

export default Sidebar