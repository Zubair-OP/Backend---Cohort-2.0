import axios from "axios"

const Api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
})


export const login = async (email, password) => {
  try {
    const response = await Api.post("/api/auth/login", { email, password })
    return response.data
  } catch (error) {
    console.error("Login error:", error)
    throw error
  }
} 

export const register = async (username, email, password) => {
  try {
    const response = await Api.post("/api/auth/register", { username, email, password })
    return response.data
  } catch (error) {
    console.error("Register error:", error)
    throw error
  }
} 


export const getCurrentUser = async () => {
  try {
    const response = await Api.get("/api/auth/get-me")
    return response.data
  } catch (error) {
    console.error("Get current user error:", error)
    throw error
  }
}


