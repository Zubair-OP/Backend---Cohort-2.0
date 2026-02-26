import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000/api/posts",
    withCredentials: true,
});


export async function getFeedPosts() {
    try {
        const { data } = await api.get("/feed");
        return data;
    } catch (error) {
        console.log("Error during registration:", error)
        throw error
    }
}

export async function createPost(file, caption) {
    try {
        const formData = new FormData();
        formData.append("caption", caption);
        formData.append("file", file);
        const { data } = await api.post("/create-post", formData);
        return data;
    } catch (error) {
        console.log("Error during registration:", error)
        throw error
    }
}

