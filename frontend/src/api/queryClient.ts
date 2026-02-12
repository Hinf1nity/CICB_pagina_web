import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 5 * 60 * 1000, // 5 minutes
            gcTime: 1000 * 60 * 10,    // 10 minutos se mantienen en memoria si no se usan
            refetchOnReconnect: false,
        },
    },
});
