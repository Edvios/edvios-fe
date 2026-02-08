import axiosInstance from '@/lib/axios';

export interface CreateNotificationDto {
    message: string;
}

export interface Notification {
    id: string;
    message: string;
    createdAt: string;
}

export const notificationService = {
    createStudentNotification: async (data: CreateNotificationDto) => {
        const response = await axiosInstance.post<Notification>('/notifications/student', data);
        return response.data;
    },

    createAgentNotification: async (data: CreateNotificationDto) => {
        const response = await axiosInstance.post<Notification>('/notifications/agent', data);
        return response.data;
    },

    getAllStudentNotifications: async () => {
        const response = await axiosInstance.get<Notification[]>('/notifications/student');
        return response.data;
    },

    getAllAgentNotifications: async () => {
        const response = await axiosInstance.get<Notification[]>('/notifications/agent');
        return response.data;
    }
};
