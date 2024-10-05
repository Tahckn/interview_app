import {useEffect, useState} from 'react';
import {Box, CircularProgress, Paper, Tab, Tabs, Typography} from '@mui/material';
import Grid from '@mui/material/Grid2';
import {Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis} from 'recharts';
import {useMarvel} from "src/contexts/MarvelContext.tsx";
import FilterDrawer from "components/dashboard/FilterDrawer.tsx";
import CharacterTable from "components/dashboard/Tables/CharacterTable.tsx";
import SeriesTable from "components/dashboard/Tables/SeriesTable.tsx";
import {useSearchParams} from "react-router-dom";

const Dashboard = () => {
    const {
        characters,
        series,
        loading,
        error,
        characterPagination,
        seriesPagination,
        characterSearchTerm,
        seriesSearchTerm,
        setCharacterSearchTerm,
        setSeriesSearchTerm,
    } = useMarvel();

    const [searchParams, setSearchParams] = useSearchParams();

    // Get the active tab from URL or default to 0
    const [activeTab, setActiveTab] = useState(() => {
        const tabParam = searchParams.get('tab');
        return tabParam === 'series' ? 1 : 0;
    });

    // Update search terms from URL on component mount
    useEffect(() => {
        const characterSearch = searchParams.get('characterSearch');
        const seriesSearch = searchParams.get('seriesSearch');
        if (characterSearch) setCharacterSearchTerm(characterSearch);
        if (seriesSearch) setSeriesSearchTerm(seriesSearch);
    }, []);

    // Handle tab change
    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
        setSearchParams(prev => {
            prev.set('tab', newValue === 1 ? 'series' : 'characters');
            return prev;
        });
    };

    // Update URL when search terms change
    useEffect(() => {
        setSearchParams(prev => {
            if (characterSearchTerm) prev.set('characterSearch', characterSearchTerm);
            else prev.delete('characterSearch');
            if (seriesSearchTerm) prev.set('seriesSearch', seriesSearchTerm);
            else prev.delete('seriesSearch');
            return prev;
        });
    }, [characterSearchTerm, seriesSearchTerm]);

    // Prepare data for the chart
    const chartData = [
        {name: 'Characters', count: characterPagination.total},
        {name: 'Series', count: seriesPagination.total},
    ];

    // Show error message if there's an error
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Box sx={{ flexGrow: 1, p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Marvel API Dashboard
            </Typography>
            <Grid container spacing={3}>
                {/* Chart section */}
                <Grid>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Total Counts
                        </Typography>
                        <Box sx={{ position: 'relative' }}>
                            <BarChart
                                width={500}
                                height={300}
                                data={chartData}
                                style={{ opacity: loading ? 0.5 : 1 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="count" fill="#8884d8" />
                            </BarChart>
                            {loading && (
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                    }}
                                >
                                    <CircularProgress />
                                </Box>
                            )}
                        </Box>
                    </Paper>
                </Grid>
                {/* Table section */}
                <Grid size={{ xs: 12 }}>
                    <Paper sx={{ p: 2 }}>
                        <Tabs value={activeTab} onChange={handleTabChange}>
                            <Tab label="Characters" />
                            <Tab label="Series" />
                        </Tabs>
                        {activeTab === 0 && (
                            <>
                                <Typography variant="h6" gutterBottom>
                                    Characters
                                </Typography>
                                <CharacterTable data={characters} pagination={characterPagination} />
                            </>
                        )}
                        {activeTab === 1 && (
                            <>
                                <Typography variant="h6" gutterBottom>
                                    Series
                                </Typography>
                                <SeriesTable data={series} pagination={seriesPagination} />
                            </>
                        )}
                    </Paper>
                </Grid>
                {/* Filter drawer */}
                <Grid size={{ xs: 12 }}>
                    <Paper
                        sx={{ p: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
                    >
                        <FilterDrawer activeTab={activeTab} />
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;