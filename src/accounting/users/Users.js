import React, { useState, useEffect } from 'react';

import classes from './styles/Users.module.scss';

import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';

import PersonAddIcon from '@mui/icons-material/PersonAdd';

import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useSnackbar } from 'notistack';

import CustomDataGrid from '../components/dataGrid/DataGrid';

import { loadingAcion } from '../../redux/actions/DashboardActions';

import { GetListUsersAPI } from "../../api/Users";
import CallApi from "../../functions/CallApi";

const Users = () => {
    const { enqueueSnackbar } = useSnackbar();
    const history = useNavigate();
    const reduxDispatch = useDispatch();


    const [state, setState] = useState({
        rows: [],
        columns: [
            {
                field: 'name',
                headerName: 'نام',
                sortable: false,
                valueGetter: (params) => `${params.row.first_name || ''} ${params.row.last_name || ''}`,
                width: 250
            },
            {
                field: 'email',
                headerName: 'ایمیل',
                width: 300
            },
            {
                field: 'mobile_number',
                headerName: 'شماره موبایل',
                width: 150
            },
            {
                field: 'national_id',
                headerName: 'کد ملی',
                width: 150
            },
            {
                field: 'position',
                headerName: 'مقام',
                valueGetter: (params) => {
                    switch (params.row.position) {
                        case 'CEO':
                            return 'مدیرعامل';
                        case 'EXP':
                            return 'کارشناس';
                        case 'STK':
                            return 'انباردار';
                        case 'AGN':
                            return 'نماینده';
                        case 'SUP':
                            return 'پشتیبان';
                        default:
                            return '';
                    };
                },
            },
        ],
        tablePagination: {
            totalPage: 0,
            pageSize: 15,
            currentPage: 0
        }
    });

    useEffect(() => {
        getUserData();
    }, [state.tablePagination.currentPage]);

    const getUserData = async () => {
        reduxDispatch(loadingAcion(true));
        try {
            let response = await CallApi(GetListUsersAPI(state.tablePagination.currentPage + 1));
            setState({
                ...state,
                rows: response?.results,
                tablePagination: {
                    ...state.tablePagination,
                    totalPage: response?.total
                }
            });
        } catch (error) {
            let response = error?.response?.data;
            if (response?.detail) {
                enqueueSnackbar(response?.detail, { variant: "error" });
            } else if (response?.message) {
                if (response?.message?.redirect) {
                    enqueueSnackbar(response?.message?.message, { variant: "error" });
                } else {
                    enqueueSnackbar(response?.message, { variant: "error" });
                };
            };
            if (response?.redirect && response?.redirect === "True") {
                history('/panel/dashboard');
            };
        } finally {
            reduxDispatch(loadingAcion(false));
        };
    };
    return (
        <Grid container direction="column" spacing={2}>
            <Grid item xs={12}>
                <Paper elevation={2}>
                    <Card>
                        <CardContent>
                            <div className={classes.cardHeader}>
                                <Typography variant="subtitle1" align="right" className={`subtitle`}>
                                    مدیریت کاربران
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="success"
                                    className={classes.addUserBtn}
                                    onClick={() => history({
                                        pathname: `/panel/users/userDetail`,
                                        search: `?createUser=${true}`
                                    })}
                                >
                                    اضافه کردن <PersonAddIcon
                                        fontSize='small'
                                        sx={{
                                            marginRight: '5px'
                                        }} />
                                </Button>
                            </div>
                            <Divider />
                            <CustomDataGrid
                                rows={state.rows}
                                columns={state.columns}
                                totalPage={state.tablePagination.totalPage}
                                pageSize={state.tablePagination.pageSize}
                                currentPage={state.tablePagination.currentPage}
                                onPageChange={(newPage) => setState({ ...state, tablePagination: { ...state.tablePagination, currentPage: newPage } })}
                                onRowClick={(rowData) => history({
                                    pathname: `/panel/users/userDetail`,
                                    search: `?userID=${rowData.id}`
                                })}
                            />
                        </CardContent>
                    </Card>
                </Paper>
            </Grid>
        </Grid >
    );
};

export default Users