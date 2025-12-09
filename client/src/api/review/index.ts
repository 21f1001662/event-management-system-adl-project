import { apiClient as client } from '../index';

export const createReview = (data: { eventId: string; review_text: string; rating: number }) => {
    return client.post('/reviews', data);
};

export const deleteReview = (id: string) => {
    return client.delete(`/reviews/${id}`);
};

export const getEventReviews = (eventId: string, page: number = 1, limit: number = 5) => {
    return client.get(`/reviews/event/${eventId}?page=${page}&limit=${limit}`);
};

export const getMyReviews = () => {
    return client.get('/reviews/me');
};
