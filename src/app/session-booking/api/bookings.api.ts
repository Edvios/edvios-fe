import axiosInstance from '@/lib/axios';

export const bookingsApi = {
  async getCalendlyLink(): Promise<string> {
    const response = await axiosInstance.get('/agents/calendly-link-student');
    return response.data;
  },
}