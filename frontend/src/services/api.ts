import axios from 'axios';

const api = axios.create({
    baseURL: 'https://dumbthon2-0.onrender.com/api'
});

export const faceUnlock = (faceDescriptor: number[]) => api.post('/auth/unlock', { faceDescriptor });
export const registerFace = (name: string, email: string, phone: string, faceDescriptor: number[]) => api.post('/auth/register', { name, email, phone, faceDescriptor });

export const getItems = () => api.get('/items');
export const createItem = (itemData: any) => api.post('/items/create', itemData);
export const deleteItem = (id: string) => api.delete(`/items/${id}`);

export const requestTrade = (tradeData: any) => api.post('/trades/request', tradeData);
export const getTrades = (userId: string) => api.get(`/trades?userId=${userId}`);
export const updateTradeStatus = (id: string, status: string) => api.put(`/trades/${id}`, { status });

export const placeOrder = (orderData: any) => api.post('/orders', orderData);
export const getOrders = (userId: string) => api.get(`/orders/${userId}`);

export default api;

