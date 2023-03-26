import React, { useState, useEffect } from 'react';

import classes from './styles/Machines.module.scss';

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
import DetailMachine from './detailMachine/DetailMachine';

import { loadingAcion } from '../../redux/actions/DashboardActions';

import {
    GetListMachineAPI,
    DetailMachineAPI,
} from "../../api/Machine";
import CallApi from "../../functions/CallApi";

const Machines = () => {
    const { enqueueSnackbar } = useSnackbar();
    const history = useNavigate();
    const reduxDispatch = useDispatch();

    const initialState = {
        rows: [],
        columns: [
            {
                field: 'brand',
                headerName: 'برند',
                sortable: false,
            },
            {
                field: 'model',
                headerName: 'مدل',
                sortable: false,
            },
            {
                field: 'hardware_serial',
                headerName: 'سریال سخت افزاری',
                sortable: false,
            },
            {
                field: 'imei',
                headerName: 'کد IMEI',
                sortable: false,
            },
            {
                field: 'status',
                headerName: 'وضعیت',
                sortable: false,
                valueGetter: (params) => {
                    switch (params.row.status) {
                        case 'FRE':
                            return 'آزاد';
                        case 'MNT':
                            return 'نصب شده';
                        case 'DSC':
                            return 'مرخص شده';
                        case 'ASG':
                            return 'واگذاری';
                        default:
                            return '';
                    };
                },
            },
            {
                field: 'psp',
                headerName: 'نام psp',
                sortable: false,
                valueGetter: (params) => `${params.row.psp.name}`,
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
    };

    const [state, setState] = useState(initialState);

    useEffect(() => {
        getListMachineData();
    }, [state.tablePagination.currentPage]);

    const errorHandler = (error) => {
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
    };
    const openDialogHandler = async (isCreate = true, machineID = null) => {
        let newState = { ...state };
        newState.dialog.isOpen = true;
        if (isCreate) {
            newState.dialog.isCreate = true;
        } else {
            newState.dialog.isCreate = false;
            try {
                reduxDispatch(loadingAcion(true));
                let response = await CallApi(DetailMachineAPI(machineID));
                newState.dialog.detailData = response;
            } catch (error) {
                errorHandler(error);
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
        getListMachineData();
    };
    const getListMachineData = async () => {
        try {
            reduxDispatch(loadingAcion(true));
            let response = await CallApi(GetListMachineAPI(state.tablePagination.currentPage + 1));
            setState({
                ...state,
                rows: response?.results,
                tablePagination: {
                    ...state.tablePagination,
                    totalPage: response?.total
                }
            });
        } catch (error) {
            errorHandler(error);
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
                                        مدیریت دستگاه کارتخوان
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        className={classes.addMachineBtn}
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
            <DetailMachine
                isOpen={state.dialog.isOpen}
                handleClose={closeDialogHandler}
                handleCloseUpdate={closeDialogWithUpdateDataHandler}
                isCreate={state.dialog.isCreate}
                detailData={state.dialog.detailData}
            />
        </>
    );
};

export default Machines