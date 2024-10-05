import React from 'react';
import {GridColDef} from '@mui/x-data-grid';
import {useMarvel} from "src/contexts/MarvelContext.tsx";
import DataTable from '../DataTable';
import {Pagination, Series} from 'src/types/Marvel';

interface SeriesTableProps {
    data: Series[];
    pagination: Pagination;
}


const columns: GridColDef[] = [
    {field: 'id', headerName: 'ID', width: 70},
    {field: 'title', headerName: 'Title', width: 200},
    {
        field: 'description',
        headerName: 'Description',
        width: 400,
        renderCell(params) {
            return params.row.description ?? 'N/A';
        },
    },
    {
        field: 'thumbnail',
        headerName: 'Thumbnail',
        width: 150,
        renderCell: (params) => (
            <img
                src={`${params.row.thumbnail?.path}.${params.row.thumbnail?.extension}`}
                alt={params.row.title || 'Series thumbnail'}
                style={{width: 50, height: 50}}
                onError={(e) => {
                    e.currentTarget.src = '/fallback.png'
                }}
            />
        )
    },
    {
        field: 'startYear',
        headerName: 'Start Year',
        width: 120,
    },
    {
        field: 'endYear',
        headerName: 'End Year',
        width: 120,
    },
    {
        field: 'rating',
        headerName: 'Rating',
        width: 100,
    },
    {
        field: 'type',
        headerName: 'Type',
        width: 100,
    },
    {
        field: 'modified',
        headerName: 'Modified',
        width: 200,
        renderCell(params) {
            return new Date(params.row.modified).toLocaleString() ?? 'N/A';
        }
    },
    {
        field: 'creators',
        headerName: 'Creators',
        width: 200,
        renderCell: (params) => params.row.creators?.available ?? 'N/A',
    },
    {
        field: 'characters',
        headerName: 'Characters',
        width: 120,
        renderCell: (params) => params.row.characters?.available ?? 'N/A',
    },
    {
        field: 'stories',
        headerName: 'Stories',
        width: 120,
        renderCell: (params) => params.row.stories?.available ?? 'N/A',
    },
    {
        field: 'comics',
        headerName: 'Comics',
        width: 120,
        renderCell: (params) => params.row.comics?.available ?? 'N/A',
    },
    {
        field: 'urls',
        headerName: 'Bağlantılar',
        width: 200,
        renderCell: (params) => (
            <div>
                {params.row.urls?.map((url: { type: string, url: string }, index: number) => (
                    <a key={index} href={url.url} target="_blank" rel="noopener noreferrer"
                       style={{marginRight: '10px'}}>
                        {url.type}
                    </a>
                ))}
            </div>
        ),
    },
];

const SeriesTable: React.FC<SeriesTableProps> = ({data, pagination}) => {
    const {setSeriesPage, setSeriesPageSize, loading} = useMarvel();

    return (
        <DataTable
            columns={columns}
            rows={data}
            pagination={{
                pageSize: pagination.limit,
                total: pagination.total,
                page: Math.floor(pagination.offset / pagination.limit)
            }}
            onPageChange={(newPage) => setSeriesPage(newPage + 1)}
            onPageSizeChange={setSeriesPageSize}
            loading={loading}
        />
    );
};

export default SeriesTable;