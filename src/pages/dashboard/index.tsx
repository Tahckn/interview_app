import {useState} from 'react';
import {Box, CircularProgress, Paper, Tab, Tabs, Typography} from '@mui/material';
import Grid from '@mui/material/Grid2';
import {Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis} from 'recharts';
import {useMarvel} from "src/contexts/MarvelContext.tsx";
import FilterDrawer from "components/dashboard/FilterDrawer.tsx";
import CharacterTable from "components/dashboard/Tables/CharacterTable.tsx";
import SeriesTable from "components/dashboard/Tables/SeriesTable.tsx";

const Dashboard = () => {
    const {
        characters,
        series,
        loading,
        error,
        characterPagination,
        seriesPagination,
    } = useMarvel();

    const [activeTab, setActiveTab] = useState(0);

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    const chartData = [
        {name: 'Characters', count: characterPagination.total},
        {name: 'Series', count: seriesPagination.total},
    ];

    if (loading) return <Box display="flex" justifyContent="center" alignItems="center"
                             height="100vh"><CircularProgress/></Box>;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Box sx={{flexGrow: 1, p: 3}}>
            <Typography variant="h4" gutterBottom>
                Marvel API Dashboard
            </Typography>
            <Grid container spacing={3}>
                <Grid>
                    <Paper sx={{p: 2}}>
                        <Typography variant="h6" gutterBottom>
                            Total Counts
                        </Typography>
                        <BarChart width={500} height={300} data={chartData}>
                            <CartesianGrid strokeDasharray="3 3"/>
                            <XAxis dataKey="name"/>
                            <YAxis/>
                            <Tooltip/>
                            <Legend/>
                            <Bar dataKey="count" fill="#8884d8"/>
                        </BarChart>
                    </Paper>
                </Grid>
                <Grid size={{xs: 12}}>
                    <Paper sx={{p: 2}}>
                        <Tabs value={activeTab} onChange={handleTabChange}>
                            <Tab label="Characters"/>
                            <Tab label="Series"/>
                        </Tabs>
                        {activeTab === 0 && (
                            <>
                                <Typography variant="h6" gutterBottom>
                                    Characters
                                </Typography>
                                <CharacterTable data={characters} pagination={characterPagination}/>
                            </>
                        )}
                        {activeTab === 1 && (
                            <>
                                <Typography variant="h6" gutterBottom>
                                    Series
                                </Typography>
                                <SeriesTable data={series} pagination={seriesPagination}/>
                            </>
                        )}
                    </Paper>
                </Grid>
                <Grid size={{xs: 12}}>
                    <Paper
                        sx={{p: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                        <FilterDrawer activeTab={activeTab}/>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;