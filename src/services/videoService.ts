import { api } from './api';

interface VideoUrlResponse {
  url: string; // URL .m3u8
}

export const getVideoUrl = async (fileUuid: string): Promise<string> => {
  const response = await api.get<VideoUrlResponse>(`/videos/${fileUuid}/url`);
  return response.data.url;
};