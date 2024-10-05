import React, {useEffect, useState} from 'react';
import {Box, List, ListItem, Paper, Typography, useTheme} from '@mui/material';
import logger from "services/logger";

const LogViewer: React.FC = () => {
    const [logs, setLogs] = useState(logger.getLogs()); // State to store logs.
    const theme = useTheme();

    // useEffect hook to update logs every 5 seconds.
    useEffect(() => {
        const interval = setInterval(() => {
            setLogs(logger.getLogs());
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    // Function to return the color based on the log level.
    const getLogColor = (level: string) => {
        switch (level) {
            case 'info':
                return theme.palette.info.light;
            case 'warn':
                return theme.palette.warning.light;
            case 'error':
                return theme.palette.error.light;
            default:
                return theme.palette.grey[300];
        }
    };

    return (
        <Box sx={{height: '100%', display: 'flex', flexDirection: 'column'}}>
            <Typography variant="h6" gutterBottom>Application Logs</Typography>
            {/* Paper component to give the log list a card-like elevation */}
            <Paper
                elevation={3}
                sx={{
                    flexGrow: 1,
                    overflow: 'auto',
                    maxHeight: 'calc(100vh - 200px)'
                }}
            >
                <List>
                    {/* Map over the logs and display each log in a ListItem */}
                    {logs.map((log, index) => (
                        <ListItem
                            key={index}
                            sx={{
                                backgroundColor: getLogColor(log.level),
                                borderBottom: `1px solid ${theme.palette.divider}`,
                                flexDirection: 'column',
                                alignItems: 'flex-start'
                            }}
                        >
                            {/* Display the log level and message */}
                            <Typography variant="body1">
                                [{log.level.toUpperCase()}] {log.message}
                            </Typography>
                            <Typography variant="caption" display="block">
                                {new Date(log.timestamp).toLocaleString()} {/* Format timestamp to a human-readable string */}
                            </Typography>
                            {/* If log contains additional data, display it as JSON in a preformatted block */}
                            {log.data && (
                                <Box
                                    component="pre"
                                    sx={{
                                        mt: 1,
                                        p: 1,
                                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                        borderRadius: 1,
                                        overflowX: 'auto',
                                        fontSize: '0.875rem',
                                        fontFamily: 'monospace',
                                        margin: 0,
                                        width: '100%'
                                    }}
                                >
                                    {JSON.stringify(log.data, null, 2)} {/* Pretty print the log data */}
                                </Box>
                            )}
                        </ListItem>
                    ))}
                </List>
            </Paper>
        </Box>
    );
};

export default LogViewer;