import React from 'react';
import { DataGrid, GridColDef, GridPaginationModel, GridRowsProp } from '@mui/x-data-grid';

interface DataTableProps {
    columns: GridColDef[]; // Defines the structure of the table columns.
    rows: GridRowsProp; // The actual data to be displayed in rows.
    pagination: {
        pageSize: number; // Number of rows to display per page.
        total: number; // Total number of rows available in the dataset.
        page: number; // Current page number.
    };
    onPageChange: (newPage: number) => void; // Callback when the user changes the page.
    onPageSizeChange: (newPageSize: number) => void; // Callback when the user changes the page size.
    loading: boolean; // Controls the loading state (shows a loading spinner when true).
}


const DataTable: React.FC<DataTableProps> = ({
    columns,
    rows,
    pagination,
    onPageChange,
    onPageSizeChange,
    loading
}) => {
    // Handles changes in the pagination model (e.g., when the user changes the page or page size).
    const handlePaginationModelChange = (newModel: GridPaginationModel) => {

        // If the new page number is different from the current one, call the onPageChange callback.
        if (newModel.page !== pagination.page) {
            onPageChange(newModel.page);
        }
        // If the new page size is different from the current one, call the onPageSizeChange callback.
        if (newModel.pageSize !== pagination.pageSize) {
            onPageSizeChange(newModel.pageSize);
        }
    };

    return (
        <div style={{ height: 400, width: '100%' }}> {/* Container to control the size of the DataGrid */}
            <DataGrid
                rows={rows}   // The data to be displayed in rows.
                columns={columns} // The structure of the table columns.
                paginationMode="server"
                rowCount={pagination.total} // Total number of rows available in the dataset.
                paginationModel={{
                    page: pagination.page,
                    pageSize: pagination.pageSize,
                }}
                onPaginationModelChange={handlePaginationModelChange}  // Callback to handle pagination changes.
                pageSizeOptions={[5, 10, 20]} // Options for the user to change the page size.
                loading={loading} // Controls the loading state (shows a loading spinner when true).
            />
        </div>
    );
};

export default DataTable;