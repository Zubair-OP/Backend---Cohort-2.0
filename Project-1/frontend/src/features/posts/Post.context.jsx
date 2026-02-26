import { createContext,useState } from "react";

export const PostContext = createContext()


export const PostProvider = ({ children }) => {

    const [loading, setloading] = useState(false);
    const [post, setpost] = useState(null);
    const [feed, setfeed] = useState(null);

    return (
        <PostContext.Provider value={{ loading, post, feed, setloading, setpost, setfeed }}>
            {children}
        </PostContext.Provider>
    )
}