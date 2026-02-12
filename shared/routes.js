import { z } from "zod";
import { insertUserSchema, insertTaskSchema } from "./schema";

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional()
  }),
  notFound: z.object({
    message: z.string()
  }),
  unauthorized: z.object({
    message: z.string()
  })
};

export const api = {
  auth: {
    register: {
      method: "POST",
      path: "/api/auth/register",
      input: insertUserSchema,
      responses: {
        201: z.object({
          token: z.string(),
          user: z.custom()
        }),
        400: errorSchemas.validation
      }
    },
    login: {
      method: "POST",
      path: "/api/auth/login",
      input: insertUserSchema.omit({ role: true }), // Login doesn't need role
      responses: {
        200: z.object({
          token: z.string(),
          user: z.custom()
        }),
        401: errorSchemas.unauthorized
      }
    }
  },
  tasks: {
    list: {
      method: "GET",
      path: "/api/tasks",
      responses: {
        200: z.array(z.custom()),
        401: errorSchemas.unauthorized
      }
    },
    get: {
      method: "GET",
      path: "/api/tasks/:id",
      responses: {
        200: z.custom(),
        404: errorSchemas.notFound,
        401: errorSchemas.unauthorized
      }
    },
    create: {
      method: "POST",
      path: "/api/tasks",
      input: insertTaskSchema,
      responses: {
        201: z.custom(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized
      }
    },
    update: {
      method: "PUT",
      path: "/api/tasks/:id",
      input: insertTaskSchema.partial(),
      responses: {
        200: z.custom(),
        404: errorSchemas.notFound,
        401: errorSchemas.unauthorized,
        403: errorSchemas.unauthorized // Forbidden
      }
    },
    delete: {
      method: "DELETE",
      path: "/api/tasks/:id",
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
        401: errorSchemas.unauthorized,
        403: errorSchemas.unauthorized
      }
    }
  }
};

export function buildUrl(path, params) {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}