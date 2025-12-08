import { apiClient } from "@/api";
import type { GetEventsParams, GetEventsResponse } from "./event.dto";

export async function getAllEvents(params: GetEventsParams): Promise<GetEventsResponse> {
    const { data } = await apiClient.get<GetEventsResponse>("/events", { params });
    return data;
}

export async function createEvent(eventData: any): Promise<any> {
    const { data } = await apiClient.post("/events", eventData);
    return data;
}
