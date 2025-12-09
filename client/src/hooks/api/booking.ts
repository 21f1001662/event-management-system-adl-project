import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { bookTicket, getMyTickets } from "@/api/booking";

export function useBookTicket() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: bookTicket,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["my-tickets"] });
            queryClient.invalidateQueries({ queryKey: ["events"] }); // Update event capacity/waitlist
        },
    });
}

export function useGetMyTickets(params: any) {
    return useQuery({
        queryKey: ["my-tickets", params],
        queryFn: () => getMyTickets(params),
    });
}
