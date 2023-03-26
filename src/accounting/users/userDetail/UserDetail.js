import React, { useState, useEffect } from 'react';

import classes from './styles/UserDetail.module.scss';

import {
    FormGroup,
    FormControlLabel,
    Grid,
    Paper,
    Card,
    CardContent,
    Typography,
    Divider,
    Button,
    Stack,
    TextField,
    FormControl,
    FormHelperText,
    InputLabel,
    NativeSelect,
    Checkbox
} from '@mui/material';

import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';

import { LazyLoadImage } from 'react-lazy-load-image-component';

import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import * as yup from 'yup';

import RightToLeftLayout from '../../../layouts/rightToLeft/RightToLeftLayout';

import { loadingAcion } from '../../../redux/actions/DashboardActions';

import {
    CreateUserAPI,
    DetailUserAPI,
    UpdateUserAPI,
    DeleteUserAPI
} from "../../../api/Users";
import CallApi from "../../../functions/CallApi";

const UserDetail = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [querySearchParams, setQuerySearchParams] = useSearchParams();
    const history = useNavigate();
    const reduxDispatch = useDispatch();
    const reduxDashboardData = useSelector(state => state.DashboardReducer);

    const [createUserStatus, setCreateUserStatus] = useState(true);
    const [userData, setUserData] = useState({
        createUserData: {
            email: {
                value: '',
                error: false,
                error_message: ''
            },
            national_id: {
                value: '',
                error: false,
                error_message: ''
            },
            password: {
                value: '',
                error: false,
                error_message: ''
            },
            position: {
                value: '',
                error: false,
                error_message: ''
            },
        },
        userData: null
    });

    useEffect(() => {
        let createUserNew = querySearchParams.get('createUser');
        let createUserStatusVar = false;
        switch (createUserNew) {
            case 'true':
                createUserStatusVar = true;
                break
            case 'false':
                createUserStatusVar = false;
                break
            default:
                createUserStatusVar = false;
                break
        };
        setCreateUserStatus(createUserStatusVar);
        if (createUserStatusVar === false) {
            let userID = querySearchParams.get('userID');
            getUserDetailData(userID);
        };
    }, []);


    const getUserDetailData = async (userID) => {
        try {
            reduxDispatch(loadingAcion(true));
            let result = await CallApi(DetailUserAPI(userID));
            setUserData({
                ...userData,
                userData: result
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
    const formCreateUserDataChangeHandle = (event, fieldName) => {
        let newState = { ...userData };
        newState.createUserData[fieldName] = {
            value: event.target.value,
            error: false,
            error_message: ''
        };
        setUserData({ ...newState });
    };
    const submitFormCreateUserHandler = async () => {
        let isFormValid = await formCreateUserValidation();
        if (isFormValid) {
            proccessCreateUser();
        };
    };
    const formCreateUserValidation = async () => {
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
            }),
            national_id: yup.string().required({
                field: "national_id",
                message: "کد ملی نباید خالی باشد"
            }).test('len', {
                field: "national_id",
                message: "کدملی باید ده رقمی باشد"
            }, value => value.length === 10),
            position: yup.string().required({
                field: "position",
                message: "مقام نباید خالی باشد"
            })
        });
        try {
            await schema.validate({
                email: userData.createUserData.email.value,
                password: userData.createUserData.password.value,
                national_id: userData.createUserData.national_id.value,
                position: userData.createUserData.position.value,
            }, { abortEarly: false });
            return true;
        } catch (error) {
            let errorMessage = { ...userData.createUserData };
            error.errors.map((item) => {
                errorMessage[item.field].error = true;
                errorMessage[item.field].error_message = item.message;
            });
            setUserData({ ...userData, createUserData: { ...errorMessage } });
            return false;
        };
    };
    const proccessCreateUser = async () => {
        if (createUserStatus) {
            try {
                reduxDispatch(loadingAcion(true));
                let response = await CallApi(CreateUserAPI(
                    userData.createUserData.email.value,
                    userData.createUserData.password.value,
                    userData.createUserData.national_id.value,
                    userData.createUserData.position.value
                ));
                enqueueSnackbar("با موفقیت ساخته شد", { variant: "success" });
                history({
                    pathname: `/panel/users/userDetail`,
                    search: `?userID=${response.id}`
                });
                setCreateUserStatus(false);
                getUserDetailData(response.id);
            } catch (error) {
                let response = error?.response?.data;
                let errorMessage = { ...userData.createUserData };
                if (response?.detail) {
                    enqueueSnackbar(response?.detail, { variant: "error" });
                } else if (response?.message) {
                    if (response?.message?.redirect) {
                        enqueueSnackbar(response?.message?.message, { variant: "error" });
                    } else {
                        enqueueSnackbar(response?.message, { variant: "error" });
                    };
                } else {
                    Object.keys(response).forEach(key => {
                        errorMessage[key].error = true;
                        errorMessage[key].error_message = response[key][0];
                    });
                    setUserData({ ...userData, createUserData: { ...errorMessage } });
                };
                if (response?.redirect && response?.redirect === "True") {
                    history('/panel/dashboard');
                };
            } finally {
                reduxDispatch(loadingAcion(false));
            };
        };
    };
    const formEditUserDataChangeHandler = (event, fieldName, isCheckBox = true) => {
        let newState = { ...userData };
        if (isCheckBox) {
            newState.userData.user_custom_permissions[fieldName] = event.target.checked;
        } else {
            newState.userData[fieldName] = event.target.value;
        };
        setUserData({ ...newState });
    };
    const deleteUserHandler = async (userID) => {
        try {
            reduxDispatch(loadingAcion(true));
            await CallApi(DeleteUserAPI(userID));
            enqueueSnackbar("با موفقیت حذف شد", { variant: "success" });
            history(`/panel/users`);
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
    const updateUserHandler = async (userID) => {
        try {
            reduxDispatch(loadingAcion(true));
            let result = await CallApi(UpdateUserAPI(userID, userData.userData));
            enqueueSnackbar("با موفقیت تغییر پیدا کرد", { variant: "success" });
            setUserData({
                ...userData,
                userData: result
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
                                    {createUserStatus ? 'اضافه کردن کاربر' : 'ویرایش کاربر'}
                                </Typography>
                                {createUserStatus ? undefined
                                    :
                                    <Stack
                                        direction="row-reverse"
                                        spacing={2}
                                        className={classes.deleteUserBtn}
                                    >
                                        <div />
                                        <Button
                                            variant="contained"
                                            color="error"
                                            disabled={reduxDashboardData.loading}
                                            onClick={() => deleteUserHandler(userData.userData.id)}
                                        >
                                            حذف کردن <PersonRemoveIcon fontSize='small' sx={{ marginRight: '5px' }} />
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="success"
                                            disabled={reduxDashboardData.loading}
                                            onClick={() => {
                                                history({
                                                    pathname: `/panel/users/userDetail`,
                                                    search: `?createUser=${true}`
                                                });
                                                setCreateUserStatus(true);
                                            }}
                                        >
                                            اضافه کردن <PersonAddIcon fontSize='small' sx={{ marginRight: '5px' }} />
                                        </Button>
                                    </Stack>
                                }
                            </div>
                            <Divider />

                            {createUserStatus ?
                                <RightToLeftLayout>
                                    <Grid container direction="row" spacing={2} className={classes.addUserContainer}>
                                        <Grid item xs={12} sm={6} md={4}>
                                            <TextField
                                                className={`${classes.required}`}
                                                variant="standard"
                                                id="adduseremail-input"
                                                name='adduseremail-input'
                                                label="ایمیل"
                                                fullWidth
                                                onChange={(e) => formCreateUserDataChangeHandle(e, 'email')}
                                                value={userData.createUserData.email.value}
                                                error={userData.createUserData.email.error}
                                                helperText={userData.createUserData.email.error_message}
                                                disabled={reduxDashboardData.loading}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={4}>
                                            <TextField
                                                className={`${classes.required}`}
                                                variant="standard"
                                                id="addusernational_id-input"
                                                label="کدملی"
                                                fullWidth
                                                onChange={(e) => formCreateUserDataChangeHandle(e, 'national_id')}
                                                value={userData.createUserData.national_id.value}
                                                error={userData.createUserData.national_id.error}
                                                helperText={userData.createUserData.national_id.error_message}
                                                disabled={reduxDashboardData.loading}
                                                onInput={(e) => e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 10)}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={4}>
                                            <TextField
                                                className={`${classes.required}`}
                                                variant="standard"
                                                id="adduserpassword-input"
                                                name='adduserpassword-input'
                                                label="رمزعبور"
                                                type="password"
                                                fullWidth
                                                onChange={(e) => formCreateUserDataChangeHandle(e, 'password')}
                                                value={userData.createUserData.password.value}
                                                error={userData.createUserData.password.error}
                                                helperText={userData.createUserData.password.error_message}
                                                disabled={reduxDashboardData.loading}
                                                autoComplete="new-password"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={4}>
                                            <FormControl
                                                fullWidth
                                                className={`${classes.required}`}
                                                error={userData.createUserData.position.error}
                                            >
                                                <InputLabel variant="standard" htmlFor="adduserposition-select">
                                                    مقام
                                                </InputLabel>
                                                <NativeSelect
                                                    onChange={(e) => formCreateUserDataChangeHandle(e, 'position')}
                                                    value={userData.createUserData.position.value}
                                                    inputProps={{
                                                        name: 'position',
                                                        id: 'adduserposition-select',
                                                    }}
                                                    disabled={reduxDashboardData.loading}
                                                >
                                                    <option aria-label="انتخاب کنید" value="" />
                                                    <option value={'CEO'}>مدیرعامل</option>
                                                    <option value={'EXP'}>کارشناس</option>
                                                    <option value={'STK'}>انباردار</option>
                                                    <option value={'AGN'}>نماینده</option>
                                                    <option value={'SUP'}>پشتیبان</option>
                                                </NativeSelect>
                                                {userData.createUserData.position.error && <FormHelperText>{userData.createUserData.position.error_message}</FormHelperText>}
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        className={`${classes.addUserBtn}`}
                                        onClick={submitFormCreateUserHandler}
                                        disabled={reduxDashboardData.loading}
                                    >
                                        ایجاد
                                    </Button>
                                </RightToLeftLayout>
                                :
                                <>
                                    {userData.userData &&
                                        <RightToLeftLayout>
                                            <Grid container direction="row" spacing={2} className={classes.addUserContainer}>
                                                <Grid item xs={12}>
                                                    {userData.userData.profile_image ?
                                                        <LazyLoadImage
                                                            src={userData.userData.profile_image}
                                                            className={classes.profileImage}
                                                        />
                                                        :
                                                        <AccountCircleRoundedIcon className={classes.profileImage} />
                                                    }
                                                </Grid>
                                                <Grid item xs={12} sm={6} md={4}>
                                                    <TextField
                                                        variant="standard"
                                                        label={"ایمیل"}
                                                        fullWidth
                                                        value={userData.userData.email}
                                                        disabled={true}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={6} md={4}>
                                                    <TextField
                                                        variant="standard"
                                                        label={"شماره موبایل"}
                                                        fullWidth
                                                        value={userData.userData.mobile_number}
                                                        disabled={true}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={6} md={4}>
                                                    <TextField
                                                        variant="standard"
                                                        label={"کدملی"}
                                                        fullWidth
                                                        value={userData.userData.national_id}
                                                        disabled={true}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={6} md={4}>
                                                    <TextField
                                                        variant="standard"
                                                        label={"نام"}
                                                        fullWidth
                                                        value={userData.userData.first_name}
                                                        disabled={true}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={6} md={4}>
                                                    <TextField
                                                        variant="standard"
                                                        label={"نام خانوادگی"}
                                                        fullWidth
                                                        value={userData.userData.last_name}
                                                        disabled={true}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={6} md={4}>
                                                    <TextField
                                                        variant="standard"
                                                        label={"ایمیل سازنده"}
                                                        fullWidth
                                                        value={userData.userData.creator_email}
                                                        disabled={true}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={6} md={4}>
                                                    <FormControl
                                                        fullWidth
                                                    >
                                                        <InputLabel variant="standard" htmlFor="adduserposition-select">
                                                            مقام
                                                        </InputLabel>
                                                        <NativeSelect
                                                            onChange={(e) => formEditUserDataChangeHandler(e, 'position', false)}
                                                            value={userData.userData.position}
                                                            inputProps={{
                                                                name: 'position',
                                                                id: 'adduserposition-select',
                                                            }}
                                                            disabled={reduxDashboardData.loading}
                                                        >
                                                            <option value={'CEO'}>مدیرعامل</option>
                                                            <option value={'EXP'}>کارشناس</option>
                                                            <option value={'STK'}>انباردار</option>
                                                            <option value={'AGN'}>نماینده</option>
                                                            <option value={'SUP'}>پشتیبان</option>
                                                        </NativeSelect>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Divider />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Typography variant="subtitle1" align="center" className={`subtitle`}>
                                                        لیست دسترسی ها
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={4} sm={3}>
                                                    <FormGroup>
                                                        <FormControlLabel
                                                            control={
                                                                <Checkbox
                                                                    checked={userData.userData.user_custom_permissions.can_manage_ceo_user}
                                                                    onChange={(e) => formEditUserDataChangeHandler(e, 'can_manage_ceo_user')}
                                                                />
                                                            }
                                                            label="مدیریت کاربران(مدیرعامل)"
                                                        />
                                                    </FormGroup>
                                                </Grid>
                                                <Grid item xs={4} sm={3}>
                                                    <FormGroup>
                                                        <FormControlLabel
                                                            control={
                                                                <Checkbox
                                                                    checked={userData.userData.user_custom_permissions.can_manage_expert_user}
                                                                    onChange={(e) => formEditUserDataChangeHandler(e, 'can_manage_expert_user')}
                                                                />
                                                            }
                                                            label="مدیریت کاربران(کارشناس)"
                                                        />
                                                    </FormGroup>
                                                </Grid>
                                                <Grid item xs={4} sm={3}>
                                                    <FormGroup>
                                                        <FormControlLabel
                                                            control={
                                                                <Checkbox
                                                                    checked={userData.userData.user_custom_permissions.can_manage_storekeeper_user}
                                                                    onChange={(e) => formEditUserDataChangeHandler(e, 'can_manage_storekeeper_user')}
                                                                />
                                                            }
                                                            label="مدیریت کاربران(انباردار)"
                                                        />
                                                    </FormGroup>
                                                </Grid>
                                                <Grid item xs={4} sm={3}>
                                                    <FormGroup>
                                                        <FormControlLabel
                                                            control={
                                                                <Checkbox
                                                                    checked={userData.userData.user_custom_permissions.can_manage_agent_user}
                                                                    onChange={(e) => formEditUserDataChangeHandler(e, 'can_manage_agent_user')}
                                                                />
                                                            }
                                                            label="مدیریت کاربران(نماینده)"
                                                        />
                                                    </FormGroup>
                                                </Grid>
                                                <Grid item xs={4} sm={3}>
                                                    <FormGroup>
                                                        <FormControlLabel
                                                            control={
                                                                <Checkbox
                                                                    checked={userData.userData.user_custom_permissions.can_manage_supporter_user}
                                                                    onChange={(e) => formEditUserDataChangeHandler(e, 'can_manage_supporter_user')}
                                                                />
                                                            }
                                                            label="مدیریت کاربران(پشتیبان)"
                                                        />
                                                    </FormGroup>
                                                </Grid>
                                                <Grid item xs={4} sm={3}>
                                                    <FormGroup>
                                                        <FormControlLabel
                                                            control={
                                                                <Checkbox
                                                                    checked={userData.userData.user_custom_permissions.can_manage_psp}
                                                                    onChange={(e) => formEditUserDataChangeHandler(e, 'can_manage_psp')}
                                                                />
                                                            }
                                                            label="مدیریت psp"
                                                        />
                                                    </FormGroup>
                                                </Grid>
                                                <Grid item xs={4} sm={3}>
                                                    <FormGroup>
                                                        <FormControlLabel
                                                            control={
                                                                <Checkbox
                                                                    checked={userData.userData.user_custom_permissions.can_manage_machine}
                                                                    onChange={(e) => formEditUserDataChangeHandler(e, 'can_manage_machine')}
                                                                />
                                                            }
                                                            label="مدیریت دستگاه"
                                                        />
                                                    </FormGroup>
                                                </Grid>
                                                <Grid item xs={4} sm={3}>
                                                    <FormGroup>
                                                        <FormControlLabel
                                                            control={
                                                                <Checkbox
                                                                    checked={userData.userData.user_custom_permissions.can_see_machine_history}
                                                                    onChange={(e) => formEditUserDataChangeHandler(e, 'can_see_machine_history')}
                                                                />
                                                            }
                                                            label="مشاهده تاریخچه دستگاه"
                                                        />
                                                    </FormGroup>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Divider />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Grid container direction="row-reverse" spacing={2}>
                                                        <Grid item xs={4} sm={3} md={2}>
                                                            <Button
                                                                variant="contained"
                                                                color="success"
                                                                fullWidth
                                                                disabled={reduxDashboardData.loading}
                                                                onClick={() => updateUserHandler(userData.userData.id)}
                                                            >
                                                                ویرایش کردن
                                                            </Button>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </RightToLeftLayout>
                                    }
                                </>
                            }
                        </CardContent>
                    </Card>
                </Paper>

            </Grid>
        </Grid>
    );
};

export default UserDetail