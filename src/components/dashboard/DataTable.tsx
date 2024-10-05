import React from 'react';
import {DataGrid, GridColDef, GridPaginationModel, GridRowsProp} from '@mui/x-data-grid';

interface DataTableProps {
    columns: GridColDef[];
    rows: GridRowsProp;
    pagination: {
        pageSize: number;
        total: number;
        page: number;
    };
    onPageChange: (newPage: number) => void;
    onPageSizeChange: (newPageSize: number) => void;
    loading: boolean;
}


const DataTable: React.FC<DataTableProps> = ({
                                                 columns,
                                                 rows,
                                                 pagination,
                                                 onPageChange,
                                                 onPageSizeChange,
                                                 loading
                                             }) => {
    const handlePaginationModelChange = (newModel: GridPaginationModel) => {
        if (newModel.page !== pagination.page) {
            onPageChange(newModel.page);
        }
        if (newModel.pageSize !== pagination.pageSize) {
            onPageSizeChange(newModel.pageSize);
        }
    };

    return (
        <div style={{height: 400, width: '100%'}}>
            <DataGrid
                rows={rows}
                columns={columns}
                paginationMode="server"
                rowCount={pagination.total}
                paginationModel={{
                    page: pagination.page,
                    pageSize: pagination.pageSize,
                }}
                onPaginationModelChange={handlePaginationModelChange}
                pageSizeOptions={[5, 10, 20]}
                loading={loading}
            />
        </div>
    );
};

export default DataTable;