import { getAllEvents } from "@/api/event";
import type { GetEventsParams, GetEventsResponse } from "@/api/event/event.dto";
import type { ApiErrorShape } from "@/types/common";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";

export function useGetAllEvents(params: GetEventsParams): UseQueryResult<GetEventsResponse, ApiErrorShape> {
    return useQuery({
        queryKey: ["events", params],
        queryFn: () => getAllEvents(params),
    });
}

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEvent } from "@/api/event";

export function useCreateEvent() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createEvent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["events"] });
        },
    });
}

import { getEventById, updateEvent } from "@/api/event";

export function useGetEvent(id: string) {
    return useQuery({
        queryKey: ["events", id],
        queryFn: () => getEventById(id),
        enabled: !!id,
    });
}

export function useUpdateEvent() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => updateEvent(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ["events"] });
            queryClient.invalidateQueries({ queryKey: ["events", id] });
        },
    });
}

import { toggleEventApproval } from "@/api/event";

export function useToggleEventApproval() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: toggleEventApproval,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["events"] });
        },
    });
}
