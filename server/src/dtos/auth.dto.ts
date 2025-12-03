import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class GoogleLoginDto {
    @IsString()
    @IsNotEmpty()
    id_token: string;
}

export class RefreshTokenDto {
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    refresh_token?: string;
}
