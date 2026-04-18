import axios from "axios"

const Api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
})

function getApiErrorMessage(error, fallbackMessage) {
  return (
    error.response?.data?.message ||
    error.response?.data?.errors?.[0]?.message ||
    error.message ||
    fallbackMessage
  )
}

export const login = async (email, password) => {
  try {
    const response = await Api.post("/api/auth/login", { email, password })
    return response.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Login failed"))
  }
} 

export const register = async (username, email, password) => {
  try {
    const response = await Api.post("/api/auth/register", { username, email, password })
    return response.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Registration failed"))
  }
} 


export const getCurrentUser = async () => {
  try {
    const response = await Api.get("/api/auth/get-me")
    return response.data
  } catch (error) {
    if (error.response?.status === 401) {
      return { user: null }
    }
    throw new Error(getApiErrorMessage(error, "Failed to fetch current user"))
  }
}


