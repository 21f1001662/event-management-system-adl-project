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
