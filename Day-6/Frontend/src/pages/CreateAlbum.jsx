import React, { useState } from 'react';
import './CreateAlbum.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateAlbum = () => {
    const navigate = useNavigate();
    const [previews, setPreviews] = useState([]);

    const handleImagesChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        if (selectedFiles.length > 0) {
            const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
            setPreviews(newPreviews);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const form = e.target;
        const title = form.title.value;
        const fileInput = form.images; // Input element with name="images"

        if (!fileInput.files.length) {
            alert("Please select at least one image");
            return;
        }

        const formData = new FormData();
        formData.append('title', title);

        // Append each file separately with the same key 'images'
        for (let i = 0; i < fileInput.files.length; i++) {
            formData.append('images', fileInput.files[i]);
        }

        try {
            await axios.post('http://localhost:3000/api/album/create-album', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });

            alert("Album created successfully!");
            navigate('/albums');
        } catch (error) {
            console.error("Album creation error:", error);
            const msg = error.response?.data?.message || "Failed to create album";
            alert(msg);
        }
    };

    return (
        <div className="create-album-page">
            <div className="container">
                <div className="form-card">
                    <h1 className="form-title">Create New Album</h1>
                    <p className="form-subtitle">Curate your moments into a collection</p>

                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label className="input-label" htmlFor="title">Album Title</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                className="input-field"
                                placeholder="Summer Vacation 2024"
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label">Upload Photos</label>
                            <div className="image-upload-area">
                                <input
                                    type="file"
                                    id="album-upload"
                                    name="images"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImagesChange}
                                    hidden
                                    required
                                />
                                <label htmlFor="album-upload" className="upload-label">
                                    <div className="upload-placeholder">
                                        <span className="material-icons upload-icon">collections</span>
                                        <span>Click to upload photos</span>
                                        <span className="upload-hint">Select multiple images</span>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {previews.length > 0 && (
                            <div className="previews-section">
                                <label className="input-label">Selected Photos ({previews.length})</label>
                                <div className="preview-grid">
                                    {previews.map((src, index) => (
                                        <div key={index} className="preview-item">
                                            <img src={src} alt={`Preview ${index}`} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <button type="submit" className="btn btn-primary submit-btn">
                            Create Album
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateAlbum;
