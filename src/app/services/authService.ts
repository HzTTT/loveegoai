import { api, setToken, removeToken } from './api';

interface RegisterData {
  email: string;
  password: string;
  name: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface TokenResponse {
  access_token: string;
  token_type: string;
}

interface UserResponse {
  email: string;
  name: string;
  avatar: string;
}

export async function register(data: RegisterData): Promise<UserResponse> {
  return api.post<UserResponse>('/auth/register', data);
}

export async function login(data: LoginData): Promise<string> {
  const res = await api.post<TokenResponse>('/auth/login', data);
  setToken(res.access_token);
  // 保存用户信息到 localStorage
  localStorage.setItem('userName', data.email.split('@')[0]);
  return res.access_token;
}

export function logout() {
  removeToken();
  localStorage.removeItem('userName');
}
