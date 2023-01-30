import React from 'react';

import Backdrop from '@mui/material/Backdrop';
import BarLoader from 'react-spinners/BarLoader';


const Loading = ({ isLoading }) => {

    return (
        <Backdrop
            open={isLoading}
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
            <BarLoader
                color="#CEDFED"
                height={3}
                width={200}
            />
        </Backdrop>
    );
};

export default Loading;