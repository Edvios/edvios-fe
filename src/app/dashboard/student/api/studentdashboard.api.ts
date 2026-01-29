import axiosInstance from '@/lib/axios';
import { Application, ApplicationsCount } from '@/app/dashboard/student/types/dashboard.types';

export const studentDashboardApi = {
	async getMyApplications(): Promise<Application[]> {
		const response = await axiosInstance.get('/applications/student/me');
		return response.data as Application[];
	},
	async getApplicationsCount(): Promise<ApplicationsCount> {
		const response = await axiosInstance.get('/applications/count');
		return response.data as ApplicationsCount;
	},

	// fetch programs (calls controller under /pai/programs)
	async getPrograms(params?: { page?: number; limit?: number }): Promise<unknown[]> {
		const response = await axiosInstance.get('/pai/programs', { params });
		// prefer common container shapes, fall back to raw payload
		return (response.data?.data ?? response.data?.items ?? response.data) as unknown[];
	},
};

