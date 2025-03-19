import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5147;


app.post('/usuarios', async (req, res) => {
  try {
    const user = await prisma.user.create({
      data: {
        name: req.body.name,
        email: req.body.email
      }
    });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error, message: "Erro ao criar usuário." });
  }
});

app.put('/usuarios/:id', async (req, res) => {
  try {
    const { name, email } = req.body;
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: "ID inválido." });
    }

    if (!name || !email) {
      return res.status(400).json({ message: "Nome e email são obrigatórios." });
    }

    const user = await prisma.user.update({
      where: { id },
      data: { name, email },
    });

    res.status(200).json(user);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }
    res.status(500).json({ message: "Erro ao atualizar usuário.", error: error.message });
  }
});

app.delete('/usuarios/:id', async (req, res) => {
  await prisma.user.delete({
    where: {
      id: req.params.id
    },
  })
  res.status(200).json({ message: "usuario deletado com sucesso!" })
})

app.get('/usuarios', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar usuários.", error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
