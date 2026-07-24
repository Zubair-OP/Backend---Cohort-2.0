import axios from "axios";

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginRequestPayload extends LoginPayload {
  rememberMe?: boolean;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
}

export const getCurrentSessionApi = async () => {
  const response = await axios.get("/api/auth/me");

  return response.data;
};

export const logoutApi = async () => {
  const response = await axios.post("/api/auth/logout");

  return response.data;
};

export const forgotPasswordApi = async (payload: ForgotPasswordPayload) => {
  const response = await axios.post("/api/auth/forgot-password", payload);

  return response.data;
};

export const resetPasswordApi = async (payload: ResetPasswordPayload) => {
  const response = await axios.post("/api/auth/reset-password", payload);

  return response.data;
};

export const registerApi = async (
  payload: RegisterPayload
) => {
  const response = await axios.post(
    "/api/auth/register",
    payload
  );

  return response.data;
};

export const loginApi = async (
  payload: LoginRequestPayload
) => {
  const response = await axios.post(
    "/api/auth/login",
    payload
  );

  return response.data;
};