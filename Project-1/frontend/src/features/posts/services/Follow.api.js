import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000/api/users",
    withCredentials: true,
});


export async function followUser(username) {
    try {
        const { data } = await api.post(`/follow/${username}`);
        return data;
    } catch (error) {
        console.log("Error during following user:", error)
        throw error
    } 
}

export async function unfollowUser(username) {
    try {
        const { data } = await api.post(`/unfollow/${username}`);
        return data;
    } catch (error) {
        console.log("Error during unfollowing user:", error)
        throw error
    }
}