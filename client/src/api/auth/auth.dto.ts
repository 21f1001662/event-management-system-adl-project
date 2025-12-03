export interface GoogleLoginRequestDto {
    id_token: string;
}

export interface TokensDto {
    accessToken: string;
    refreshToken: string;
}

export interface AuthUserDto {
    id: string;
    name: string;
    email: string;
    roles: string[];
}

export interface GoogleLoginResponseDto {
    message: string;
    data: {
        tokens: TokensDto;
        user: AuthUserDto;
    };
}

export interface RefreshTokensRequestDto {
    refresh_token: string;
}

export interface RefreshTokensResponseDto {
    message: string;
    data: {
        tokens: TokensDto;
        user: AuthUserDto;
    };
}
