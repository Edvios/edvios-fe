import axiosInstance from '@/lib/axios';
import { DashboardStats } from '../types/dashboard.types';
import { DashboardStatsSchema } from '../dtos/dashboard.dto';


export const agentDashboardApi = {
    async getStats(): Promise<DashboardStats> {
        const response = await axiosInstance.get('/agents/dashboard-stats');
        return DashboardStatsSchema.parse(response.data);
    }
}