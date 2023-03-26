export const GetListMachineAPI = (page = 1) => ({
    method: 'get',
    url: `api/v1/store/machines/`,
    token: true,
    params: {
        page: page,
    },
});


export const CreateMachineAPI = (data) => ({
    method: 'post',
    url: `api/v1/store/machines/`,
    token: true,
    data
});

export const DetailMachineAPI = (MachineID) => ({
    method: 'get',
    url: `api/v1/store/machines/${MachineID}/`,
    token: true,
});

export const UpdateMachineAPI = (MachineID, data) => ({
    method: 'put',
    url: `api/v1/store/machines/${MachineID}/`,
    token: true,
    data
});

export const DeleteMachineAPI = (MachineID) => ({
    method: 'delete',
    url: `api/v1/store/machines/${MachineID}/`,
    token: true,
});