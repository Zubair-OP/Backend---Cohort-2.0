import React, { useState, useEffect } from 'react';
import AlbumCard from '../components/AlbumCard';
import './Home.css'; // Reusing Home styles for grid/hero
import axios from 'axios';

const Albums = () => {

    const [albums, setAlbums] = useState([]);

    const fetchAlbums = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/album/getAllalbum', { // Note: API route might be getAllalbum
                withCredentials: true
            });
            if (response.data && response.data.albums) {
                setAlbums(response.data.albums);
            } else {
                setAlbums([]);
            }
        } catch (error) {
            console.error("Error fetching albums:", error);
        }
    };


    useEffect(() => {
        fetchAlbums();
    }, []);


    return (
        <div className="home-page">
            <header className="hero-section">
                <div className="container">
                    <h1 className="hero-title">Visual <span className="text-gradient">Collections</span></h1>
                    <p className="hero-subtitle">Curated albums from our community creators.</p>
                </div>
            </header>

            <main className="container main-content">
                <div className="posts-grid">
                    {albums.map(album => (
                        <AlbumCard key={album.id} {...album} />
                    ))}
                </div>
            </main>
        </div>
    );
};

export default Albums;
