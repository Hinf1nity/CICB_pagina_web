import { z } from "zod";

export const adminDataSchema = z.object({
    total_users: z.number().min(0),
    total_news: z.number().min(0),
    total_jobs: z.number().min(0),
    total_rulebooks: z.number().min(0),
});

export type AdminData = z.infer<typeof adminDataSchema>;