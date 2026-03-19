import { api } from "@shared/api/api";
import type { AuthUser, LoginCredentials, LogoutResponse } from "../types";

export async function login(credentials: LoginCredentials) {
  const { data } = await api.post<AuthUser>("/users/login", credentials);
  return data;
}

export async function getMe() {
  const { data } = await api.get<AuthUser>("/users/me");
  return data;
}

export async function logout() {
  const { data } = await api.post<LogoutResponse>("/users/logout");
  return data;
}
