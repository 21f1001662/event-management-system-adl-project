import { loginWithGoogle, refreshTokens } from "@/api/auth";
import type {
    GoogleLoginRequestDto,
    GoogleLoginResponseDto,
    RefreshTokensRequestDto,
    RefreshTokensResponseDto,
} from "@/api/auth/auth.dto";
import type { ApiErrorShape } from "@/types/common";
import { useMutation, type UseMutationResult } from "@tanstack/react-query";

export function useLoginWithGoogle(): UseMutationResult<
    GoogleLoginResponseDto,
    ApiErrorShape,
    GoogleLoginRequestDto
> {
    return useMutation<
        GoogleLoginResponseDto,
        ApiErrorShape,
        GoogleLoginRequestDto
    >({
        mutationFn: (payload) => loginWithGoogle(payload),
    });
}

export function useRefreshTokens(): UseMutationResult<
    RefreshTokensResponseDto,
    ApiErrorShape,
    RefreshTokensRequestDto
> {
    return useMutation<
        RefreshTokensResponseDto,
        ApiErrorShape,
        RefreshTokensRequestDto
    >({
        mutationFn: (payload) => refreshTokens(payload),
    });
}
