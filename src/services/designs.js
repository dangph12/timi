import { api } from '@/lib/api';

export const createDesign = (data) => api.post('v1/designs', { json: data }).json();
