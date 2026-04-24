import axios from "axios";

const Api = axios.create({
    baseURL:"/api/auth",
    withCredentials:true,
})


export const registerUser = async (email,contact, password, fullName, isSeller ) => {
        const response = await Api.post("/register", email,contact, password, fullName, isSeller );
        return response.data;
}

export const loginUser = async (email, password) => {
    const response = await Api.post("/login", email, password);
    return response.data;
}
export default Api;