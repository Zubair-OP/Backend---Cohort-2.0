import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000/api/likes",
    withCredentials: true,
});


export async function likePost(postId) {
    try {
        const { data } = await api.post(`/like/${postId}`);
        return data;
    } catch (error) {
        console.log("Error during liking post:", error)
        throw error
    }
}


export async function unlikePost(postId) {
    try {
        const { data } = await api.post(`/unlike/${postId}`);
        return data;
    } catch (error) {
        console.log("Error during unliking post:", error)
        throw error
    }
}