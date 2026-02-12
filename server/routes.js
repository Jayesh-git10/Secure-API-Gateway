

import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// JWT Secret - in production this should be an env var
const JWT_SECRET = process.env.JWT_SECRET || "development_secret_key_123";

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

export async function registerRoutes(
httpServer,
app)
{

  // --- Auth Routes ---

  app.post(api.auth.register.path, async (req, res) => {
    try {
      const input = api.auth.register.input.parse(req.body);

      const existingUser = await storage.getUserByUsername(input.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const hashedPassword = await bcrypt.hash(input.password, 10);
      const user = await storage.createUser({
        ...input,
        password: hashedPassword,
        role: input.role || "user"
      });

      const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '24h' });

      // Return user without password
      const { password, ...userWithoutPassword } = user;
      res.status(201).json({ token, user: userWithoutPassword });
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  app.post(api.auth.login.path, async (req, res) => {
    try {
      const input = api.auth.login.input.parse(req.body);
      const user = await storage.getUserByUsername(input.username);

      if (!user || !(await bcrypt.compare(input.password, user.password))) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '24h' });

      const { password, ...userWithoutPassword } = user;
      res.status(200).json({ token, user: userWithoutPassword });
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // --- Task Routes (Protected) ---

  app.get(api.tasks.list.path, authenticateToken, async (req, res) => {
    const tasks = await storage.getTasks();
    // In a real app, you might filter tasks by user here unless they are admin
    // For this assignment, we'll return all tasks as a shared board
    res.json(tasks);
  });

  app.get(api.tasks.get.path, authenticateToken, async (req, res) => {
    const id = parseInt(req.params.id);
    const task = await storage.getTask(id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  });

  app.post(api.tasks.create.path, authenticateToken, async (req, res) => {
    try {
      const input = api.tasks.create.input.parse(req.body);
      const userId = req.user.id;
      const task = await storage.createTask({ ...input, userId });
      res.status(201).json(task);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  app.put(api.tasks.update.path, authenticateToken, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const input = api.tasks.update.input.parse(req.body);
      const user = req.user;

      const existingTask = await storage.getTask(id);
      if (!existingTask) return res.status(404).json({ message: "Task not found" });

      // RBAC: Only admin or owner can update
      if (user.role !== 'admin' && existingTask.userId !== user.id) {
        return res.status(403).json({ message: "Forbidden: You can only edit your own tasks" });
      }

      const updatedTask = await storage.updateTask(id, input);
      res.json(updatedTask);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete(api.tasks.delete.path, authenticateToken, async (req, res) => {
    const id = parseInt(req.params.id);
    const user = req.user;

    const existingTask = await storage.getTask(id);
    if (!existingTask) return res.status(404).json({ message: "Task not found" });

    // RBAC: Only admin or owner can delete
    if (user.role !== 'admin' && existingTask.userId !== user.id) {
      return res.status(403).json({ message: "Forbidden: You can only delete your own tasks" });
    }

    await storage.deleteTask(id);
    res.status(204).send();
  });

  return httpServer;
}