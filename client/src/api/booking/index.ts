import { apiClient } from "@/api";

export async function bookTicket(eventId: string): Promise<any> {
    const { data } = await apiClient.post("/bookings", { eventId });
    return data;
}

export async function getMyTickets(params: any): Promise<any> {
    const { data } = await apiClient.get("/bookings/my-tickets", { params });
    return data;
}
