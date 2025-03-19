"use client";
import { useEffect, useState } from "react";
import { fetchUsers, createUser, deleteUser } from "../../services/api/api";

interface User {
  id: string;
  name: string;
  email: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true);
      try {
        const data = await fetchUsers();
        setUsers(data);
        setError(null);
      } catch (error) {
        console.error("Erro ao carregar usuários:", error);
        setError("Não foi possível carregar os usuários. Tente novamente.");
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, []);

  const handleAddUser = async () => {
    if (!name.trim() || !email.trim()) return;

    setIsLoading(true);
    try {
      const newUser = await createUser(name, email);
      setUsers((prevUsers) => [...prevUsers, newUser]);
      setName("");
      setEmail("");
      setError(null);
    } catch (error) {
      console.error("Erro ao adicionar usuário:", error);
      setError("Não foi possível adicionar o usuário. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    setIsLoading(true);
    try {
      await deleteUser(id);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
      setError(null);
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
      setError("Não foi possível excluir o usuário. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-4">Gerenciar Usuários</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="mb-6 p-4 bg-gray-50 rounded shadow-sm">
        <h2 className="text-lg font-medium mb-3">Adicionar Novo Usuário</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 rounded flex-1"
            disabled={isLoading}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 rounded flex-1"
            disabled={isLoading}
          />
          <button
            onClick={handleAddUser}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:bg-blue-300"
            disabled={isLoading || !name.trim() || !email.trim()}
          >
            {isLoading ? "Adicionando..." : "Adicionar"}
          </button>
        </div>
      </div>

      <div className="border rounded shadow-sm">
        <h2 className="text-lg font-medium p-4 bg-gray-50 border-b">
          Lista de Usuários
        </h2>

        {isLoading && users.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            Carregando usuários...
          </div>
        ) : users.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            Nenhum usuário encontrado
          </div>
        ) : (
          <ul>
            {users.map((user) => (
              <li
                key={user.id}
                className="flex justify-between items-center p-4 border-b last:border-b-0 hover:bg-gray-50"
              >
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-gray-600 text-sm">{user.email}</p>
                </div>
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  className="text-red-500 hover:text-red-700 disabled:text-red-300"
                  disabled={isLoading}
                >
                  {isLoading ? "..." : "Excluir"}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
