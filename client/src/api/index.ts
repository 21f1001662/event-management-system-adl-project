import axios, {
    AxiosError,
    type AxiosInstance,
    type AxiosResponse,
    type InternalAxiosRequestConfig,
} from "axios";
import { API_HOST, API_LOG_REQUESTS, API_LOG_RESPONSES } from "@/config/env";
import { store } from "@/store";
import { logout, setTokens } from "@/store/auth/authSlice";
import { getItemFromSecureStore } from "@/store/secureStorage";
import type { ApiErrorShape } from "@/types/common";
import { logError, logRequest, logResponse } from "@/utils/helpers";
import type { RefreshTokensResponseDto } from "./auth/auth.dto";

export const apiClient: AxiosInstance = axios.create({
    baseURL: API_HOST,
    timeout: 15000,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor
apiClient.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (config as any).metadata = { start: Date.now() };

        // Attach access token to each request
        const token = store.getState().auth.accessToken;
        if (token) {
            config.headers.Authorization = `Bearer ${token} `;
        }

        if (API_LOG_REQUESTS) logRequest(config);
        return config;
    },
    (error: AxiosError) => Promise.reject(error)
);

// Response Interceptor with token refresh logic
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function onRefreshed(token: string) {
    refreshSubscribers.forEach((cb) => cb(token));
    refreshSubscribers = [];
}

apiClient.interceptors.response.use(
    (response: AxiosResponse) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const metadata = (response.config as any).metadata ?? {};
        const durationMs =
            typeof metadata.start === "number"
                ? Date.now() - metadata.start
                : undefined;
        if (API_LOG_RESPONSES) logResponse(response, durationMs);
        return response;
    },

    async (error: AxiosError<ApiErrorShape>) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const originalRequest: any = error.config;
        const status = error.response?.status;

        if (status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            if (!isRefreshing) {
                try {
                    isRefreshing = true;
                    const rt = await getItemFromSecureStore("refresh_token");

                    if (!rt) {
                        store.dispatch(logout());
                        return Promise.reject(error);
                    }

                    const response = await axios.post<RefreshTokensResponseDto>(
                        `${API_HOST}/auth/refresh`,
                        { refresh_token: rt },
                        {
                            headers: {
                                "Content-Type": "application/json",
                                withCredentials: true,
                            },
                        }
                    );

                    store.dispatch(
                        setTokens({
                            accessToken: response.data.data.tokens.accessToken,
                            refreshToken: response.data.data.tokens.refreshToken,
                        })
                    );

                    isRefreshing = false;
                    onRefreshed(response.data.data.tokens.accessToken);

                    // Retry original request with new token
                    originalRequest.headers.Authorization = `Bearer ${response.data.data.tokens.accessToken}`;
                    return apiClient(originalRequest);
                } catch (error) {
                    isRefreshing = false;
                    store.dispatch(logout());
                    return Promise.reject(error);
                }
            }

            return new Promise((resolve) => {
                refreshSubscribers.push((newToken: string) => {
                    originalRequest.headers.Authorization = `Bearer ${newToken} `;
                    resolve(apiClient(originalRequest));
                });
            });
        }

        // logging
        const durationMs = originalRequest.metadata?.start
            ? Date.now() - originalRequest.metadata.start
            : undefined;
        if (API_LOG_RESPONSES) logError(error, durationMs);

        const normalized: ApiErrorShape = {
            status: error.response?.status,
            message:
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (error.response?.data as any)?.message ||
                error.message ||
                "Request failed",
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ...((error.response?.data as any) ?? {}),
        };
        return Promise.reject(normalized);
    }
);
