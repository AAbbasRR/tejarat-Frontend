export const LoginAPI = (email, password) => ({
    method: 'post',
    url: 'api/v1/user/login/',
    data: {
        email: email,
        password: password
    }
});
