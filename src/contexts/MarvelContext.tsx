import React, {createContext, useCallback, useContext, useEffect, useState} from 'react';
import {getCharacters, getSeries} from 'services/marvelApi';
import {Character, MarvelApiResponse, Series} from 'src/types/Marvel';
import { useSearchParams } from 'react-router-dom';

interface Pagination {
    offset: number;
    limit: number;
    total: number;
}

interface MarvelContextType {
    characters: Character[];
    series: Series[];
    loading: boolean;
    error: string | null;
    characterSearchTerm: string;
    seriesSearchTerm: string;
    characterPagination: Pagination;
    seriesPagination: Pagination;
    fetchCharacters: (params?: any) => Promise<void>;
    fetchSeries: (params?: any) => Promise<void>;
    setCharacterPage: (page: number) => void;
    setSeriesPage: (page: number) => void;
    setCharacterPageSize: (pageSize: number) => void;
    setSeriesPageSize: (pageSize: number) => void;
    setCharacterSearchTerm: (term: string) => void;
    setSeriesSearchTerm: (term: string) => void;
}

const MarvelContext = createContext<MarvelContextType | undefined>(undefined);

export const MarvelProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    // State declarations for characters, series, loading, error, search terms, and pagination
    const [searchParams] = useSearchParams();
    const [characters, setCharacters] = useState<Character[]>([]);
    const [series, setSeries] = useState<Series[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [characterSearchTerm, setCharacterSearchTerm] = useState(() => searchParams.get('characterSearch') || '');
    const [seriesSearchTerm, setSeriesSearchTerm] = useState(() => searchParams.get('seriesSearch') || '');
    const [characterPagination, setCharacterPagination] = useState<Pagination>({
        offset: 0,
        limit: 20,
        total: 0,
    });
    const [seriesPagination, setSeriesPagination] = useState<Pagination>({
        offset: 0,
        limit: 20,
        total: 0,
    });

    // Fetch characters from the Marvel API
    const fetchCharacters = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getCharacters({
                offset: characterPagination.offset,
                limit: characterPagination.limit,
                nameStartsWith: characterSearchTerm || undefined,
            });
            const data = response.data as MarvelApiResponse<Character>;
            setCharacters(data.data.results);
            setCharacterPagination(prev => ({
                ...prev,
                total: data.data.total,
            }));
        } catch (err) {
            setError('Error fetching characters');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [characterPagination.offset, characterPagination.limit, characterSearchTerm]);

    // Fetch series from the Marvel API
    const fetchSeries = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getSeries({
                offset: seriesPagination.offset,
                limit: seriesPagination.limit,
                titleStartsWith: seriesSearchTerm || undefined,
            });
            const data = response.data as MarvelApiResponse<Series>;
            setSeries(data.data.results);
            setSeriesPagination({
                offset: data.data.offset,
                limit: data.data.limit,
                total: data.data.total,
            });
        } catch (err) {
            setError('Error fetching series');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [seriesPagination.offset, seriesPagination.limit, seriesSearchTerm]);

    // Trigger fetches when pagination or search terms change
    useEffect(() => {
        fetchCharacters();
    }, [characterPagination.offset, characterPagination.limit, characterSearchTerm]);

    useEffect(() => {
        fetchSeries();
    }, [seriesPagination.offset, seriesPagination.limit, seriesSearchTerm]);

    // Pagination control functions
    const setCharacterPage = useCallback((page: number) => {
        setCharacterPagination(prev => ({
            ...prev,
            offset: (page - 1) * prev.limit
        }));
    }, []);
    const setSeriesPage = useCallback((page: number) => {
        setSeriesPagination(prev => {
            const newOffset = (page - 1) * prev.limit;
            return {...prev, offset: newOffset};
        });
    }, []);

    const setCharacterPageSize = useCallback((pageSize: number) => {
        setCharacterPagination(prev => ({...prev, limit: pageSize, offset: 0}));
    }, []);

    const setSeriesPageSize = useCallback((pageSize: number) => {
        setSeriesPagination(prev => ({...prev, limit: pageSize, offset: 0}));
    }, []);

    // Prepare the context value
    const value = {
        characters,
        series,
        loading,
        error,
        characterPagination,
        seriesPagination,
        characterSearchTerm,
        seriesSearchTerm,
        fetchCharacters,
        fetchSeries,
        setCharacterPage,
        setSeriesPage,
        setCharacterPageSize,
        setSeriesPageSize,
        setCharacterSearchTerm,
        setSeriesSearchTerm,
    };

    return <MarvelContext.Provider value={value}>{children}</MarvelContext.Provider>;
};

// Custom hook to use the Marvel context
export const useMarvel = () => {
    const context = useContext(MarvelContext);
    if (context === undefined) {
        throw new Error('useMarvel must be used within a MarvelProvider');
    }
    return context;
};