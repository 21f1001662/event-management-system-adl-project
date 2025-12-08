import { getAllUsers, getOwnProfile, verifyOrganizer } from "@/api/user";
import type { GetAllUsersParams, GetAllUsersResponseDto, UserResponseDto } from "@/api/user/user.dto";
import type { ApiErrorShape } from "@/types/common";
import { useMutation, useQuery, useQueryClient, type UseQueryResult } from "@tanstack/react-query";

export function useGetOwnProfile(): UseQueryResult<UserResponseDto, ApiErrorShape> {
    return useQuery({
        queryKey: ["user", "profile"],
        queryFn: getOwnProfile,
        retry: false, // Don't retry on 401/403 to allow redirect
    });
}

export function useGetAllUsers(params: GetAllUsersParams): UseQueryResult<GetAllUsersResponseDto, ApiErrorShape> {
    return useQuery({
        queryKey: ["users", params],
        queryFn: () => getAllUsers(params),
    });
}

export function useVerifyOrganizer() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: verifyOrganizer,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
    });
}
