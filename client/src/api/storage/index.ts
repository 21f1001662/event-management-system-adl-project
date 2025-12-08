import { apiClient } from "@/api";
import axios from "axios";

export interface PresignedUrlResponse {
    message: string;
    data: {
        url: string;
        key: string;
        filename: string;
    };
}

export async function getPresignedUrl(contentType: string): Promise<PresignedUrlResponse> {
    const { data } = await apiClient.get<PresignedUrlResponse>("/storage/presigned-url", {
        params: { content_type: contentType },
    });
    return data;
}

export async function uploadFileToS3(url: string, file: File): Promise<void> {
    await axios.put(url, file, {
        headers: {
            "Content-Type": file.type,
        },
    });
}
