export interface UserDto {
    id: string;
    name: string;
    email: string;
    roles: string[];
    created_at: string;
    updated_at: string;
}

export interface UserResponseDto {
    message: string;
    data: UserDto;
}
