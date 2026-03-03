import api from "./api";

export const searchMenuItems = (search) =>
  api.get(`/menu?search=${search}`);

export const createMenuItem = (data) =>
  api.post("/menu", data);

export const getMenuItems = () => api.get("/menu/items");