import React from 'react';

import Backdrop from '@mui/material/Backdrop';
import GridLoader from 'react-spinners/GridLoader';

import colors from '../../app/styles/Colors.scss';


const PageLoader = ({ isLoading }) => {

    return (
        <Backdrop
            open={isLoading}
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
            <GridLoader
                color={colors.loader_color}
                height={100}
                width={100}
            />
        </Backdrop>
    );
};

export default PageLoader;