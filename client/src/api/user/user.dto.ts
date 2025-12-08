export interface UserDto {
    id: string;
    name: string;
    email: string;
    roles: string[];
    bio?: string;
    verified: boolean;
    created_at: string;
    updated_at: string;
}

export interface UserResponseDto {
    message: string;
    data: UserDto;
}

export interface GetAllUsersParams {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
}

export interface GetAllUsersResponseDto {
    message: string;
    data: {
        users: UserDto[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}
