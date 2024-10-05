
type LogLevel = 'info' | 'warn' | 'error';

interface LogEntry {
    timestamp: string;
    level: LogLevel;
    message: string;
    data?: any;
}

class Logger {
    private logs: LogEntry[] = [];

    private log(level: LogLevel, message: string, data?: any) {
        const logEntry: LogEntry = {
            timestamp: new Date().toISOString(),
            level,
            message,
            data,
        };
        this.logs.push(logEntry);

        // Save the logs
        this.saveLogs();
    }

    info(message: string, data?: any) {
        this.log('info', message, data);
    }

    warn(message: string, data?: any) {
        this.log('warn', message, data);
    }

    error(message: string, data?: any) {
        this.log('error', message, data);
    }

    getLogs(): LogEntry[] {
        return this.logs;
    }

    private saveLogs() {
        // Save the logs to local storage
        localStorage.setItem('appLogs', JSON.stringify(this.logs));

        // OR send the logs to a server
        // fetch('/api/logs', { method: 'POST', body: JSON.stringify(this.logs) });
    }
}

export default new Logger();