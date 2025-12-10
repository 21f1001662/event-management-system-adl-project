export const EventCategory = {
    TECH: 'Tech',
    MUSIC: 'Music',
    SPORTS: 'Sports',
    ART: 'Art',
    BUSINESS: 'Business',
    EDUCATION: 'Education',
    OTHER: 'Other',
} as const;

export type EventCategory = typeof EventCategory[keyof typeof EventCategory];

export interface EventDto {
    id: string;
    title: string;
    short_description: string;
    description: string;
    date: string;
    image_url?: string;
    video_url?: string;
    location: string;
    category: EventCategory;
    capacity: number;
    attendees_count: number;
    organizer_id: string;
    organizer: {
        id: string;
        name: string;
        email: string;
    };
    approved: boolean;
    flag_count: number;
    created_at: string;
    updated_at: string;
}

export interface GetEventsParams {
    page?: number;
    limit?: number;
    search?: string;
    category?: EventCategory;
    location?: string;
    organizerId?: string;
    orderBy?: string;
    order?: 'ASC' | 'DESC';
    approved?: string;
    startDate?: string;
    endDate?: string;
}

export interface GetEventsResponse {
    message: string;
    data: {
        events: EventDto[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}
