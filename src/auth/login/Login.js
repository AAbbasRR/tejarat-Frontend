import React, { useState } from 'react';

import classes from './styles/Login.module.scss';

import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';

import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import EmailIcon from '@mui/icons-material/Email';
import PasswordIcon from '@mui/icons-material/Password';

import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useSnackbar } from 'notistack';
import * as yup from 'yup';

import PageLoader from '../../components/loader/PageLoader';
import RightToLeftLayout from '../../layouts/rightToLeft/RightToLeftLayout';

import { loginAction } from '../../redux/actions/UserActions';

import { LoginAPI } from "../../api/Auth";
import CallApi from "../../functions/CallApi";


const Login = () => {
    const { enqueueSnackbar } = useSnackbar();
    const history = useNavigate();
    const reduxDispatch = useDispatch();

    const [state, setState] = useState({
        isLoading: false,
        loginData: {
            email: "",
            password: ""
        },
        loginErrorData: {
            email: {
                error: false,
                message: ""
            },
            password: {
                error: false,
                message: ""
            }
        }
    });

    const formDataChangeHandle = (event, inputName) => {
        let newState = { ...state };
        newState.loginErrorData[inputName] = {
            error: false,
            message: ""
        };
        newState.loginData[inputName] = event.target.value;
        setState({ ...newState });
    };
    const submitFormHandler = async (event) => {
        event.preventDefault();
        let isFormValid = await formValidation();
        if (isFormValid) {
            proccessLogin();
        };
    };
    const formValidation = async () => {
        let schema = yup.object().shape({
            email: yup.string().required({
                field: "email",
                message: "ایمیل نباید خالی باشد"
            }).email({
                field: "email",
                message: "آدرس ایمیل معتبر نیست"
            }),
            password: yup.string().required({
                field: "password",
                message: "رمزعبور نباید خالی باشد"
            })
        });
        try {
            await schema.validate({ ...state.loginData }, { abortEarly: false });
            return true;
        } catch (error) {
            let errorMessage = { ...state.loginErrorData };
            error.errors.map((item) => {
                errorMessage[item.field].error = true;
                errorMessage[item.field].message = item.message;
            });
            setState({ ...state, loginErrorData: { ...errorMessage } });
            return false;
        };
    };
    const proccessLogin = async () => {
        setState({ ...state, isLoading: true });
        try {
            let response = await CallApi(LoginAPI(state.loginData.email, state.loginData.password));
            reduxDispatch(loginAction(response));
            history('/panel/dashboard');
        } catch (error) {
            let response = error?.response?.data;
            let errorMessage = { ...state.loginErrorData };
            if (response?.detail) {
                enqueueSnackbar(response?.detail, { variant: "error" });
            } else {
                Object.keys(response).forEach(key => {
                    errorMessage[key].error = true;
                    errorMessage[key].message = response[key][0];
                });
                setState({ ...state, loginErrorData: { ...errorMessage } });
            };
        } finally {
            setState({ ...state, isLoading: false });
        };
    };

    return (
        <>
            {state.isLoading && <PageLoader isLoading={true} />}
            <Container fixed className={classes.main}>
                <RightToLeftLayout>
                    <div className={classes.authBox}>
                        <div className={classes.accountImage}>
                            <PermIdentityOutlinedIcon sx={{ fontSize: 65 }} />
                        </div>
                        <div className={classes.content}>
                            <form
                                className={classes.formControll}
                                onSubmit={submitFormHandler}
                            >
                                <TextField
                                    variant="filled"
                                    id="email-input"
                                    label="ایمیل"
                                    fullWidth
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <EmailIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                    onChange={(e) => formDataChangeHandle(e, 'email')}
                                    value={state.loginData.email}
                                    error={state.loginErrorData.email.error}
                                    helperText={state.loginErrorData.email.message}
                                />
                                <TextField
                                    variant="filled"
                                    id="password-input"
                                    label="رمزعبور"
                                    type="password"
                                    autoComplete="current-password"
                                    fullWidth
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <PasswordIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                    onChange={(e) => formDataChangeHandle(e, 'password')}
                                    value={state.loginData.password}
                                    error={state.loginErrorData.password.error}
                                    helperText={state.loginErrorData.password.message}
                                />
                                <Button
                                    type='submit'
                                    variant="contained"
                                    className={classes.submitBtn}
                                    onSubmit={submitFormHandler}
                                    disabled={state.isLoading}
                                >
                                    ورود
                                </Button>
                            </form>
                        </div>
                    </div>
                </RightToLeftLayout>
            </Container>
        </>
    );
};

export default Login