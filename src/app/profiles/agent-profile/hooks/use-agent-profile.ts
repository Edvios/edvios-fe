'use client'
import { useCallback, useEffect, useState } from "react";
import { AgentProfileData } from "../types/agent-profile.types";
import { getAgentProfile, updateAgentProfile } from "../api/agent-profile.api";

export const useAgentProfile = () => {
    const [data, setData] = useState<AgentProfileData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<unknown>(null);

    const fetchAgent = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getAgentProfile();
            setData(res);
            return res;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const saveAgent = useCallback(
        async (id: string, dto: Partial<AgentProfileData>) => {
            setLoading(true);
            try {
                const res = await updateAgentProfile(id, dto);
                setData(res);
                return res;
            } catch (err) {
                setError(err);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    useEffect(() => {
        fetchAgent();
    }, [fetchAgent]);

    return {
        data,
        loading,
        error,
        fetchAgent,
        saveAgent,
    };
};
