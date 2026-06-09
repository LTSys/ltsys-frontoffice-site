import { api } from './api';

export interface Trail {
  id: number;
  name: string;
  description: string;
  active: boolean;
  orderOfExhibition: number;
}

export const trailService = {
  getAllTrails: async (): Promise<Trail[]> => {
    const response = await api.get<Trail[]>('/trails');
    return response.data;
  },

  getTrailById: async (id: number): Promise<Trail> => {
    const response = await api.get<Trail>(`/trails/${id}`);
    return response.data;
  },
};
