/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios';

export const logRequest = (config: InternalAxiosRequestConfig) => {
    console.groupCollapsed(`🚀 Request: ${config.method?.toUpperCase()} ${config.url}`);
    console.log('Headers:', config.headers);
    console.log('Params:', config.params);
    console.log('Body:', config.data);
    console.groupEnd();
};

export const logResponse = (response: AxiosResponse, durationMs?: number) => {
    console.groupCollapsed(
        `✅ Response: ${response.status} ${response.config.url} (${durationMs}ms)`
    );
    console.log('Data:', response.data);
    console.groupEnd();
};

export const logError = (error: any, durationMs?: number) => {
    console.groupCollapsed(
        `❌ Error: ${error.response?.status || 'Unknown'} ${error.config?.url} (${durationMs}ms)`
    );
    console.log('Message:', error.message);
    console.log('Response:', error.response?.data);
    console.groupEnd();
};
