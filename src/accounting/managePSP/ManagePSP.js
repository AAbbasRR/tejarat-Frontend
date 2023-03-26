import React, { useState, useEffect } from 'react';

import classes from './styles/ManagePSP.module.scss';

import {
    Grid,
    Paper,
    Card,
    CardContent,
    Typography,
    Divider,
    Button,
} from '@mui/material';

import AddIcon from '@mui/icons-material/Add';

import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useSnackbar } from 'notistack';

import CustomDataGrid from '../components/dataGrid/DataGrid';
import DetailPSP from './detailPSP/DetailPSP';

import { loadingAcion } from '../../redux/actions/DashboardActions';

import {
    GetListPSPAPI,
    DetailPSPAPI,
} from "../../api/PSP";
import CallApi from "../../functions/CallApi";

const ManagePSP = () => {
    const { enqueueSnackbar } = useSnackbar();
    const history = useNavigate();
    const reduxDispatch = useDispatch();


    const [state, setState] = useState({
        rows: [],
        columns: [
            {
                field: 'name',
                headerName: 'نام psp',
                sortable: false,
            },
        ],
        tablePagination: {
            totalPage: 0,
            pageSize: 15,
            currentPage: 0
        },
        dialog: {
            isOpen: false,
            isCreate: true,
            detailData: null
        }
    });

    useEffect(() => {
        getListPSPData();
    }, [state.tablePagination.currentPage]);

    const openDialogHandler = async (isCreate = true, pspID = null) => {
        let newState = { ...state };
        newState.dialog.isOpen = true;
        if (isCreate) {
            newState.dialog.isCreate = true;
        } else {
            newState.dialog.isCreate = false;
            try {
                reduxDispatch(loadingAcion(true));
                let response = await CallApi(DetailPSPAPI(pspID));
                newState.dialog.detailData = response;
            } catch (error) {
                let response = error?.response?.data;
                if (response?.detail) {
                    enqueueSnackbar(response?.detail, { variant: "error" });
                } else if (response?.message) {
                    if (response?.message?.redirect) {
                        enqueueSnackbar(response?.message?.message, { variant: "error" })
                    } else {
                        enqueueSnackbar(response?.message, { variant: "error" })
                    };
                };
                if (response?.redirect && response?.redirect === "True") {
                    history('/panel/dashboard');
                };
            } finally {
                reduxDispatch(loadingAcion(false));
            };
        };
        setState(newState);
    };
    const closeDialogHandler = () => {
        let newState = { ...state };
        newState.dialog.isOpen = false;
        newState.dialog.isCreate = true;
        newState.dialog.detailData = null;
        setState(newState);
    };
    const closeDialogWithUpdateDataHandler = () => {
        closeDialogHandler();
        getListPSPData();
    };
    const getListPSPData = async () => {
        try {
            reduxDispatch(loadingAcion(true));
            let response = await CallApi(GetListPSPAPI(state.tablePagination.currentPage + 1));
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
                    enqueueSnackbar(response?.message?.message, { variant: "error" })
                } else {
                    enqueueSnackbar(response?.message, { variant: "error" })
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
        <>
            <Grid container direction="column" spacing={2}>
                <Grid item xs={12}>
                    <Paper elevation={2}>
                        <Card>
                            <CardContent>
                                <div className={classes.cardHeader}>
                                    <Typography variant="subtitle1" align="right" className={`subtitle`}>
                                        مدیریت psp
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        className={classes.addPSPBtn}
                                        onClick={openDialogHandler}
                                    >
                                        اضافه کردن <AddIcon
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
                                    onRowClick={(rowData) => openDialogHandler(false, rowData.id)}
                                />
                            </CardContent>
                        </Card>
                    </Paper>
                </Grid>
            </Grid >
            <DetailPSP
                isOpen={state.dialog.isOpen}
                handleClose={closeDialogHandler}
                handleCloseUpdate={closeDialogWithUpdateDataHandler}
                isCreate={state.dialog.isCreate}
                detailData={state.dialog.detailData}
            />
        </>
    );
};

export default ManagePSP