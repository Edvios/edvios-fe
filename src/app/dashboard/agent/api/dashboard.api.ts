import axiosInstance from '@/lib/axios';
import { z } from 'zod';
import { AgentApplication, DashboardStats } from '../types/dashboard.types';
import { AgentApplicationSchema,DashboardStatsSchema } from '../dtos/dashboard.dto';


export const adminDashboardApi = {
    async getAllWithPaginationAndFilters(): Promise<AgentApplication[]> {
        const response = await axiosInstance.get('/applications?page=1&limit=3&status=SUBMITTED');
        return z.array(AgentApplicationSchema).parse(response.data);
    },

    async getStats(): Promise<DashboardStats> {
        const response = await axiosInstance.get('/agents/dashboard-stats');
        return DashboardStatsSchema.parse(response.data);
    }
}