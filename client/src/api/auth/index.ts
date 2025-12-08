import { apiClient } from "@/api";
import type {
    GoogleLoginRequestDto,
    GoogleLoginResponseDto,
    RefreshTokensRequestDto,
    RefreshTokensResponseDto,
    OrganizerRegisterRequestDto,
} from "./auth.dto";

export async function loginWithGoogle(
    payload: GoogleLoginRequestDto
): Promise<GoogleLoginResponseDto> {
    const { data } = await apiClient.post<GoogleLoginResponseDto>(
        "/auth/login/google",
        payload
    );
    return data;
}

export async function refreshTokens(
    payload: RefreshTokensRequestDto
): Promise<RefreshTokensResponseDto> {
    const { data } = await apiClient.post<RefreshTokensResponseDto>(
        "/auth/refresh",
        payload
    );
    return data;
}

export async function registerOrganizer(
    payload: OrganizerRegisterRequestDto
): Promise<GoogleLoginResponseDto> {
    const { data } = await apiClient.post<GoogleLoginResponseDto>(
        "/auth/register/organizer",
        payload
    );
    return data;
}
