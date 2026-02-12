import { db } from "./db";
import { users, tasks } from "@shared/schema";
import { eq } from "drizzle-orm";















export class DatabaseStorage {
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username) {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser) {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getTasks() {
    return await db.select().from(tasks).orderBy(tasks.id);
  }

  async getTask(id) {
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
    return task;
  }

  async createTask(task) {
    const [newTask] = await db.insert(tasks).values(task).returning();
    return newTask;
  }

  async updateTask(id, updates) {
    const [updatedTask] = await db.
    update(tasks).
    set(updates).
    where(eq(tasks.id, id)).
    returning();
    return updatedTask;
  }

  async deleteTask(id) {
    await db.delete(tasks).where(eq(tasks.id, id));
  }
}

export const storage = new DatabaseStorage();