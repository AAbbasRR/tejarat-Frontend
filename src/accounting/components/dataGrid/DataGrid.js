import React from 'react';

import { DataGrid } from '@mui/x-data-grid';

import RightToLeftLayout from '../../../layouts/rightToLeft/RightToLeftLayout';

import CustomPagination from './pagination';

const CustomDataGrid = ({ rows, columns, checkboxSelection = false, totalPage, pageSize = 15, currentPage = 0, onPageChange, onRowClick }) => {
    return (
        <RightToLeftLayout>
            <DataGrid
                autoHeight
                disableSelectionOnClick
                disableColumnMenu
                rows={rows}
                columns={columns}
                checkboxSelection={checkboxSelection}
                paginationMode="server"
                rowCount={totalPage * pageSize}
                pageSize={pageSize}
                page={currentPage}
                onPageChange={onPageChange}
                onRowClick={onRowClick}
                localeText={{
                    footerRowSelected: (count) => `${count.toLocaleString()} ردیف انتخاب شده`,
                    columnHeaderSortIconLabel: 'مرتب سازی',
                    noResultsOverlayLabel: 'نتیجه ای پیدا نشد',
                    noRowsLabel: 'خالی'
                }}
                sx={{
                    marginTop: '1rem',
                    '&:hover':{
                        cursor: 'pointer'
                    }
                }}
                components={{
                    Pagination: CustomPagination,
                }}
            />
        </RightToLeftLayout>
    );
};

export default CustomDataGrid