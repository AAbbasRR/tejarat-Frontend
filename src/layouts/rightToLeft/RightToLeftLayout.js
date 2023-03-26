import React from 'react';

import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const RightToLeftLayout = ({ children }) => {
    const rtltheme = createTheme({
        direction: 'rtl',
    });
    const cacheRtl = createCache({
        key: 'muirtl',
        stylisPlugins: [prefixer, rtlPlugin],
    });
    return (
        <CacheProvider value={cacheRtl}>
            <ThemeProvider theme={rtltheme}>
                {children}
            </ThemeProvider>
        </CacheProvider>
    );
};

export default RightToLeftLayout