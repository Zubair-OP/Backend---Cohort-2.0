import axios from "axios";

export const Api = axios.create({
    baseURL: "http://localhost:3000",
    headers: {
        "Content-Type": "application/json",
    },
});


export async function askAi(question){
    const res = await Api.post('/ask', { question });
    return res.data;
}