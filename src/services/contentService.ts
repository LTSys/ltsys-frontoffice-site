import { api } from './api';

export interface Content {
  id: number;
  title: string;
  description: string;
  fileUrl: string;
  sequence: number;
  active: boolean;
  type: 'VIDEO' | 'PDF';
  totalDuration: number;
  trilhaId: number;
}

export const getConteudosPorTrilha = async (trilhaId: number): Promise<Content[]> => {
  const response = await api.get(`/material/trail/${trilhaId}`);
  return response.data;
};

export const getContentById = async (id: number): Promise<Content> => {
  const response = await api.get<Content>(`/material/${id}`);
  return response.data;
}