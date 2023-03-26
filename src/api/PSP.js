export const GetListPSPAPI = (page = 1) => ({
    method: 'get',
    url: `api/v1/store/psp/`,
    token: true,
    params: {
        page: page,
    },
});

export const GetListAllPSPAPI = () => ({
    method: 'get',
    url: `api/v1/store/psp/all/`,
    token: true,
});

export const CreatePSPAPI = (data) => ({
    method: 'post',
    url: `api/v1/store/psp/`,
    token: true,
    data
});

export const DetailPSPAPI = (PSPID) => ({
    method: 'get',
    url: `api/v1/store/psp/${PSPID}/`,
    token: true,
});

export const UpdatePSPAPI = (PSPID, data) => ({
    method: 'put',
    url: `api/v1/store/psp/${PSPID}/`,
    token: true,
    data
});

export const DeletePSPAPI = (PSPID) => ({
    method: 'delete',
    url: `api/v1/store/psp/${PSPID}/`,
    token: true,
});