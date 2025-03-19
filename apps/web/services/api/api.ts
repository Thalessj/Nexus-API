import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5147";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

interface User {
  id: string;
  name: string;
  email: string;
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message;
    console.error(`Erro na API: ${message}`);
    return Promise.reject(error);
  }
);

export const fetchUsers = async (): Promise<User[]> => {
  try {
    const response = await api.get<User[]>("/usuarios");
    return response.data;
  } catch (error) {
    console.error("Erro na fetchUsers");
    throw error;
  }
};

export const createUser = async (
  name: string,
  email: string
): Promise<User> => {
  try {
    const response = await api.post<User>("/usuarios", { name, email });
    return response.data;
  } catch (error) {
    console.error("Erro na createUser");
    throw error;
  }
};

export const deleteUser = async (id: string): Promise<any> => {
  try {
    const response = await api.delete(`/usuarios/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro na deleteUser");
    throw error;
  }
};

export const updateUser = async (
  id: string,
  userData: Partial<User>
): Promise<User> => {
  const response = await api.put<User>(`/usuarios/${id}`, userData);
  return response.data;
};

export const getUserById = async (id: string): Promise<User> => {
  const response = await api.get<User>(`/usuarios/${id}`);
  return response.data;
};
