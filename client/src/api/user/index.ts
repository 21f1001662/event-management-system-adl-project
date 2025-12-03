import { apiClient } from "@/api";
import type { UserResponseDto } from "./user.dto";

export async function getOwnProfile(): Promise<UserResponseDto> {
    const { data } = await apiClient.get<UserResponseDto>("/user/own");
    return data;
}
