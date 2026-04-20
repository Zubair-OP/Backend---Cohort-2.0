import axios from "axios";

const Api = axios.create({
    baseURL:"http://localhost:3000/api/auth",
    withCredentials:true,
})


export const registerUser = async (email,contact, password, fullName, isSeller ) => {
        const response = await Api.post("/register", email,contact, password, fullName, isSeller );
        return response.data;
}
export default Api;