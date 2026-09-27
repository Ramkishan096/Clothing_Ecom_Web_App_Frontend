import api from './axios';

const getErrorMessage = (error) => {
  console.error("API Error:", error);
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    'Request failed'
  );
};

export const orderApi = {
    getBuyerOrders: async () => {
    console.log("Calling API getBuyerOrders");
    const res = await api.get(`/order/buyerOrder`);
    return res.data;
  },
}



export { getErrorMessage };