import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import authRoutes from "./auth/auth.controller.js";

const prisma = new PrismaClient();
const app = express();

app.use(express.json());
app.use(cors());

app.use("/auth", authRoutes);

const PORT = process.env.PORT || 5147;

app.post("/usuarios", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Nome, email e senha são obrigatórios." });
    }

    const user = await prisma.user.create({
      data: { name, email, password },
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar usuário.", error: error.message });
  }
});


app.put("/usuarios/:id", async (req, res) => {
  try {
    const { name, email } = req.body;
    const { id } = req.params;

    if (!name || !email) {
      return res.status(400).json({ message: "Nome e email são obrigatórios." });
    }

    const user = await prisma.user.update({
      where: { id },
      data: { name, email },
    });

    res.status(200).json(user);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }
    res.status(500).json({ message: "Erro ao atualizar usuário.", error: error.message });
  }
});

app.delete("/usuarios/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.user.delete({
      where: { id },
    });

    res.status(200).json({ message: "Usuário deletado com sucesso!" });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }
    res.status(500).json({ message: "Erro ao deletar usuário.", error: error.message });
  }
});

app.get("/usuarios", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar usuários.", error: error.message });
  }
});

app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
