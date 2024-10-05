import React, {useState, useEffect} from 'react';
import {Drawer, Box, Typography, TextField, Button} from '@mui/material';
import {useMarvel} from "src/contexts/MarvelContext.tsx";

interface FilterDrawerProps {
    activeTab: number;
}

const FilterDrawer: React.FC<FilterDrawerProps> = ({activeTab}) => {
    const {
        characterSearchTerm,
        seriesSearchTerm,
        setCharacterSearchTerm,
        setSeriesSearchTerm,
    } = useMarvel();

    const [localSearchTerm, setLocalSearchTerm] = useState('');
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setLocalSearchTerm(activeTab === 0 ? characterSearchTerm : seriesSearchTerm);
    }, [activeTab, characterSearchTerm, seriesSearchTerm]);

    const handleApplyFilter = () => {
        if (activeTab === 0) {
            setCharacterSearchTerm(localSearchTerm);
        } else {
            setSeriesSearchTerm(localSearchTerm);
        }
        setOpen(false);
    };

    return (
        <>
            <Button onClick={() => setOpen(true)}>Filter</Button>
            <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
                <Box sx={{width: 250, p: 2}}>
                    <Typography variant="h6" gutterBottom>
                        {activeTab === 0 ? 'Character Search' : 'Series Search'}
                    </Typography>
                    <TextField
                        fullWidth
                        label={activeTab === 0 ? "Character Name" : "Series Title"}
                        variant="outlined"
                        margin="normal"
                        value={localSearchTerm}
                        onChange={(e) => setLocalSearchTerm(e.target.value)}
                    />
                    <Button variant="contained" color="primary" fullWidth sx={{mt: 2}} onClick={handleApplyFilter}>
                        Apply Filter
                    </Button>
                </Box>
            </Drawer>
        </>
    );
};

export default FilterDrawer;