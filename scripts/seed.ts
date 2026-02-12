import { storage } from "../server/storage";
import bcrypt from "bcryptjs";

async function seed() {
  console.log("Seeding database...");

  try {
    // Check if users exist
    const existingAdmin = await storage.getUserByUsername("admin");
    if (!existingAdmin) {
      console.log("Creating admin user...");
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await storage.createUser({
        username: "admin",
        password: hashedPassword,
        role: "admin",
      });
    }

    const existingUser = await storage.getUserByUsername("user");
    let userId;
    if (!existingUser) {
      console.log("Creating normal user...");
      const hashedPassword = await bcrypt.hash("user123", 10);
      const user = await storage.createUser({
        username: "user",
        password: hashedPassword,
        role: "user",
      });
      userId = user.id;
    } else {
      userId = existingUser.id;
    }

    // Check if tasks exist
    const tasks = await storage.getTasks();
    if (tasks.length === 0 && userId) {
      console.log("Creating sample tasks...");
      await storage.createTask({
        title: "Complete the assignment",
        description: "Implement backend APIs and frontend dashboard",
        status: "pending",
        userId: userId,
      });
      await storage.createTask({
        title: "Review code",
        description: "Check for security and scalability issues",
        status: "completed",
        userId: userId,
      });
    }

    console.log("Seeding complete!");
  } catch (error) {
    console.error("Seeding failed:", error);
  }
}

seed();
