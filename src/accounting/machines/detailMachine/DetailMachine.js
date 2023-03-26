import React, { useState, useEffect } from 'react';

import classes from './styles/DetailMachine.module.scss';

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    TextField,
    IconButton,
    Grid,
    FormControl,
    InputLabel,
    NativeSelect,
    FormHelperText
} from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';

import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import * as yup from 'yup';

import RightToLeftLayout from '../../../layouts/rightToLeft/RightToLeftLayout';

import { loadingAcion } from '../../../redux/actions/DashboardActions';

import {
    CreateMachineAPI,
    UpdateMachineAPI,
    DeleteMachineAPI
} from '../../../api/Machine';
import {
    GetListAllPSPAPI
} from '../../../api/PSP';
import CallApi from "../../../functions/CallApi";

const DetailMachine = ({ isOpen, handleClose, handleCloseUpdate, isCreate = true, detailData = null }) => {
    const { enqueueSnackbar } = useSnackbar();
    const reduxDispatch = useDispatch();
    const reduxDashboardData = useSelector(state => state.DashboardReducer);

    const initialState = {
        machineData: {},
        pspData: [],
        errors: {
            brand: {
                error: false,
                error_message: ''
            },
            model: {
                error: false,
                error_message: ''
            },
            hardware_serial: {
                error: false,
                error_message: ''
            },
            imei: {
                error: false,
                error_message: ''
            },
            status: {
                error: false,
                error_message: ''
            },
            psp: {
                error: false,
                error_message: ''
            },
        }
    };

    const [state, setState] = useState(initialState);

    useEffect(() => {
        getPSPListData();
    }, [])

    useEffect(() => {
        if (!isCreate) {
            setState({
                ...state,
                machineData: detailData
            });
        };
    }, [isCreate, detailData]);

    const resetState = () => setState(initialState);
    const getPSPListData = async () => {
        try {
            reduxDispatch(loadingAcion(true));
            let result = await CallApi(GetListAllPSPAPI());
            setState({ ...state, pspData: result });
        } catch (error) {
            manageErrorsHandler(error);
        } finally {
            reduxDispatch(loadingAcion(false));
        };
    };
    const closeDialogHandler = (needUpdate = false) => {
        resetState();
        if (needUpdate) {
            handleCloseUpdate();
        } else {
            handleClose()
        };
    };
    const formInputChangeHandler = (event, fieldName) => {
        let newState = { ...state };
        newState.machineData[fieldName] = event.target.value;
        newState.errors[fieldName].error = false;
        newState.errors[fieldName].error_message = '';
        setState({ ...newState });
    };
    const manageErrorsHandler = (error) => {
        let response = error?.response?.data;
        if (response?.detail) {
            enqueueSnackbar(response?.detail, { variant: "error" });
        } else if (response?.message) {
            if (response?.message?.redirect) {
                enqueueSnackbar(response?.message?.message, { variant: "error" })
            } else {
                enqueueSnackbar(response?.message, { variant: "error" })
            };
        } else {
            let newState = { ...state };
            Object.keys(response).forEach(key => {
                newState.errors[key].error = true;
                newState.errors[key].error_message = response[key][0];
            });
            setState({ ...newState });
        };
    };
    const formMachineSubmit = async () => {
        let isFormValid = await formMachineValidation();
        if (isFormValid) {
            if (isCreate) {
                proccessCreateMachineHandler();
            } else {
                proccessUpdateMachineHandler();
            };
        };
    }
    const formMachineValidation = async () => {
        let schema = yup.object().shape({
            brand: yup.string().required({
                field: "brand",
                message: "برند نباید خالی باشد"
            }),
            model: yup.string().required({
                field: "model",
                message: "مدل نباید خالی باشد"
            }),
            hardware_serial: yup.string().required({
                field: "hardware_serial",
                message: "سریال سخت افزاری نباید خالی باشد"
            }),
            imei: yup.string().required({
                field: "imei",
                message: "کد IMEI نباید خالی باشد"
            }),
            status: yup.string().required({
                field: "status",
                message: "وضعیت دستگاه نباید خالی باشد"
            }),
            psp: yup.string().required({
                field: "psp",
                message: "نام psp نباید خالی باشد"
            }),
        });
        try {
            await schema.validate({
                brand: state.machineData?.brand,
                model: state.machineData?.model,
                hardware_serial: state.machineData?.hardware_serial,
                imei: state.machineData?.imei,
                status: state.machineData?.status,
                psp: state.machineData?.psp,
            }, { abortEarly: false });
            return true;
        } catch (error) {
            let newState = { ...state };
            error.errors.map((item) => {
                newState.errors[item.field].error = true;
                newState.errors[item.field].error_message = item.message;
            });
            setState({ ...newState });
            return false;
        };
    };
    const proccessRemoveMachineHandler = async () => {
        try {
            reduxDispatch(loadingAcion(true));
            await CallApi(DeleteMachineAPI(state.machineData.id));
            enqueueSnackbar('با موفقیت حذف شد', { variant: "success" });
            closeDialogHandler(true);
        } catch (error) {
            manageErrorsHandler(error);
        } finally {
            reduxDispatch(loadingAcion(false));
        };
    };
    const proccessCreateMachineHandler = async () => {
        try {
            reduxDispatch(loadingAcion(true));
            await CallApi(CreateMachineAPI(state.machineData));
            enqueueSnackbar('با موفقیت ایجاد شد', { variant: "success" });
            closeDialogHandler(true);
        } catch (error) {
            manageErrorsHandler(error);
        } finally {
            reduxDispatch(loadingAcion(false));
        };
    };
    const proccessUpdateMachineHandler = async () => {
        try {
            reduxDispatch(loadingAcion(true));
            await CallApi(UpdateMachineAPI(state.machineData.id, state.machineData));
            enqueueSnackbar('با موفقیت ویرایش شد', { variant: "success" });
            handleCloseUpdate(true);
        } catch (error) {
            manageErrorsHandler(error);
        } finally {
            reduxDispatch(loadingAcion(false));
        };
    };

    return (
        <Dialog
            open={isOpen}
            onClose={handleClose}
            aria-describedby="alert-dialog-slide-description"
            fullWidth
            keepMounted
        >
            <DialogTitle>
                {isCreate ? "ایجاد دستگاه" : "ویرایش دستگاه"}
                <IconButton
                    aria-label="close"
                    className={classes.dialogCloseIcon}
                    onClick={handleClose}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <RightToLeftLayout>
                    <Grid container direction="row" spacing={2}>
                        <Grid item xs={6}>
                            <TextField
                                className={`${classes.required}`}
                                onChange={(e) => formInputChangeHandler(e, 'brand')}
                                value={state.machineData?.brand || ''}
                                label="برند"
                                fullWidth
                                variant="standard"
                                id="machinebrand-input"
                                name='machinebrand-input'
                                error={state.errors.brand.error}
                                helperText={state.errors.brand.error_message}
                                disabled={reduxDashboardData.loading}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                className={`${classes.required}`}
                                onChange={(e) => formInputChangeHandler(e, 'model')}
                                value={state.machineData?.model || ''}
                                label="مدل"
                                fullWidth
                                variant="standard"
                                id="machinemodel-input"
                                name='machinemodel-input'
                                error={state.errors.model.error}
                                helperText={state.errors.model.error_message}
                                disabled={reduxDashboardData.loading}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                className={`${classes.required}`}
                                onChange={(e) => formInputChangeHandler(e, 'hardware_serial')}
                                value={state.machineData?.hardware_serial || ''}
                                label="سریال سخت افزاری"
                                fullWidth
                                variant="standard"
                                id="machinehardware_serial-input"
                                name='machinehardware_serial-input'
                                error={state.errors.hardware_serial.error}
                                helperText={state.errors.hardware_serial.error_message}
                                disabled={reduxDashboardData.loading}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                className={`${classes.required}`}
                                onChange={(e) => formInputChangeHandler(e, 'imei')}
                                value={state.machineData?.imei || ''}
                                label="کد IMEI"
                                fullWidth
                                variant="standard"
                                id="machineimei-input"
                                name='machineimei-input'
                                error={state.errors.imei.error}
                                helperText={state.errors.imei.error_message}
                                disabled={reduxDashboardData.loading}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl
                                fullWidth
                                className={`${classes.required}`}
                                error={state.errors.status.error}
                            >
                                <InputLabel variant="standard" htmlFor="machinestatus-select">
                                    وضعیت
                                </InputLabel>
                                <NativeSelect
                                    onChange={(e) => formInputChangeHandler(e, 'status')}
                                    value={state.machineData?.status || ''}
                                    inputProps={{
                                        name: 'status',
                                        id: 'machinestatus-select',
                                    }}
                                    disabled={reduxDashboardData.loading}
                                >
                                    <option aria-label="انتخاب کنید" value="" />
                                    <option value={'FRE'}>آزاد</option>
                                    <option value={'MNT'}>نصب شده</option>
                                    <option value={'DSC'}>مرخص شده</option>
                                    <option value={'ASG'}>واگذاری</option>
                                </NativeSelect>
                                {state.errors.status.error && <FormHelperText>{state.errors.status.error_message}</FormHelperText>}
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl
                                fullWidth
                                className={`${classes.required}`}
                                error={state.errors.psp.error}
                            >
                                <InputLabel variant="standard" htmlFor="machinepsp-select">
                                    نام psp
                                </InputLabel>
                                <NativeSelect
                                    onChange={(e) => formInputChangeHandler(e, 'psp')}
                                    value={state.machineData?.psp || ''}
                                    inputProps={{
                                        name: 'psp',
                                        id: 'machinepsp-select',
                                    }}
                                    disabled={reduxDashboardData.loading}
                                >
                                    <option aria-label="انتخاب کنید" value="" />
                                    {state.pspData.map((item, index) => (
                                        <option key={`pspdata_${index}`} value={item.id}>
                                            {item.name}
                                        </option>
                                    ))}
                                </NativeSelect>
                                {state.errors.psp.error && <FormHelperText>{state.errors.psp.error_message}</FormHelperText>}
                            </FormControl>
                        </Grid>
                    </Grid>
                </RightToLeftLayout>
            </DialogContent>
            <DialogActions>
                <Stack
                    direction="row"
                    spacing={2}
                >
                    <div />
                    {isCreate ?
                        <Button
                            variant="contained"
                            color="success"
                            onClick={formMachineSubmit}
                        >
                            ایجاد
                        </Button>
                        :
                        <>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={proccessRemoveMachineHandler}
                            >
                                حذف
                            </Button>
                            <Button
                                variant="contained"
                                color="success"
                                onClick={formMachineSubmit}
                            >
                                ویرایش
                            </Button>
                        </>
                    }
                </Stack>
            </DialogActions>
        </Dialog >
    );
};

export default DetailMachine