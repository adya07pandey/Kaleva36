import api from "./api";

export const getOrders = () => api.get("/orders");

export const createOrder = (data) => api.post("/orders", data);

export const updateOrder = (id, data) =>
  api.put(`/orders/${id}`, data);

export const deleteOrder = (id) =>
  api.delete(`/orders/${id}`);

export const updateOrderStatus = (id) =>
  api.patch(`/orders/${id}/status`);