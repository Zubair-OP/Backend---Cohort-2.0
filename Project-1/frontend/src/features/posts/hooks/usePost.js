import { useContext } from "react";
import { PostContext } from "../Post.context.jsx";
import { getFeedPosts, createPost } from "../services/Post.api.js";
import { likePost, unlikePost } from "../services/like.api.js";
import { followUser, unfollowUser } from "../services/Follow.api.js";

export function useAuth() {
    const { loading, post, feed, setloading, setfeed , follow , unfollow} = useContext(PostContext);

    const handleFeed = async () => {
        setloading(true)
        try {
            const data = await getFeedPosts()
            setfeed(data.posts.reverse())
        } catch (error) {
            console.error("Error fetching feed posts:", error);
        } finally {
            setloading(false)
        }
    }

    const handleCreatePost = async (file, caption) => {
        try {
            setloading(true)
            const data = await createPost(file, caption)
            setfeed([data.post, ...(feed || [])])
        } catch (error) {
            console.error("Error creating post:", error);
        } finally {
            setloading(false)
        }
    }

    const handleLike = async (postId) => {
        try {
            await likePost(postId)
            handleFeed()
        } catch (error) {
            console.error("Error liking post:", error);
        }
    }

    const handleUnlike = async (postId) => {
        try {
            await unlikePost(postId)
            handleFeed()
        } catch (error) {
            console.error("Error unliking post:", error);
        }
    }

    const Handlefollow = async (username) =>{
        try {
            await followUser(username)
            handleFeed()
        } catch (error) {
            console.error("Error following user:", error);
        }
    }

    const HandleUnfollow = async (username) => {
        try {
            await unfollowUser(username)
            handleFeed()
        } catch (error) {
            console.error("Error unfollowing user:", error);
        }
    }

    return { loading, post, feed, handleFeed, handleCreatePost, handleLike, handleUnlike , Handlefollow , HandleUnfollow , follow , unfollow}
}