import { getOwnProfile } from "@/api/user";
import type { UserResponseDto } from "@/api/user/user.dto";
import type { ApiErrorShape } from "@/types/common";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";

export function useGetOwnProfile(): UseQueryResult<UserResponseDto, ApiErrorShape> {
    return useQuery({
        queryKey: ["user", "profile"],
        queryFn: getOwnProfile,
        retry: false, // Don't retry on 401/403 to allow redirect
    });
}
