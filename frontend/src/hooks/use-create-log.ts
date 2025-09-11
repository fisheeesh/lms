/* eslint-disable @typescript-eslint/no-explicit-any */
import { adminApi } from "@/api";
import { invalidateLogsQueries } from "@/api/query";
import type { AdSchema, AwsSchema, CrowdStrikeSchema, HTTPSchema, M365Schema } from "@/lib/validators";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import z from "zod";

type IngestPayload =
    | z.infer<typeof HTTPSchema>
    | z.infer<typeof AwsSchema>
    | z.infer<typeof CrowdStrikeSchema>
    | z.infer<typeof M365Schema>
    | z.infer<typeof AdSchema>;

const useCreateLog = () => {
    const { mutate: createLog, isPending } = useMutation({
        mutationFn: async (payload: IngestPayload) => {
            const { data } = await adminApi.post("admin/ingest", payload);
            return data;
        },
        onSuccess: async () => {
            await invalidateLogsQueries()
            toast.success('Success', {
                description: "Log has been ingested successfully.",
            });
        },
        onError: (err: any) => {
            const msg =
                err?.response?.data?.message ||
                err?.message ||
                "Failed to ingest log. Please try again.";
            toast.error('Error', {
                description: msg,
            });
        },
    });

    return { createLog, isPending }
}

export default useCreateLog