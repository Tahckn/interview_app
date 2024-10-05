import React from 'react';
import {GridColDef} from '@mui/x-data-grid';
import {Character, Pagination} from 'src/types/Marvel';
import {useMarvel} from 'src/contexts/MarvelContext';
import DataTable from "components/dashboard/DataTable.tsx";

interface CharacterTableProps {
    data: Character[];
    pagination: Pagination;
}

const CharacterTable: React.FC<CharacterTableProps> = ({data, pagination}) => {
    const {setCharacterPage, setCharacterPageSize, loading} = useMarvel();

    const columns: GridColDef[] = [
        {field: 'id', headerName: 'ID', width: 70},
        {field: 'name', headerName: 'Name', width: 200},
        {field: 'description', headerName: 'Description', width: 400},
        {
            field: 'thumbnail',
            headerName: 'Thumbnail',
            width: 150,
            renderCell: (params) => (
                <img
                    src={`${params.value?.path}.${params.value?.extension}`}
                    alt={params.row.name}
                    style={{width: 50, height: 50}}
                    onError={(e) => {
                        e.currentTarget.src = '/fallback.png'
                    }}
                />
            )
        },
        {
            field: 'comics',
            headerName: 'Comics',
            width: 120,
            renderCell(params) {
                return params.row.comics?.available ?? 'N/A';
            },
        },
        {
            field: 'series',
            headerName: 'Series',
            width: 120,
            renderCell(params) {
                return params.row.series?.available ?? 'N/A';
            },
        },
        {
            field: 'stories',
            headerName: 'Stories',
            width: 120,
            renderCell(params) {
                return params.row.stories?.available ?? 'N/A';
            },
        },
        {
            field: 'events',
            headerName: 'Events',
            width: 120,
            renderCell(params) {
                return params.row.events?.available ?? 'N/A';
            },
        },
        {
            field: 'modified',
            headerName: 'Son Güncelleme',
            width: 200,
            renderCell(params) {
                return new Date(params.row.modified).toLocaleString() ?? 'N/A';
            },
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


    return (
        <div style={{height: 400, width: '100%'}}>
            <DataTable
                columns={columns}
                rows={data}
                pagination={{
                    total: pagination.total,
                    page: Math.floor(pagination.offset / pagination.limit),
                    pageSize: pagination.limit,
                }}
                onPageChange={(newPage) => setCharacterPage(newPage + 1)}
                onPageSizeChange={setCharacterPageSize}
                loading={loading}
            />
        </div>
    );
};

export default CharacterTable;