import Card from '../components/Card';
import './Home.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useModal } from '../context/ModalContext';

const Home = () => {

    const [posts, setPosts] = useState([]);
    const { showModal } = useModal();

    function fetchPosts() {
        axios.get('http://localhost:3000/api/post/', { withCredentials: true })
            .then(res => {
                if (res.data && res.data.posts) {
                    setPosts(res.data.posts);
                }
            })
            .catch(err => {
                if (err.response && err.response.status === 404) {
                    setPosts([]); // Clear posts if none found
                } else {
                    console.log(err);
                }
            });
    }

    useEffect(() => {
        fetchPosts();
    }, []);


    const handleDeletePost = (id) => {

        axios.delete(`http://localhost:3000/api/post/delete-post/${id}`, { withCredentials: true })
            .then(res => {
                console.log(res.data);
                showModal('Success', 'Post deleted successfully', 'success');
                fetchPosts(); // Refresh list after delete
            })
            .catch(err => {
                console.error("Error deleting post:", err);
                const errorMessage = err.response?.data?.message || "Failed to delete post";
                showModal('Action Failed', errorMessage, 'error');
            });
    }

    return (
        <div className="home-page">
            <header className="hero-section">
                <div className="container">
                    <h1 className="hero-title">Welcome to <span className="text-gradient">DaySix</span></h1>
                    <p className="hero-subtitle">Discover stories, thinking, and expertise from writers on any topic.</p>
                </div>
            </header>

            <main className="container main-content">
                <div className="posts-grid">
                    {posts.map(post => (
                        <Card key={post._id || post.id} {...post} onDelete={() => handleDeletePost(post._id)} />
                    ))}
                </div>
            </main>
        </div>
    );
};

export default Home;
