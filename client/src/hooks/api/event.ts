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
