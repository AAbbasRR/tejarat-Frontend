import React from 'react';

import classes from './styles/AccountingLayout.module.scss';

import { useSelector } from "react-redux";

import Navbar from '../../accounting/components/navbar/Navbar';
import Sidebar from '../../accounting/components/sidebar/Sidebar';

import PageLoader from '../../components/loader/PageLoader';


const AccountingLayout = ({ children }) => {
    const reduxDashboardData = useSelector(state => state.DashboardReducer);

    return (
        <>
            <PageLoader isLoading={reduxDashboardData.loading} />
            <div className={classes.main}>
                <Navbar />
                <Sidebar />
                {children}
            </div>
        </>
    );
};

export default AccountingLayout