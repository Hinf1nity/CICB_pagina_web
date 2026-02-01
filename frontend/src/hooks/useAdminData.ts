import api from "../api/kyClient";
import type { AdminData } from "../validations/adminDataSchema";
import { useQuery } from "@tanstack/react-query";

export function useAdminData() {
    const {
        data: adminStats,
    } = useQuery({
        queryKey: ['admin', 'overallStats'],
        queryFn: async () => {
            return api.get('stats/overall/').json<AdminData>();
        },
    });

    return { adminStats };
}