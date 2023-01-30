import React, { useState, useEffect } from 'react';

import classes from './styles/Dashboard.module.scss';

import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import * as yup from 'yup';

import CallApi from "../../functions/CallApi";

const Dashboard = () => {
    // const reduxDispatch = useDispatch();
    // const reduxUserData = useSelector(state => state.UserReducer);
    // const { enqueueSnackbar } = useSnackbar();

    // const [isLoading, setIsLoading] = useState(false);
    // const [userData, setUserData] = useState({
    //     mobile_number: "",
    //     first_name: "",
    //     first_name_disabled: false,
    //     last_name: "",
    //     last_name_disabled: false,
    //     old_password: "",
    //     new_password: "",
    //     new_re_password: ""
    // });
    // const [dataError, setDataError] = useState({
    //     first_name: {
    //         error: false,
    //         message: ""
    //     },
    //     last_name: {
    //         error: false,
    //         message: ""
    //     },
    //     old_password: {
    //         error: false,
    //         message: ""
    //     },
    //     new_password: {
    //         error: false,
    //         message: ""
    //     },
    //     new_re_password: {
    //         error: false,
    //         message: ""
    //     },
    // });

    // useEffect(() => {
    //     setUserData({
    //         ...userData,
    //         mobile_number: reduxUserData.mobile_number,
    //         first_name: reduxUserData.first_name || "",
    //         first_name_disabled: (reduxUserData.first_name && reduxUserData.first_name !== "") ? true : false,
    //         last_name: reduxUserData.last_name || "",
    //         last_name_disabled: (reduxUserData.last_name && reduxUserData.last_name !== "") ? true : false
    //     });
    // }, []);

    // const changeDataHandler = (event, field_name) => {
    //     if (field_name !== "mobile_number") {
    //         let userDataNew = { ...userData };
    //         let dataErrorNew = { ...dataError };
    //         userDataNew[field_name] = event.target.value;
    //         dataErrorNew[field_name].error = false;
    //         dataErrorNew[field_name].message = "";
    //         setUserData(userDataNew);
    //         setDataError(dataErrorNew);
    //     };
    // };
    // const userProfileFormValidation = async () => {
    //     let schema = yup.object().shape({
    //         first_name: yup.string().required(),
    //         last_name: yup.string().required(),
    //     });
    //     try {
    //         await schema.validate({ first_name: userData.first_name, last_name: userData.last_name }, { abortEarly: false });
    //         return true;
    //     } catch (error) {
    //         let errorMessage = { ...dataError };
    //         error.errors.map((item) => {
    //             switch (item) {
    //                 case "first_name is a required field":
    //                     errorMessage.first_name.error = true;
    //                     errorMessage.first_name.message = "نام نباید خالی باشد";
    //                     break;
    //                 case "last_name is a required field":
    //                     errorMessage.last_name.error = true;
    //                     errorMessage.last_name.message = "نام خانوادگی نباید خالی باشد";
    //                     break;
    //                 default:
    //                     break;
    //             };
    //             return null;
    //         });
    //         setDataError({ ...errorMessage });
    //         return false;
    //     };
    // };
    // const userProfileSubmitFormHandler = async () => {
    //     let isFormValid = await userProfileFormValidation();
    //     if (isFormValid) {
    //         completeUserProfile();
    //     };
    // };
    // const completeUserProfile = async () => {
    //     setIsLoading(true);
    //     try {
    //         await CallApi(UserProfileAPI(userData.first_name, userData.last_name));
    //         enqueueSnackbar("اطلاعات شما با موفقیت ثبت شد", { variant: "success" });
    //         reduxDispatch(completeUserProfileAction(userData.first_name, userData.last_name));
    //         setUserData({
    //             ...userData,
    //             first_name: "",
    //             last_name: "",
    //         });
    //         setDataError({
    //             ...dataError,
    //             first_name: {
    //                 error: false,
    //                 message: ""
    //             },
    //             last_name: {
    //                 error: false,
    //                 message: ""
    //             },
    //         });
    //     } catch (error) {
    //         let response = error?.response?.data;
    //         let dataErrorNew = { ...dataError };
    //         Object.keys(response).forEach(key => {
    //             dataErrorNew[key] = {
    //                 error: true,
    //                 message: response[key]
    //             };
    //         });
    //         setDataError(dataErrorNew);
    //     } finally {
    //         setIsLoading(false);
    //     };
    // };
    // const userProfileChangePassFormValidation = async () => {
    //     let schema = yup.object().shape({
    //         old_password: yup.string().required(),
    //         new_password: yup.string().required(),
    //         new_re_password: yup.string().required().oneOf([yup.ref('new_password'), null], 'passwords must match')
    //     });
    //     try {
    //         await schema.validate({ ...userData }, { abortEarly: false });
    //         return true;
    //     } catch (error) {
    //         let errorMessage = { ...dataError };
    //         error.errors.map((item) => {
    //             switch (item) {
    //                 case "old_password is a required field":
    //                     errorMessage.old_password.error = true;
    //                     errorMessage.old_password.message = "رمز عبور قدیمی نباید خالی باشد";
    //                     break;
    //                 case "new_password is a required field":
    //                     errorMessage.new_password.error = true;
    //                     errorMessage.new_password.message = "رمز عبور جدید نباید خالی باشد";
    //                     break;
    //                 case "new_re_password is a required field":
    //                     errorMessage.new_re_password.error = true;
    //                     errorMessage.new_re_password.message = "تکرار رمز عبور جدید نباید خالی باشد";
    //                     break;
    //                 case "passwords must match":
    //                     errorMessage.new_password.error = true;
    //                     errorMessage.new_re_password.error = true;
    //                     errorMessage.new_password.message = "رمز عبور و تکرار رمز عبور یکی نیستند";
    //                     errorMessage.new_re_password.message = "رمز عبور و تکرار رمز عبور یکی نیستند";
    //                     break;
    //                 default:
    //                     break;
    //             };
    //             return null;
    //         });
    //         setDataError({ ...errorMessage });
    //         return false;
    //     };
    // };
    // const changePassSubmitFormHandler = async () => {
    //     let isFormValid = await userProfileChangePassFormValidation();
    //     if (isFormValid) {
    //         changePasswordAccount();
    //     };
    // };
    // const changePasswordAccount = async () => {
    //     setIsLoading(true);
    //     try {
    //         await CallApi(UserChangePasswordAPI(userData.old_password, userData.new_password, userData.new_re_password));
    //         enqueueSnackbar("رمز شما با موفقیت تغییر پیدا کرد", { variant: "success" });
    //         setUserData({
    //             ...userData,
    //             old_password: "",
    //             new_password: "",
    //             new_re_password: ""
    //         });
    //         setDataError({
    //             ...dataError,
    //             old_password: {
    //                 error: false,
    //                 message: ""
    //             },
    //             new_password: {
    //                 error: false,
    //                 message: ""
    //             },
    //             new_re_password: {
    //                 error: false,
    //                 message: ""
    //             },
    //         });
    //     } catch (error) {
    //         let response = error?.response?.data;
    //         console.log(response)
    //         let dataErrorNew = { ...dataError };
    //         Object.keys(response).forEach(key => {
    //             dataErrorNew[key] = {
    //                 error: true,
    //                 message: response[key]
    //             };
    //         });
    //         console.log(dataErrorNew)
    //         setDataError(dataErrorNew);
    //     } finally {
    //         setIsLoading(false);
    //     };
    // };

    const rtltheme = createTheme({
        direction: 'rtl', // Both here and <body dir="rtl">
    });
    const cacheRtl = createCache({
        key: 'muirtl',
        stylisPlugins: [prefixer, rtlPlugin],
    });

    return (
        <>
        hello world
            {/* <Grid container direction="row" spacing={3} className={classes.container}>
                <Grid item xs={12} sm={6}>
                    <Paper elevation={2}>
                        <Card>
                            <CardContent>
                                <Typography variant="subtitle1" align="right" className={`subtitle ${classes.cardHeader}`}>
                                    ثبت اطلاعات هویتی
                                </Typography>
                                <Divider />
                                <CacheProvider value={cacheRtl}>
                                    <ThemeProvider theme={rtltheme}>
                                        <div className={classes.formControll}>
                                            <TextField
                                                onChange={(event) => changeDataHandler(event, "mobile_number")}
                                                disabled
                                                value={userData.mobile_number}
                                                id="mobile_number_field"
                                                label="شماره موبایل"
                                                variant="outlined"
                                                fullWidth
                                            />
                                            <div className={classes.manyFieldBox}>
                                                <TextField
                                                    onChange={(event) => changeDataHandler(event, "first_name")}
                                                    disabled={userData.first_name_disabled}
                                                    value={userData.first_name}
                                                    id="first_name_field"
                                                    label="نام"
                                                    variant="outlined"
                                                    fullWidth
                                                    error={dataError.first_name.error}
                                                    helperText={dataError.first_name.message}
                                                />

                                                <TextField
                                                    onChange={(event) => changeDataHandler(event, "last_name")}
                                                    disabled={userData.last_name_disabled}
                                                    value={userData.last_name}
                                                    id="last_name_field"
                                                    label="نام خانوادگی"
                                                    variant="outlined"
                                                    fullWidth
                                                    error={dataError.last_name.error}
                                                    helperText={dataError.last_name.message}
                                                />
                                            </div>
                                        </div>
                                    </ThemeProvider>
                                </CacheProvider>
                                {(userData.first_name_disabled && userData.last_name_disabled) ?
                                    null :
                                    <>
                                        <Divider />
                                        <Button onClick={userProfileSubmitFormHandler} variant="contained" color="primary" className={classes.btnPage}>
                                            ثبت اطلاعات
                                        </Button>
                                    </>
                                }
                            </CardContent>
                        </Card>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Paper elevation={2}>
                        <Card>
                            <CardContent>
                                <Typography variant="subtitle1" align="right" className={`subtitle ${classes.cardHeader}`}>
                                    تغییر رمز عبور
                                </Typography>
                                <Divider />
                                <CacheProvider value={cacheRtl}>
                                    <ThemeProvider theme={rtltheme}>
                                        <div className={classes.formControll}>
                                            <TextField
                                                onChange={(event) => changeDataHandler(event, "old_password")}
                                                value={userData.old_password}
                                                id="old_password_field"
                                                label="رمز عبور قدیمی"
                                                variant="outlined"
                                                fullWidth
                                                type="password"
                                                error={dataError.old_password.error}
                                                helperText={dataError.old_password.message}
                                            />
                                            <div className={classes.manyFieldBox}>
                                                <TextField
                                                    onChange={(event) => changeDataHandler(event, "new_password")}
                                                    value={userData.new_password}
                                                    id="new_password_field"
                                                    label="رمز عبور جدید"
                                                    variant="outlined"
                                                    fullWidth
                                                    type="password"
                                                    error={dataError.new_password.error}
                                                    helperText={dataError.new_password.message}
                                                />

                                                <TextField
                                                    onChange={(event) => changeDataHandler(event, "new_re_password")}
                                                    value={userData.new_re_password}
                                                    id="new_re_password_field"
                                                    label="تکرار رمز عبور جدید"
                                                    variant="outlined"
                                                    fullWidth
                                                    type="password"
                                                    error={dataError.new_re_password.error}
                                                    helperText={dataError.new_re_password.message}
                                                />
                                            </div>
                                        </div>
                                    </ThemeProvider>
                                </CacheProvider>
                                <Divider />
                                <Button onClick={changePassSubmitFormHandler} variant="contained" color="primary" className={classes.btnPage}>
                                    تغییر رمز عبور
                                </Button>
                            </CardContent>
                        </Card>
                    </Paper>
                </Grid>
            </Grid > */}
        </>
    );
};

export default Dashboard