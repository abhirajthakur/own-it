import { z } from "zod";

export const RegisterSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.email("Invalid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password too long"),
});

export const LoginSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;

export type User = {
  id: string;
  name: string;
  email: string;
};

export type RegisterResponse = {
  user: User;
  token: string;
};

export type LoginResponse = {
  token: string;
};
