import { Type } from 'class-transformer';
import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsDateString,
    IsUrl,
    IsEnum,
    IsInt,
    Min,
} from 'class-validator';
import { EventCategory } from '../entities/Event';

export class CreateEventDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    short_description: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsDateString()
    @IsNotEmpty()
    date: string;

    @IsOptional()
    @IsUrl()
    image_url?: string;

    @IsOptional()
    @IsUrl()
    video_url?: string;

    @IsString()
    @IsNotEmpty()
    location: string;

    @IsEnum(EventCategory)
    @IsNotEmpty()
    category: EventCategory;

    @IsInt()
    @Min(1)
    capacity: number;
}

export class UpdateEventDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    title?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    short_description?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    description?: string;

    @IsOptional()
    @IsDateString()
    @IsNotEmpty()
    date?: string;

    @IsOptional()
    @IsUrl()
    image_url?: string;

    @IsOptional()
    @IsUrl()
    video_url?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    location?: string;

    @IsOptional()
    @IsEnum(EventCategory)
    category?: EventCategory;

    @IsOptional()
    @IsInt()
    @Min(1)
    capacity?: number;
}

export class GetEventsQueryDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number;

    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsEnum(EventCategory)
    category?: EventCategory;

    @IsOptional()
    @IsString()
    location?: string;

    @IsOptional()
    @IsString()
    organizerId?: string;

    @IsOptional()
    @IsString()
    orderBy?: string;

    @IsOptional()
    @IsString() // Ideally should be an enum 'ASC' | 'DESC' but string is fine for query param basic validation
    order?: 'ASC' | 'DESC';
}
