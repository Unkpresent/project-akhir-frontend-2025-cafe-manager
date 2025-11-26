import axios from 'axios';

const API_URL = 'http://localhost:3000';



export const loginUser = async (username, password) => {
  try {
    // 1. Ambil SEMUA data user dari database
    const response = await axios.get(`${API_URL}/users`);
    
    // 2. Cek manual di sini (lebih aman dari error server)
    const users = response.data;
    const foundUser = users.find(u => u.username === username && u.password === password);
    
    return foundUser || null;
  } catch (error) {
    console.error("Error Login:", error);
    return null;
  }
};

export const getProducts = () => axios.get(`${API_URL}/products`);
export const addProduct = (data) => axios.post(`${API_URL}/products`, data);
export const updateProduct = (id, data) => axios.put(`${API_URL}/products/${id}`, data);
export const deleteProduct = (id) => axios.delete(`${API_URL}/products/${id}`);

// --- NEW: ORDERS SERVICE ---
export const getOrders = () => axios.get(`${API_URL}/orders`);
export const createOrder = (data) => axios.post(`${API_URL}/orders`, data);