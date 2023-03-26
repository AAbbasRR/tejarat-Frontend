import React, { useState, useEffect } from 'react';

import classes from './styles/DetailPSP.module.scss';

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    TextField,
    IconButton
} from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';

import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import * as yup from 'yup';

import RightToLeftLayout from '../../../layouts/rightToLeft/RightToLeftLayout';

import { loadingAcion } from '../../../redux/actions/DashboardActions';

import {
    CreatePSPAPI,
    UpdatePSPAPI,
    DeletePSPAPI
} from '../../../api/PSP';
import CallApi from "../../../functions/CallApi";

const DetailPSP = ({ isOpen, handleClose, handleCloseUpdate, isCreate = true, detailData = null }) => {
    const { enqueueSnackbar } = useSnackbar();
    const reduxDispatch = useDispatch();
    const reduxDashboardData = useSelector(state => state.DashboardReducer);

    const initialState = {
        pspData: {},
        errors: {
            name: {
                error: false,
                error_message: ''
            }
        }
    };

    const [state, setState] = useState(initialState);

    useEffect(() => {
        if (!isCreate) {
            setState({
                ...state,
                pspData: detailData
            });
        };
    }, [isCreate, detailData]);

    const resetState = () => setState(initialState);
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
        newState.pspData[fieldName] = event.target.value;
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
    const formPSPSubmit = async () => {
        let isFormValid = await formPSPValidation();
        if (isFormValid) {
            if (isCreate) {
                proccessCreatePSPHandler();
            } else {
                proccessUpdatePSPHandler();
            };
        };
    }
    const formPSPValidation = async () => {
        let schema = yup.object().shape({
            name: yup.string().required({
                field: "name",
                message: "نام psp نباید خالی باشد"
            }),
        });
        try {
            await schema.validate({
                name: state.pspData?.name,
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
    const proccessRemovePSPHandler = async () => {
        try {
            reduxDispatch(loadingAcion(true));
            await CallApi(DeletePSPAPI(state.pspData.id));
            enqueueSnackbar('با موفقیت حذف شد', { variant: "success" });
            closeDialogHandler(true);
        } catch (error) {
            manageErrorsHandler(error);
        } finally {
            reduxDispatch(loadingAcion(false));
        };
    };
    const proccessCreatePSPHandler = async () => {
        try {
            reduxDispatch(loadingAcion(true));
            await CallApi(CreatePSPAPI(state.pspData));
            enqueueSnackbar('با موفقیت ایجاد شد', { variant: "success" });
            closeDialogHandler(true);
        } catch (error) {
            manageErrorsHandler(error);
        } finally {
            reduxDispatch(loadingAcion(false));
        };
    };
    const proccessUpdatePSPHandler = async () => {
        try {
            reduxDispatch(loadingAcion(true));
            await CallApi(UpdatePSPAPI(state.pspData.id, state.pspData));
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
                {isCreate ? "ایجاد psp" : "ویرایش psp"}
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
                    <TextField
                        onChange={(e) => formInputChangeHandler(e, 'name')}
                        value={state.pspData?.name || ''}
                        label="نام psp"
                        fullWidth
                        variant="standard"
                        id="pspname-input"
                        name='pspname-input'
                        error={state.errors.name.error}
                        helperText={state.errors.name.error_message}
                        disabled={reduxDashboardData.loading}
                    />
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
                            onClick={formPSPSubmit}
                        >
                            ایجاد
                        </Button>
                        :
                        <>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={proccessRemovePSPHandler}
                            >
                                حذف
                            </Button>
                            <Button
                                variant="contained"
                                color="success"
                                onClick={formPSPSubmit}
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

export default DetailPSP