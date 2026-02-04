import axiosInstance from '@/lib/axios';

export const applicationsApi = {
  async getURL(): Promise<string> {
    const response = await axiosInstance.get('/applications');
    return response.data;
  },

}