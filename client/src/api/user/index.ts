import { apiClient } from "@/api";
import type { GetAllUsersParams, GetAllUsersResponseDto, UserResponseDto } from "./user.dto";

export async function getOwnProfile(): Promise<UserResponseDto> {
    const { data } = await apiClient.get<UserResponseDto>("/user/own");
    return data;
}

export async function getAllUsers(params: GetAllUsersParams): Promise<GetAllUsersResponseDto> {
    const { data } = await apiClient.get<GetAllUsersResponseDto>("/user", { params });
    return data;
}

export async function verifyOrganizer(userId: string): Promise<void> {
    await apiClient.post(`/user/${userId}/verify`);
}
