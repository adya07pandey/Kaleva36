import api from "./api";

// export const searchCustomers = (search) =>
//   api.get(`/customers?search=${search}`);

export const createCustomer = (data) =>
  api.post("/customers", data);

export const getCustomers = () => api.get("/customers/all");