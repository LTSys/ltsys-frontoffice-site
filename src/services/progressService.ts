// progressService.ts
import { api } from './api';

export interface Progress {
  id: number | null;
  usuarioId: number;
  materialId: number;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  dataInicio: string | null;
  dataConclusao: string | null;
}

export const progressService = {
  iniciar: async (materialId: number): Promise<Progress> => {
    const res = await api.post<Progress>('/progress/start', { materialId });
    return res.data;
  },
  concluir: async (materialId: number): Promise<Progress> => {
    const res = await api.post<Progress>('/progress/conclude', { materialId });
    return res.data;
  },
  obter: async (materialId: number): Promise<Progress> => {
    const res = await api.get<Progress>(`/progress/${materialId}`);
    return res.data;
  }
};