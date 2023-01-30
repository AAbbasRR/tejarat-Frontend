export const UserProfileAPI = (first_name, last_name) => ({
    method: 'put',
    url: `user/api/profile/`,
    token: true,
    data: {
        first_name: first_name,
        last_name: last_name
    },
});

export const UserChangePasswordAPI = (old_password, new_password, new_re_password) => ({
    method: 'put',
    url: `user/api/changepass/`,
    token: true,
    data: {
        old_password: old_password,
        new_password: new_password,
        new_re_password: new_re_password
    },
});

export const UserAddressesListAPI = () => ({
    method: 'get',
    url: `user/api/addresses/list_create/`,
    token: true,
});

export const UserAddressesCreateAPI = (address_description, post_code, receiver, receiver_mobile_number) => ({
    method: 'post',
    url: `user/api/addresses/list_create/`,
    token: true,
    data: {
        address_description: address_description,
        post_code: post_code,
        receiver: receiver,
        receiver_mobile_number: receiver_mobile_number
    },
});

export const UserAddressesEditAPI = (id, address_description, post_code, receiver, receiver_mobile_number) => ({
    method: 'put',
    url: `user/api/addresses/edit_delete/${id}/`,
    token: true,
    data: {
        address_description: address_description,
        post_code: post_code,
        receiver: receiver,
        receiver_mobile_number: receiver_mobile_number
    },
});

export const UserAddressesDeleteAPI = (id) => ({
    method: 'delete',
    url: `user/api/addresses/edit_delete/${id}/`,
    token: true,
});