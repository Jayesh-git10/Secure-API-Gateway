import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type InsertTask } from "@shared/routes";
import { getToken } from "./use-auth";
import { useLocation } from "wouter";

// Helper to add Authorization header
function getHeaders() {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
  };
}

export function useTasks() {
  const [_, setLocation] = useLocation();

  return useQuery({
    queryKey: [api.tasks.list.path],
    queryFn: async () => {
      const token = getToken();
      if (!token) return [];

      const res = await fetch(api.tasks.list.path, {
        headers: { "Authorization": `Bearer ${token}` },
      });

      if (res.status === 401) {
        setLocation("/");
        throw new Error("Unauthorized");
      }
      
      if (!res.ok) throw new Error("Failed to fetch tasks");
      return api.tasks.list.responses[200].parse(await res.json());
    },
    retry: false,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  const [_, setLocation] = useLocation();

  return useMutation({
    mutationFn: async (task: InsertTask) => {
      const res = await fetch(api.tasks.create.path, {
        method: api.tasks.create.method,
        headers: getHeaders(),
        body: JSON.stringify(task),
      });

      if (res.status === 401) {
        setLocation("/");
        throw new Error("Unauthorized");
      }

      if (!res.ok) throw new Error("Failed to create task");
      return api.tasks.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.tasks.list.path] });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  const [_, setLocation] = useLocation();

  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & Partial<InsertTask>) => {
      const url = buildUrl(api.tasks.update.path, { id });
      const res = await fetch(url, {
        method: api.tasks.update.method,
        headers: getHeaders(),
        body: JSON.stringify(updates),
      });

      if (res.status === 401) {
        setLocation("/");
        throw new Error("Unauthorized");
      }
      if (res.status === 403) throw new Error("Permission denied");
      if (res.status === 404) throw new Error("Task not found");
      if (!res.ok) throw new Error("Failed to update task");

      return api.tasks.update.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.tasks.list.path] });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  const [_, setLocation] = useLocation();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.tasks.delete.path, { id });
      const res = await fetch(url, {
        method: api.tasks.delete.method,
        headers: { "Authorization": `Bearer ${getToken()}` },
      });

      if (res.status === 401) {
        setLocation("/");
        throw new Error("Unauthorized");
      }
      if (res.status === 403) throw new Error("Permission denied");
      if (!res.ok) throw new Error("Failed to delete task");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.tasks.list.path] });
    },
  });
}
