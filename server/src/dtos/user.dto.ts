import { IsString, IsOptional, IsBoolean, IsEnum, IsNumber, Min } from 'class-validator';
import { UserRole } from '../entities/User';
import { GoogleLoginDto } from './auth.dto';

export class OrganizerRegisterDto extends GoogleLoginDto {
    @IsString()
    @IsOptional()
    bio?: string;
}

export class UserFilterDto {
    @IsOptional()
    @IsNumber()
    @Min(1)
    page?: number;

    @IsOptional()
    @IsNumber()
    @Min(1)
    limit?: number;

    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole;

    @IsOptional()
    @IsString()
    orderBy?: string;

    @IsOptional()
    @IsString()
    order?: 'ASC' | 'DESC';
}
