import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api'
});

export const faceUnlock = (faceDescriptor: number[]) => api.post('/auth/unlock', { faceDescriptor });
export const registerFace = (name: string, faceDescriptor: number[]) => api.post('/auth/register', { name, faceDescriptor });

export const getItems = () => api.get('/items');
export const createItem = (itemData: any) => api.post('/items/create', itemData);
export const deleteItem = (id: string) => api.delete(`/items/${id}`);

export const requestTrade = (tradeData: any) => api.post('/trades/request', tradeData);
export const getTrades = (userId: string) => api.get(`/trades?userId=${userId}`);
export const updateTradeStatus = (id: string, status: string) => api.put(`/trades/${id}`, { status });

export default api;
