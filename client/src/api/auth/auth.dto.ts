export interface GoogleLoginRequestDto {
    id_token: string;
}

export interface OrganizerRegisterRequestDto {
    id_token: string;
    bio: string;
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
    bio?: string;
    verified?: boolean;
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
