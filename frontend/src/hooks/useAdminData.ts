import { useEffect, useState } from "react";
import api from "../api/kyClient";
import type { AdminData } from "../validations/adminDataSchema";

export function useAdminData() {
    const [adminStats, setAdminStats] = useState<AdminData | null>(null);
    async function fetchAdminStats() {
        const stats = await api.get('stats/overall').json<AdminData>();
        return stats;
    }

    useEffect(() => {
        async function loadStats() {
            try {
                const stats = await fetchAdminStats();
                console.log("Admin Stats:", stats);
                setAdminStats(stats);
            } catch (error) {
                console.error("Error fetching admin stats:", error);
            }
        }
        loadStats();
    }, []);

    return { adminStats };
}