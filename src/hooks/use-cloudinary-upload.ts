import { useState, useCallback } from 'react';

interface UploadResult {
    url: string;
    publicId: string;
    originalFilename: string;
}

interface UseCloudinaryUploadReturn {
    uploadFile: (file: File, folder?: string) => Promise<string | null>;
    uploadMultipleFiles: (files: File[], folder?: string) => Promise<string[]>;
    isUploading: boolean;
    uploadProgress: string;
    error: string | null;
    clearError: () => void;
}

export const useCloudinaryUpload = (): UseCloudinaryUploadReturn => {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState('');
    const [error, setError] = useState<string | null>(null);

    const clearError = useCallback(() => setError(null), []);

    const uploadFile = useCallback(async (file: File, folder?: string): Promise<string | null> => {
        setIsUploading(true);
        setError(null);
        setUploadProgress('Uploading...');

        try {
            const formData = new FormData();
            formData.append('file', file);
            if (folder) {
                formData.append('folder', folder);
            }

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Upload failed');
            }

            const result: UploadResult = await response.json();
            setUploadProgress('Upload complete');
            return result.url;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Upload failed';
            setError(message);
            setUploadProgress('');
            return null;
        } finally {
            setIsUploading(false);
        }
    }, []);

    const uploadMultipleFiles = useCallback(async (files: File[], folder?: string): Promise<string[]> => {
        setIsUploading(true);
        setError(null);
        const urls: string[] = [];

        try {
            for (let i = 0; i < files.length; i++) {
                setUploadProgress(`Uploading ${i + 1} of ${files.length}...`);
                const url = await uploadFile(files[i], folder);
                if (url) {
                    urls.push(url);
                }
            }
            setUploadProgress(`${urls.length} file(s) uploaded`);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Upload failed';
            setError(message);
        } finally {
            setIsUploading(false);
        }

        return urls;
    }, [uploadFile]);

    return {
        uploadFile,
        uploadMultipleFiles,
        isUploading,
        uploadProgress,
        error,
        clearError,
    };
};
