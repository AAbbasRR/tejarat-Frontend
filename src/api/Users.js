export const GetListUsersAPI = (page = 1) => ({
    method: 'get',
    url: `api/v1/user/users/`,
    token: true,
    params: {
        page: page,
    },
});


export const CreateUserAPI = (email, password, national_id, position) => ({
    method: 'post',
    url: `api/v1/user/users/`,
    token: true,
    data: {
        email: email,
        password: password,
        national_id: national_id,
        position: position
    },
});

export const DetailUserAPI = (userID) => ({
    method: 'get',
    url: `api/v1/user/users/${userID}/`,
    token: true,
});

export const UpdateUserAPI = (userID, data) => ({
    method: 'put',
    url: `api/v1/user/users/${userID}/`,
    token: true,
    data
});

export const DeleteUserAPI = (userID) => ({
    method: 'delete',
    url: `api/v1/user/users/${userID}/`,
    token: true,
});