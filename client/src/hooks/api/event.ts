import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getAllEvents,
    createEvent,
    getEventById,
    updateEvent,
    toggleEventApproval,
    flagEvent
} from '@/api/event';
import type { GetEventsParams } from '@/api/event/event.dto';

export function useGetAllEvents(params: GetEventsParams) {
    return useQuery({
        queryKey: ['events', params],
        queryFn: () => getAllEvents(params),
    });
}

export function useCreateEvent() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createEvent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['events'] });
        },
    });
}

export function useGetEvent(id: string) {
    return useQuery({
        queryKey: ['event', id],
        queryFn: () => getEventById(id),
        enabled: !!id,
    });
}

export function useUpdateEvent() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => updateEvent(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ['events'] });
            queryClient.invalidateQueries({ queryKey: ['event', id] });
        },
    });
}

export function useToggleEventApproval() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: toggleEventApproval,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['events'] });
        },
    });
}

export const useFlagEvent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: flagEvent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['events'] });
        },
    });
};
