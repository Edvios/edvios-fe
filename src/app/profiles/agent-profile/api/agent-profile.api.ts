import axiosInstance from "@/lib/axios";
import { AgentProfileData } from "../types/agent-profile.types";

export const getAgentProfile = async (): Promise<AgentProfileData> => {
    // Using the endpoint from the controller: GET /agents/agent/:agentId
    // The backend uses the current user from JWT to fetch the agent
    const res = await axiosInstance.get<AgentProfileData>(`/agents/agent/:agentId`);
    return res.data;
};

export const updateAgentProfile = async (
    id: string,
    payload: Partial<AgentProfileData>
): Promise<AgentProfileData> => {
    const res = await axiosInstance.patch<AgentProfileData>(`/agents`, payload);
    return res.data;
};
