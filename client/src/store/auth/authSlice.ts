import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthUserDto, TokensDto } from "@/api/auth/auth.dto";
import { deleteItemFromSecureStore, saveItemToSecureStore } from "../secureStorage";

export type AuthState = {
    accessToken: string | null;
    user: AuthUserDto | null;
};

const initialState: AuthState = {
    accessToken: null,
    user: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setTokens: (state, action: PayloadAction<TokensDto>) => {
            state.accessToken = action.payload.accessToken;
            saveItemToSecureStore("refresh_token", action.payload.refreshToken);
        },
        setUser: (state, action: PayloadAction<AuthUserDto>) => {
            state.user = action.payload;
        },
        setAccessToken: (state, action: PayloadAction<string>) => {
            state.accessToken = action.payload;
        },
        logout: (state) => {
            state.accessToken = null;
            state.user = null;
            deleteItemFromSecureStore("refresh_token");
        },
    },
});

export const { setTokens, setUser, setAccessToken, logout } = authSlice.actions;
export default authSlice.reducer;
