import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export interface UploadedFile {
  url: string;
  type: string;
  name: string;
  size: number;
}

export const useFileUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const supabase = createClient();

  const uploadFile = async (file: File): Promise<UploadedFile | null> => {
    setIsUploading(true);
    setUploadError(null);

    try {
      // Validate file size (e.g., max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error("File size must be less than 10MB");
      }

      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("chat-attachments")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from("chat-attachments")
        .getPublicUrl(filePath);

      return {
        url: publicUrl,
        type: file.type,
        name: file.name,
        size: file.size,
      };
    } catch (error: any) {
      console.error("Upload failed:", error);
      setUploadError(error.message || "Failed to upload file");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadFile,
    isUploading,
    uploadError,
  };
};
